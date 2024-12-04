import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookieShopComponent } from './components/cookie-shop/cookie-shop.component';
import { GalletasTablaComponent } from './components/galletas-tabla/galletas-tabla.component';

const routes: Routes = [
  {
    path: 'ventas',
    component: CookieShopComponent,
  },
  {
    path: 'cookies',
    component: GalletasTablaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
