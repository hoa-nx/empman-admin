import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDetailWorkComponent } from './emp-detail-work.component';

describe('EmpDetailWorkComponent', () => {
  let component: EmpDetailWorkComponent;
  let fixture: ComponentFixture<EmpDetailWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpDetailWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpDetailWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
