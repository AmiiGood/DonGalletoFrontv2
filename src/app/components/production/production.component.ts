import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Cookie } from '../../interfaces/galleta/cookie';
import { GalletaService } from '../../services/galleta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

interface ProductionItem {
  id: number;
  cookieId: number;
  unitsProduced: number;
  name?: string;
  recipeId?: number;
  description?: string;
  status?: string;
  price?: {
    unit: number;
    package500g: number;
    package1000g: number;
    pricePerGram: number;
  };
  stock?: number;
  weightPerUnit?: number;
}

export interface ProductionCookie extends Cookie {
  cookieId: number;
}

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrl: './production.component.css',
})
export class ProductionComponent implements OnInit {
  preparacion: ProductionItem[] = [];
  horneado: ProductionItem[] = [];
  enfriamiento: ProductionItem[] = [];
  lista: ProductionItem[] = [];
  cookies: Cookie[] = [];

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  private apiUrl = 'http://localhost:8080/backDonGalleto/api/production';

  constructor(
    private http: HttpClient,
    private galletaService: GalletaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProductionStatus();
    this.loadCookies();
  }

  loadCookies() {
    this.galletaService.getCookies().subscribe((cookies) => {
      this.cookies = cookies;
      this.updateCookieInfo();
    });
  }

  loadProductionStatus() {
    this.http.get<any>(`${this.apiUrl}/status`).subscribe((data) => {
      this.preparacion = [...(data.preparacion || [])];
      this.horneado = [...(data.horneado || [])];
      this.enfriamiento = [...(data.enfriamiento || [])];
      this.lista = []; // Siempre mantenemos la lista vacía
      this.updateCookieInfo();
      console.log('loadProductionStatus', data);
    });
  }

  updateCookieInfo() {
    [this.preparacion, this.horneado, this.enfriamiento].forEach(
      (stage, index) => {
        const updatedStage = stage.map((item) => {
          const cookieInfo = this.cookies.find((c) => c.id === item.cookieId);
          if (cookieInfo) {
            const { id: cookieId, ...cookieProps } = cookieInfo;
            return {
              ...item,
              ...cookieProps,
            };
          }
          return item;
        });

        switch (index) {
          case 0:
            this.preparacion = updatedStage;
            break;
          case 1:
            this.horneado = updatedStage;
            break;
          case 2:
            this.enfriamiento = updatedStage;
            break;
        }
      }
    );
  }

  async drop(event: CdkDragDrop<ProductionItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id;

      if (newStatus === 'lista') {
        const dialogRef = this.dialog.open(this.confirmDialog, {
          width: '300px',
          disableClose: true,
        });

        const result = await dialogRef.afterClosed().toPromise();
        if (!result) {
          return;
        }
      }

      await this.processStatusUpdate(event, item, newStatus);
    }
  }

  async processStatusUpdate(
    event: any,
    item: ProductionItem,
    newStatus: string
  ) {
    try {
      await this.updateStatus(item.id, newStatus);
      this.snackBar.open('Estado actualizado correctamente', 'Cerrar', {
        duration: 3000,
      });

      if (newStatus === 'lista') {
        // Primero completamos la producción
        await this.completeProduction(item.id);

        // Luego actualizamos el estado de la cookie a "Existencia"
        this.galletaService
          .updateCookieStatus(item.cookieId, 'Existencia')
          .subscribe({
            next: () => {
              console.log(
                `Cookie ${item.cookieId} status updated to Existencia`
              );
              this.snackBar.open(
                'Producción finalizada y estatus de galleta actualizado',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            },
            error: (error) => {
              console.error('Error updating cookie status:', error);
              this.snackBar.open(
                'Error al actualizar el estado de la galleta',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            },
          });

        this.loadProductionStatus();
        this.loadCookies(); // Recargamos las cookies para actualizar la información
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open('Ocurrió un error al actualizar el estado', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  private updateStatus(productionId: number, newStatus: string) {
    console.log('updateStatus', productionId, newStatus);
    return this.http
      .patch(`${this.apiUrl}/cookies/${productionId}/status`, {
        newStatus,
      })
      .toPromise();
  }

  private completeProduction(productionId: number) {
    return this.http
      .post(`${this.apiUrl}/cookies/${productionId}/complete`, {})
      .toPromise();
  }
}
