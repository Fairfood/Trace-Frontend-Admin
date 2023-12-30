import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSupplyChainComponent } from './active-supply-chain.component';

describe('ActiveSupplyChainComponent', () => {
  let component: ActiveSupplyChainComponent;
  let fixture: ComponentFixture<ActiveSupplyChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveSupplyChainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveSupplyChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
