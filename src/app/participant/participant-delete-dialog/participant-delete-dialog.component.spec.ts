import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDeleteDialogComponent } from './participant-delete-dialog.component';

describe('ParticipantDeleteDialogComponent', () => {
  let component: ParticipantDeleteDialogComponent;
  let fixture: ComponentFixture<ParticipantDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
