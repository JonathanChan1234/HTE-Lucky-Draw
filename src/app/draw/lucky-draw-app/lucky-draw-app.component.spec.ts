import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckyDrawAppComponent } from './lucky-draw-app.component';

describe('LuckyDrawAppComponent', () => {
  let component: LuckyDrawAppComponent;
  let fixture: ComponentFixture<LuckyDrawAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuckyDrawAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuckyDrawAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
