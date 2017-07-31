import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAllowanceComponent } from './emp-allowance.component';

describe('EmpAllowanceComponent', () => {
  let component: EmpAllowanceComponent;
  let fixture: ComponentFixture<EmpAllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpAllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
