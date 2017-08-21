import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentStaffComponent } from './recruitment-staff.component';

describe('RecruitmentStaffComponent', () => {
  let component: RecruitmentStaffComponent;
  let fixture: ComponentFixture<RecruitmentStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
