import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizePaginatorComponent } from './prize-paginator.component';

describe('PrizePaginatorComponent', () => {
  let component: PrizePaginatorComponent;
  let fixture: ComponentFixture<PrizePaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizePaginatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
