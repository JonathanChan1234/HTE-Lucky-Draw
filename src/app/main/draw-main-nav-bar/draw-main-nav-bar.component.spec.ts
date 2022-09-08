import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawMainNavBarComponent } from './draw-main-nav-bar.component';

describe('DrawMainNavBarComponent', () => {
  let component: DrawMainNavBarComponent;
  let fixture: ComponentFixture<DrawMainNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawMainNavBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawMainNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
