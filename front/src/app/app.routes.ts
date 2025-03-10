import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RegisterComponent } from './register/register.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { ToursComponent } from './tours/tours.component';
import {CartComponent} from './cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: RegisterComponent },
  { path: 'tour/:id', component: TourDetailComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'cart', component: CartComponent }
];
