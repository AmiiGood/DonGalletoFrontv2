import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTablaComponent } from './sales-tabla.component';

describe('SalesTablaComponent', () => {
  let component: SalesTablaComponent;
  let fixture: ComponentFixture<SalesTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesTablaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
