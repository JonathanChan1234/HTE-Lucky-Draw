import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSettingComponent } from './draw-setting.component';

describe('DrawSettingComponent', () => {
  let component: DrawSettingComponent;
  let fixture: ComponentFixture<DrawSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
