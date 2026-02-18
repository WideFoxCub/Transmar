import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkstationsService } from '../workstations.service';
import { Workstation } from '../workstation.model';

@Component({
  selector: 'app-workstations-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workstations-page.html'
})
export class WorkstationsPage implements OnInit {
  items: Workstation[] = [];
  loading = true;
  error: string | null = null;

  form = { name: '', shortName: '', opName: '', autoStart: false };
  editing = false;
  editingId: number | null = null;

  constructor(private svc: WorkstationsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.svc.getAll().subscribe({
      next: (data) => { this.items = data; this.loading = false; this.cdr.detectChanges(); },
      error: (e) => { console.error(e); this.error = 'Failed to download positions'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  edit(w: Workstation): void {
    this.editing = true;
    this.editingId = w.alwstationId;
    this.form = { name: w.name, shortName: w.shortName, opName: w.opName ?? '', autoStart: w.autoStart };
    this.cdr.detectChanges();
  }

  cancel(): void {
    this.editing = false;
    this.editingId = null;
    this.form = { name: '', shortName: '', opName: '', autoStart: false };
    this.error = null;
    this.cdr.detectChanges();
  }

  save(): void {
    const name = this.form.name.trim();
    const shortName = this.form.shortName.trim();
    if (!name || !shortName) { this.error = 'Name and ShortName are required'; this.cdr.detectChanges(); return; }

    if (!this.editing) {
      this.svc.create({ name, shortName, opName: this.form.opName?.trim() || null, autoStart: this.form.autoStart }).subscribe({
        next: () => { this.cancel(); this.load(); },
        error: (e) => { console.error(e); this.error = 'Create failed'; this.cdr.detectChanges(); }
      });
      return;
    }

    const updated: Workstation = {
      alwstationId: this.editingId!,
      name,
      shortName,
      opName: this.form.opName?.trim() || null,
      autoStart: this.form.autoStart
    };

    this.svc.update(updated).subscribe({
      next: () => { this.cancel(); this.load(); },
      error: (e) => { console.error(e); this.error = 'Update failed'; this.cdr.detectChanges(); }
    });
  }

  remove(w: Workstation): void {
    if (!confirm(`Delete workstation "${w.name}"?`)) return;

    this.svc.delete(w.alwstationId).subscribe({
      next: () => this.load(),
      error: (e) => { console.error(e); this.error = 'Delete failed'; this.cdr.detectChanges(); }
    });
  }
}
