import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpecialisationsComponent } from './admin-specialisations.component';

describe('AdminSpecialisationsComponent', () => {
  let component: AdminSpecialisationsComponent;
  let fixture: ComponentFixture<AdminSpecialisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSpecialisationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSpecialisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
