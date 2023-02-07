import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceteSearchComponent } from './contrato-search.component';

describe('BalanceteSearchComponent', () => {
  let component: BalanceteSearchComponent;
  let fixture: ComponentFixture<BalanceteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceteSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
