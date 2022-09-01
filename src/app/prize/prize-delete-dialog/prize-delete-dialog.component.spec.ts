import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeDeleteDialogComponent } from './prize-delete-dialog.component';

describe('PrizeDeleteDialogComponent', () => {
  let component: PrizeDeleteDialogComponent;
  let fixture: ComponentFixture<PrizeDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizeDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
