import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUnitpriceComponent } from './customer-unitprice.component';

describe('CustomerUnitpriceComponent', () => {
  let component: CustomerUnitpriceComponent;
  let fixture: ComponentFixture<CustomerUnitpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerUnitpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerUnitpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
