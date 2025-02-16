import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FavouriteComponent} from './favourite/favourite.component';
import {OrdersComponent} from './orders/orders.component';
import {InfoComponent} from './info/info.component';

const routes: Routes = [
  {path: 'favorites', component: FavouriteComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'info', component: InfoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule {
}
