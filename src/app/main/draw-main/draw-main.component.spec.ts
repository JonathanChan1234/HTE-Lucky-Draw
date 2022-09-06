import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawMainComponent } from './draw-main.component';

describe('DrawMainComponent', () => {
  let component: DrawMainComponent;
  let fixture: ComponentFixture<DrawMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
