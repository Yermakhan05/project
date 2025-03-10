import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FooterComponent} from './footer/footer.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import {MainComponent} from './main/main.component';
import {RegisterComponent} from './register/register.component';
import {ToursComponent} from './tours/tours.component';
import {TourDetailComponent} from './tour-detail/tour-detail.component';
import {ContactsComponent} from './contacts/contacts.component';
import {ProfileComponent} from './profile/profile.component';
import {Router, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    TourDetailComponent,
    ContactsComponent,
    ProfileComponent,
    MainComponent,
    RegisterComponent,
    ToursComponent,
    RouterOutlet,
    NgIf,
    TopBarComponent
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'front';

  constructor(private router: Router) {
  }
  ngOnInit(): void {
  }


  isAuthPage() {
    return this.router.url === '/register' || this.router.url === '/login';
  }
}
