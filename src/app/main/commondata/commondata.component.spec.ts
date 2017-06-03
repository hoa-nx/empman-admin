import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommondataComponent } from './commondata.component';

describe('CommondataComponent', () => {
  let component: CommondataComponent;
  let fixture: ComponentFixture<CommondataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommondataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommondataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
