import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpContractComponent } from './emp-contract.component';

describe('EmpContractComponent', () => {
  let component: EmpContractComponent;
  let fixture: ComponentFixture<EmpContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
