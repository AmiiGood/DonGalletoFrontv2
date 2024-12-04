import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GalletaService } from '../../services/galleta.service';

@Component({
  selector: 'app-galletas-tabla',
  templateUrl: './galletas-tabla.component.html',
  styleUrl: './galletas-tabla.component.css',
})
export class GalletasTablaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'name',
    'description',
    'stock',
    'status',
    'price',
  ];
  dataSource = new MatTableDataSource<any>();
  showAllCookies = false;

  constructor(private cookieService: GalletaService) {}

  ngOnInit() {
    this.loadCookies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCookies() {
    this.cookieService.getCookiesBoolean(this.showAllCookies).subscribe({
      next: (data) => {
        this.dataSource.data = data.cookies || data;
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
