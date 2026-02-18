import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { ProductsList } from './products/products-list/products-list';
import { LinesPage } from './lines/lines-page/lines-page';
import { WorkstationsPage } from './workstations/workstations-page/workstations-page';
import { AllocationsPage } from './allocations/allocations-page/allocations-page';
import { LoginPage } from './auth/login-page/login-page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },

  { path: 'products', component: ProductsList, canActivate: [authGuard] },
  { path: 'lines', component: LinesPage, canActivate: [authGuard] },
  { path: 'workstations', component: WorkstationsPage, canActivate: [authGuard] },
  { path: 'allocations', component: AllocationsPage, canActivate: [authGuard] },

  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: '**', redirectTo: 'products' }
];
