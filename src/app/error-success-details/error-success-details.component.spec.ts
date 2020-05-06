import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSuccessDetailsComponent } from './error-success-details.component';

describe('ErrorSuccessDetailsComponent', () => {
  let component: ErrorSuccessDetailsComponent;
  let fixture: ComponentFixture<ErrorSuccessDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSuccessDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSuccessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
