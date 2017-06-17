import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSearchModalComponent } from './master-search-modal.component';

describe('MasterSearchModalComponent', () => {
  let component: MasterSearchModalComponent;
  let fixture: ComponentFixture<MasterSearchModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSearchModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
