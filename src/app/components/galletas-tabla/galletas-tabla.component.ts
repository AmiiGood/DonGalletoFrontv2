import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GalletaService } from '../../services/galleta.service';
import { ProductionService } from '../../services/production.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-galletas-tabla',
  templateUrl: './galletas-tabla.component.html',
  styleUrl: './galletas-tabla.component.css',
})
export class GalletasTablaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() production = new EventEmitter<number>();

  displayedColumns: string[] = [
    'select', // Nueva columna para el radio button
    'name',
    'description',
    'stock',
    'status',
    'price',
  ];

  dataSource = new MatTableDataSource<any>();
  showAllCookies = false;
  selectedCookieId: number | null = null;

  constructor(
    private cookieService: GalletaService,
    private productionService: ProductionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCookies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSelectionChange(cookieId: number) {
    this.selectedCookieId = cookieId;
  }

  sendToProduction() {
    if (this.selectedCookieId) {
      // Primero verificamos la disponibilidad
      this.productionService
        .checkIngredientAvailability(this.selectedCookieId)
        .subscribe({
          next: (response) => {
            if (response.available) {
              // Si hay ingredientes disponibles, procedemos con la producción
              this.startProductionProcess();
            } else {
              // Si no hay ingredientes suficientes, mostramos el mensaje de error
              this.showMissingIngredientsError(response.missingIngredients);
            }
          },
          error: (error) => {
            console.error('Error checking availability:', error);
            this.snackBar.open(
              'Error al verificar la disponibilidad de ingredientes',
              'Cerrar',
              { duration: 5000 }
            );
          },
        });
    }
  }

  private startProductionProcess() {
    this.productionService.startProduction(this.selectedCookieId!).subscribe({
      next: () => {
        this.router.navigate(['/production']);
      },
      error: (error) => {
        console.error('Error starting production:', error);
        this.snackBar.open('Error al iniciar la producción', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  private showMissingIngredientsError(missingIngredients: any[]) {
    const message = this.formatMissingIngredientsMessage(missingIngredients);
    this.snackBar.open(message, 'Cerrar', {
      duration: 8000,
      panelClass: ['error-snackbar'],
    });
  }

  private formatMissingIngredientsMessage(missingIngredients: any[]): string {
    let message = 'No hay suficientes ingredientes:\n';
    missingIngredients.forEach((ingredient) => {
      message += `${ingredient.name}: Requiere ${ingredient.required}g, Disponible ${ingredient.available}g\n`;
    });
    return message;
  }

  loadCookies() {
    this.cookieService.getCookiesBoolean(this.showAllCookies).subscribe({
      next: (data) => {
        this.dataSource.data = data.cookies || data;
        console.log('Cookies loaded:', this.dataSource.data);
      },
      error: (error) => console.error('Error loading cookies:', error),
    });
  }

  getStockClass(stock: number): string {
    if (stock <= 10) return 'stock-low';
    if (stock <= 50) return 'stock-medium';
    return 'stock-high';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase() === 'existencia'
      ? 'status-existencia'
      : 'status-agotado';
  }
}
