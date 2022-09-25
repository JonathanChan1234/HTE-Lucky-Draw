import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantSignInComponent } from './participant-sign-in.component';

describe('ParticipantSignInComponent', () => {
  let component: ParticipantSignInComponent;
  let fixture: ComponentFixture<ParticipantSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantSignInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
