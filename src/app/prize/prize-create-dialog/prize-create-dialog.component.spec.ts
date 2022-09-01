import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeCreateDialogComponent } from './prize-create-dialog.component';

describe('PrizeCreateDialogComponent', () => {
  let component: PrizeCreateDialogComponent;
  let fixture: ComponentFixture<PrizeCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizeCreateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
