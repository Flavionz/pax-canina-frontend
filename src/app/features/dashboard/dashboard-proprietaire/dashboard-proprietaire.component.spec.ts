import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProprietaireComponent } from './dashboard-proprietaire.component';

describe('DashboardProprietaireComponent', () => {
  let component: DashboardProprietaireComponent;
  let fixture: ComponentFixture<DashboardProprietaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProprietaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProprietaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
