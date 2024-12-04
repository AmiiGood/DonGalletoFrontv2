import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieFormComponent } from './cookie-form.component';

describe('CookieFormComponent', () => {
  let component: CookieFormComponent;
  let fixture: ComponentFixture<CookieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookieFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CookieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
