import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationsPage } from './allocations-page';

describe('AllocationsPage', () => {
  let component: AllocationsPage;
  let fixture: ComponentFixture<AllocationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
