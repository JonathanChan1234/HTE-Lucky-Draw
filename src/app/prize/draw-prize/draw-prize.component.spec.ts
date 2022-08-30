import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawPrizeComponent } from './draw-prize.component';

describe('DrawPrizeComponent', () => {
  let component: DrawPrizeComponent;
  let fixture: ComponentFixture<DrawPrizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawPrizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
