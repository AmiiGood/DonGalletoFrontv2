import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieShopComponent } from './cookie-shop.component';

describe('CookieShopComponent', () => {
  let component: CookieShopComponent;
  let fixture: ComponentFixture<CookieShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookieShopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CookieShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
