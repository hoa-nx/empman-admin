import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpOnsiteComponent } from './emp-onsite.component';

describe('EmpOnsiteComponent', () => {
  let component: EmpOnsiteComponent;
  let fixture: ComponentFixture<EmpOnsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpOnsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpOnsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
