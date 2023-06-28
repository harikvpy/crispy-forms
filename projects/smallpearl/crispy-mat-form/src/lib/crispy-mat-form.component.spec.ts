import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrispyMatFormComponent } from './crispy-mat-form.component';

describe('CrispyMatFormComponent', () => {
  let component: CrispyMatFormComponent;
  let fixture: ComponentFixture<CrispyMatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrispyMatFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrispyMatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
