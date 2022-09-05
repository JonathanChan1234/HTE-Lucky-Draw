import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeEditDialogComponent } from './prize-edit-dialog.component';

describe('PrizeEditDialogComponent', () => {
  let component: PrizeEditDialogComponent;
  let fixture: ComponentFixture<PrizeEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizeEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
