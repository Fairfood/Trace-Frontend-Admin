import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteCompanyComponent } from './invite-company.component';

describe('InviteCompanyComponent', () => {
  let component: InviteCompanyComponent;
  let fixture: ComponentFixture<InviteCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InviteCompanyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
