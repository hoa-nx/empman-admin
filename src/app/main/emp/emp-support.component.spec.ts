import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSupportComponent } from './emp-support.component';

describe('EmpSupportComponent', () => {
  let component: EmpSupportComponent;
  let fixture: ComponentFixture<EmpSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
