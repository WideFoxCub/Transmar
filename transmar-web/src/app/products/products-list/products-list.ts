import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.html'
})
export class ProductsList implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  form = { name: '', active: true };
  editing = false;
  editingId: number | null = null;

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.productsService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'The products failed to download';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit(p: Product): void {
    this.editing = true;
    this.editingId = p.productId;
    this.form = { name: p.name, active: p.active };
    this.cdr.detectChanges();
  }

  cancel(): void {
    this.editing = false;
    this.editingId = null;
    this.form = { name: '', active: true };
    this.error = null;
    this.cdr.detectChanges();
  }

  save(): void {
    const name = (this.form.name ?? '').trim();
    if (!name) {
      this.error = 'Name is required.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.editing) {
      this.productsService.create({ name, active: this.form.active }).subscribe({
        next: () => {
          this.cancel();
          this.load();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Create failed';
          this.cdr.detectChanges();
        }
      });
      return;
    }

    const updated: Product = {
      productId: this.editingId!,
      name,
      active: this.form.active
    };

    this.productsService.update(updated).subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Update failed';
        this.cdr.detectChanges();
      }
    });
  }

  remove(p: Product): void {
    if (!confirm(`Delete product "${p.name}"?`)) return;

    this.productsService.delete(p.productId).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error(err);
        this.error = 'Delete failed';
        this.cdr.detectChanges();
      }
    });
  }
}
