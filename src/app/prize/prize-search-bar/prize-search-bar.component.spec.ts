import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeSearchBarComponent } from './prize-search-bar.component';

describe('PrizeSearchBarComponent', () => {
  let component: PrizeSearchBarComponent;
  let fixture: ComponentFixture<PrizeSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrizeSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
