import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpProfileWorkComponent } from './emp-profile-work.component';

describe('EmpProfileWorkComponent', () => {
  let component: EmpProfileWorkComponent;
  let fixture: ComponentFixture<EmpProfileWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpProfileWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpProfileWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
