import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeImportDialogComponent } from './prize-import-dialog.component';

describe('PrizeImportDialogComponent', () => {
  let component: PrizeImportDialogComponent;
  let fixture: ComponentFixture<PrizeImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizeImportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
