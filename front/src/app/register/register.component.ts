import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../Service/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    NgIf,
    TranslatePipe,
    RouterLink,
    FormsModule
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private router: Router, private authService: AuthService) {}
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  credentials = { username: '', password: '' };

  login() {
    this.authService.login(this.credentials).subscribe(
      () => this.router.navigate(['/main']),
      (err) => this.isIncorrect = true
    );
  }

  user = { username: '', email: '', password: '',
    password_1: '',
  };
  isIncorrect: boolean = false;
  isIncorrectRegister: boolean = false;

  register() {
    if (this.user.password === this.user.password_1){
      this.authService.register(this.user).subscribe(
        () => this.router.navigate(['/login']),
        (err) => this.isIncorrectRegister = true
      );
    }
  }
}
