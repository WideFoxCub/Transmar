import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LinesService } from '../lines.service';
import { AssemblyLine } from '../line.model';
import { ProductsService } from '../../products/products.service';
import { Product } from '../../products/product.model';

@Component({
  selector: 'app-lines-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lines-page.html'
})
export class LinesPage implements OnInit {
  products: Product[] = [];
  selectedProductId: number | null = null;

  lines: AssemblyLine[] = [];
  loading = true;
  error: string | null = null;

  form = { name: '', status: 1 };
  editing = false;
  editingId: number | null = null;

  constructor(
    private productsService: ProductsService,
    private linesService: LinesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.productsService.getAll().subscribe({
      next: (p) => {
        this.products = p;
        this.selectedProductId = p.length ? p[0].productId : null;
        this.loadLines();
      },
      error: (e) => this.fail('The products failed to download', e)
    });
  }

  loadLines(): void {
    const pid = Number(this.selectedProductId);
    if (!pid) {
      this.lines = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.linesService.getAll(pid).subscribe({
      next: (data) => {
        this.lines = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => this.fail('Failed to retrieve the line', e)
    });
  }

  edit(l: AssemblyLine): void {
    this.editing = true;
    this.editingId = l.alassLineId;
    this.form = { name: l.name, status: Number(l.status) };
    this.cdr.detectChanges();
  }

  cancel(): void {
    this.editing = false;
    this.editingId = null;
    this.form = { name: '', status: 1 };
    this.error = null;
    this.cdr.detectChanges();
  }

  save(): void {
    const pid = Number(this.selectedProductId);
    const status = Number(this.form.status);
    const name = this.form.name.trim();

    if (!pid) { this.error = 'Select a product'; this.cdr.detectChanges(); return; }
    if (!name) { this.error = 'Name is required'; this.cdr.detectChanges(); return; }

    if (!this.editing) {
      this.linesService.create({
        productId: pid,
        name,
        status
      } as any).subscribe({
        next: () => { this.cancel(); this.loadLines(); },
        error: (e) => this.fail('Create failed', e)
      });
      return;
    }

    const updated: AssemblyLine = {
      alassLineId: this.editingId!,
      productId: pid,
      name,
      status
    };

    this.linesService.update(updated).subscribe({
      next: () => { this.cancel(); this.loadLines(); },
      error: (e) => this.fail('Update failed', e)
    });
  }

  remove(l: AssemblyLine): void {
    if (!confirm(`Delete line "${l.name}"?`)) return;

    this.linesService.delete(l.alassLineId).subscribe({
      next: () => this.loadLines(),
      error: (e) => this.fail('Delete failed', e)
    });
  }

  private fail(msg: string, err: any): void {
    console.error(err);
    this.error = msg;
    this.loading = false;
    this.cdr.detectChanges();
  }
}
