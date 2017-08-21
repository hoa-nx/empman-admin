import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentInterviewComponent } from './recruitment-interview.component';

describe('RecruitmentInterviewComponent', () => {
  let component: RecruitmentInterviewComponent;
  let fixture: ComponentFixture<RecruitmentInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
