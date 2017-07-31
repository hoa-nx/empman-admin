import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpBasicComponent } from './emp-basic.component';

describe('EmpBasicComponent', () => {
  let component: EmpBasicComponent;
  let fixture: ComponentFixture<EmpBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
