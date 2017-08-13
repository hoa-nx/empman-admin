import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRuleComponent } from './company-rule.component';

describe('CompanyRuleComponent', () => {
  let component: CompanyRuleComponent;
  let fixture: ComponentFixture<CompanyRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
