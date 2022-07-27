import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDrawDialogComponent } from './delete-draw-dialog.component';

describe('DeleteDrawDialogComponent', () => {
  let component: DeleteDrawDialogComponent;
  let fixture: ComponentFixture<DeleteDrawDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDrawDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
