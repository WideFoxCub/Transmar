import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationsPage } from './workstations-page';

describe('WorkstationsPage', () => {
  let component: WorkstationsPage;
  let fixture: ComponentFixture<WorkstationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkstationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
