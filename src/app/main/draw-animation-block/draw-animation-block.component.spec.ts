import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAnimationBlockComponent } from './draw-animation-block.component';

describe('DrawAnimationBlockComponent', () => {
  let component: DrawAnimationBlockComponent;
  let fixture: ComponentFixture<DrawAnimationBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawAnimationBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawAnimationBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
