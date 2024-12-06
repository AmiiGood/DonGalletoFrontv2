import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MainComponent } from './components/main/main.component';
import { CookieShopComponent } from './components/cookie-shop/cookie-shop.component';
import { CookieFormComponent } from './components/cookie-form/cookie-form.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { GalletasTablaComponent } from './components/galletas-tabla/galletas-tabla.component';
import { SalesTablaComponent } from './components/sales-tabla/sales-tabla.component';
import { ProductionComponent } from './components/production/production.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CookieShopComponent,
    CookieFormComponent,
    ShoppingCartComponent,
    GalletasTablaComponent,
    SalesTablaComponent,
    ProductionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
