import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteButttonComponent } from './delete-buttton.component';

describe('DeleteButttonComponent', () => {
  let component: DeleteButttonComponent;
  let fixture: ComponentFixture<DeleteButttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteButttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteButttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
