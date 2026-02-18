import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductsService } from '../../products/products.service';
import { Product } from '../../products/product.model';

import { LinesService } from '../../lines/lines.service';
import { AssemblyLine } from '../../lines/line.model';

import { WorkstationsService } from '../../workstations/workstations.service';
import { Workstation } from '../../workstations/workstation.model';

import { AllocationsService } from '../allocations.service';
import { AllocationRow } from '../allocation.model';

@Component({
  selector: 'app-allocations-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './allocations-page.html'
})
export class AllocationsPage implements OnInit {
  products: Product[] = [];
  lines: AssemblyLine[] = [];
  workstations: Workstation[] = [];

  selectedProductId: number | null = null;
  selectedLineId: number | null = null;

  selectedWorkstationId: number | null = null;

  rows: AllocationRow[] = [];
  loading = true;
  error: string | null = null;

  selectedIds = new Set<number>();

  constructor(
    private productsService: ProductsService,
    private linesService: LinesService,
    private workstationsService: WorkstationsService,
    private allocationsService: AllocationsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInit();
  }

  private loadInit(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.productsService.getAll().subscribe({
      next: (p) => {
        this.products = p;
        this.selectedProductId = p.length ? p[0].productId : null;

        this.workstationsService.getAll().subscribe({
          next: (w) => {
            this.workstations = w;
            this.selectedWorkstationId = w.length ? w[0].alwstationId : null;

            this.onProductChanged();
          },
          error: (e) => this.fail('Nie udało się pobrać stanowisk', e)
        });
      },
      error: (e) => this.fail('Nie udało się pobrać produktów', e)
    });
  }

  onProductChanged(): void {
    if (!this.selectedProductId) return;

    this.lines = [];
    this.selectedLineId = null;
    this.rows = [];
    this.selectedIds.clear();

    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.linesService.getAll(this.selectedProductId).subscribe({
      next: (lines) => {
        this.lines = lines;
        this.selectedLineId = lines.length ? lines[0].alassLineId : null;
        this.loadAllocations();
      },
      error: (e) => this.fail('Nie udało się pobrać linii', e)
    });
  }

  onLineChanged(): void {
    this.selectedIds.clear();
    this.loadAllocations();
  }

  loadAllocations(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    const pid = this.selectedProductId ?? undefined;
    const lid = this.selectedLineId ?? undefined;

    this.allocationsService.getAll(pid, lid).subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => this.fail('Nie udało się pobrać alokacji', e)
    });
  }

  toggleRow(id: number, checked: boolean): void {
    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
  }

  toggleAll(checked: boolean): void {
    this.selectedIds.clear();
    if (checked) this.rows.forEach(r => this.selectedIds.add(r.allocationId));
  }

  allocate(): void {
    if (!this.selectedLineId || !this.selectedWorkstationId) return;

    this.allocationsService.allocate(this.selectedLineId, this.selectedWorkstationId).subscribe({
      next: () => this.loadAllocations(),
      error: (e) => this.fail('Allocate failed', e)
    });
  }

  removeSelected(): void {
    const ids = Array.from(this.selectedIds);
    if (ids.length === 0) return;

    if (!confirm(`Remove ${ids.length} allocation(s)?`)) return;

    this.allocationsService.remove(ids).subscribe({
      next: () => {
        this.selectedIds.clear();
        this.loadAllocations();
      },
      error: (e) => this.fail('Remove failed', e)
    });
  }

  private fail(msg: string, err: any): void {
    console.error(err);
    this.error = msg;
    this.loading = false;
    this.cdr.detectChanges();
  }
}
