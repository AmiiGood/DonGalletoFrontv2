import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SaleService } from '../../services/sale.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-tabla',
  templateUrl: './sales-tabla.component.html',
  styleUrl: './sales-tabla.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SalesTablaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['date', 'itemCount', 'total', 'expand'];
  dataSource = new MatTableDataSource<any>();
  expandedElement: any | null;

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit() {
    this.loadSales();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSales() {
    this.saleService.getAllSales().subscribe({
      next: (data) => {
        const salesWithCount = (data.sales || data).map((sale: any) => ({
          ...sale,
          itemCount: sale.items.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          ),
        }));
        this.dataSource.data = salesWithCount;
      },
      error: (error) => console.error('Error loading sales:', error),
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  navigateToInsert() {
    this.router.navigate(['/ventas-insert']);
  }
}
