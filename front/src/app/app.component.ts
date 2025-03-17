import {Component, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
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
import {AuthService} from './Service/auth.service';


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
  isAuth: boolean = false

  constructor(private router: Router) {
  }
  ngOnInit(): void {
  }
  isMainPage() {
    return this.router.url === '/main' || this.router.url === '/tours' || this.router.url === '/cart' || this.router.url === '/contacts' || this.router.url === '/profile' || this.router.url === '/' || this.router.url.startsWith('/tour/');
  }
}
