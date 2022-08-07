import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPaginatorComponent } from './participant-paginator.component';

describe('ParticipantPaginatorComponent', () => {
  let component: ParticipantPaginatorComponent;
  let fixture: ComponentFixture<ParticipantPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantPaginatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
