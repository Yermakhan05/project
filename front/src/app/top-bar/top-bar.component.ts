import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../Service/language.service';
import {AuthService} from '../Service/auth.service';
import {Observable} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {UserFormService} from '../Service/user-form.service';
@Component({
  selector: 'app-top-bar',
  imports: [
    NgClass,
    NgIf,
    RouterLink,
    TranslatePipe,
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './top-bar.component.html',
  standalone: true,
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit{
  isMenuOpen = false;
  isForm: boolean = false;
  currentLanguage: string = 'ru';
  isAuth: boolean = true;
  name = '';
  email = '';
  phone = '';
  comment = '';

  submitForm(form: any) {
    if (form.invalid) {
      alert('Заполните все обязательные поля!');
      return;
    }

    const formData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      comment: this.comment,
      status: 'pending'
    };

    this.userFormService.submitForm(formData).subscribe({
      next: (response) => {
        alert(response.message);
        this.isForm = false
      },
      error: (error) => console.error('Ошибка:', error)
    });
  }

  ngOnInit(): void {
    this.isAuth = !this.authService.isAuthenticated();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Прокрутка в самый верх
      }
    });
  }

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private authService: AuthService,
    private userFormService: UserFormService
  ) {
    this.currentLanguage = this.languageService.getLanguage();
    this.translateService.use(this.currentLanguage);
    this.isAuth = !this.authService.isAuthenticated();
  }

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.languageService.setLanguage(lang);
    this.translateService.use(lang);
  }



  navigateAndScroll(sectionId: string) {
    if (this.router.url === '/main') {
      this.scrollToSection(sectionId);
    } else {
      this.router.navigate(['/main'], { skipLocationChange: false }).then(() => {
        setTimeout(() => this.scrollToSection(sectionId), 100);
      });
    }
    this.toggleMenu()
  }

  private scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public hideSecondBar(): void{
    this.isMenuOpen = !this.isMenuOpen;
  }

  isContactPage(): boolean {
    return this.router.url === '/contacts';
  }

  isSecondBarPage() {
    return this.router.url === '/tours' || this.router.url.startsWith('/tour/') || this.router.url === '/cart';
  }

  protected readonly HTMLSelectElement = HTMLSelectElement;
}
