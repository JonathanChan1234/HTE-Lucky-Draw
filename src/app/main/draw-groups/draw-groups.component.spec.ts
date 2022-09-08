import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawGroupsComponent } from './draw-groups.component';

describe('DrawGroupsComponent', () => {
  let component: DrawGroupsComponent;
  let fixture: ComponentFixture<DrawGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
