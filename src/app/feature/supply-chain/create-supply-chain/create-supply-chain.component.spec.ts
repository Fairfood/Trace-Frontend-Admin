import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSupplyChainComponent } from './create-supply-chain.component';

describe('CreateSupplyChainComponent', () => {
  let component: CreateSupplyChainComponent;
  let fixture: ComponentFixture<CreateSupplyChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSupplyChainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSupplyChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
