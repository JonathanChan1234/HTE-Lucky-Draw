import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSideNavBarComponent } from './draw-side-nav-bar.component';

describe('DrawSideNavBarComponent', () => {
  let component: DrawSideNavBarComponent;
  let fixture: ComponentFixture<DrawSideNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawSideNavBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawSideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
