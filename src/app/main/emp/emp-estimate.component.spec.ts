import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEstimateComponent } from './emp-estimate.component';

describe('EmpEstimateComponent', () => {
  let component: EmpEstimateComponent;
  let fixture: ComponentFixture<EmpEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
