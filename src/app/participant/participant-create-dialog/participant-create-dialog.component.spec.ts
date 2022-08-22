import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCreateDialogComponent } from './participant-create-dialog.component';

describe('ParticipantCreateDialogComponent', () => {
  let component: ParticipantCreateDialogComponent;
  let fixture: ComponentFixture<ParticipantCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantCreateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
