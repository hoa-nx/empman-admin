import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpProfileTechComponent } from './emp-profile-tech.component';

describe('EmpProfileTechComponent', () => {
  let component: EmpProfileTechComponent;
  let fixture: ComponentFixture<EmpProfileTechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpProfileTechComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpProfileTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
