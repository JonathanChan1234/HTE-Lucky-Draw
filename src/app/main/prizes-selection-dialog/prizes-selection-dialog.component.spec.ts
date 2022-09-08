import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesSelectionDialogComponent } from './prizes-selection-dialog.component';

describe('PrizesSelectionDialogComponent', () => {
  let component: PrizesSelectionDialogComponent;
  let fixture: ComponentFixture<PrizesSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizesSelectionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizesSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
