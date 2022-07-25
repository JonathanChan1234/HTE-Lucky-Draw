import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatingComponent } from './authenticating.component';

describe('AuthenticatingComponent', () => {
  let component: AuthenticatingComponent;
  let fixture: ComponentFixture<AuthenticatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
