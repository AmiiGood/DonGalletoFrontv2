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
    private router: Router
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
      this.productionService.startProduction(this.selectedCookieId).subscribe({
        next: () => {
          this.router.navigate(['/production']);
        },
        error: (error) => {
          console.error('Error starting production:', error);
          // Aquí podrías agregar un manejo de errores más específico
        },
      });
    }
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
