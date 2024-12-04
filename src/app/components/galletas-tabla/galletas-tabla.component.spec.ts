import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalletasTablaComponent } from './galletas-tabla.component';

describe('GalletasTablaComponent', () => {
  let component: GalletasTablaComponent;
  let fixture: ComponentFixture<GalletasTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalletasTablaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GalletasTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
