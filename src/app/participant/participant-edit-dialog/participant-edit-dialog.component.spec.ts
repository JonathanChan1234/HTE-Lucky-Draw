import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantEditDialogComponent } from './participant-edit-dialog.component';

describe('ParticipantEditDialogComponent', () => {
  let component: ParticipantEditDialogComponent;
  let fixture: ComponentFixture<ParticipantEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
