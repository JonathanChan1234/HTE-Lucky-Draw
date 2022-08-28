import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportParticipantsDialogComponent } from './import-participants-dialog.component';

describe('ImportParticipantsDialogComponent', () => {
  let component: ImportParticipantsDialogComponent;
  let fixture: ComponentFixture<ImportParticipantsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportParticipantsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportParticipantsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
