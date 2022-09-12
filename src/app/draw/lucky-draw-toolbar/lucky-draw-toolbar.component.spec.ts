import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckyDrawToolbarComponent } from './lucky-draw-toolbar.component';

describe('LuckyDrawToolbarComponent', () => {
  let component: LuckyDrawToolbarComponent;
  let fixture: ComponentFixture<LuckyDrawToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuckyDrawToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuckyDrawToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
