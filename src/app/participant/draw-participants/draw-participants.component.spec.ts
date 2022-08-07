import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawParticipantsComponent } from './draw-participants.component';

describe('DrawParticipantsComponent', () => {
  let component: DrawParticipantsComponent;
  let fixture: ComponentFixture<DrawParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
