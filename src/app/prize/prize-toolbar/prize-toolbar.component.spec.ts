import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeToolbarComponent } from './prize-toolbar.component';

describe('PrizeToolbarComponent', () => {
  let component: PrizeToolbarComponent;
  let fixture: ComponentFixture<PrizeToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizeToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
