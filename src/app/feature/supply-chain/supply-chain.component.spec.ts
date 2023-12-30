import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyChainComponent } from './supply-chain.component';

describe('SupplyChainComponent', () => {
  let component: SupplyChainComponent;
  let fixture: ComponentFixture<SupplyChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplyChainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplyChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
