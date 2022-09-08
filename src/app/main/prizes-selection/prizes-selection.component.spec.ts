import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesSelectionComponent } from './prizes-selection.component';

describe('PrizesSelectionComponent', () => {
  let component: PrizesSelectionComponent;
  let fixture: ComponentFixture<PrizesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizesSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
