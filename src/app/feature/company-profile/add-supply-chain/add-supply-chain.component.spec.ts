import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplyChainComponent } from './add-supply-chain.component';

describe('AddSupplyChainComponent', () => {
  let component: AddSupplyChainComponent;
  let fixture: ComponentFixture<AddSupplyChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSupplyChainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSupplyChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
