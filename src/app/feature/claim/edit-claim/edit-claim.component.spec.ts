import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaimComponent } from './edit-claim.component';

describe('EditClaimComponent', () => {
  let component: EditClaimComponent;
  let fixture: ComponentFixture<EditClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditClaimComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
