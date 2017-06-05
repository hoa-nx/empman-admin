import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightbarMenuComponent } from './rightbar-menu.component';

describe('RightbarMenuComponent', () => {
  let component: RightbarMenuComponent;
  let fixture: ComponentFixture<RightbarMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightbarMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightbarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
