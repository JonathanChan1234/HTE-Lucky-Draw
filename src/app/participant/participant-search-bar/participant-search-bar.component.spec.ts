import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantSearchBarComponent } from './participant-search-bar.component';

describe('ParticipantSearchBarComponent', () => {
  let component: ParticipantSearchBarComponent;
  let fixture: ComponentFixture<ParticipantSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
