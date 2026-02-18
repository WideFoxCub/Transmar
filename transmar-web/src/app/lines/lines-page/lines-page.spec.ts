import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesPage } from './lines-page';

describe('LinesPage', () => {
  let component: LinesPage;
  let fixture: ComponentFixture<LinesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
