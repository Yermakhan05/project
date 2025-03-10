import {Component} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../Service/language.service';
@Component({
  selector: 'app-top-bar',
  imports: [
    NgClass,
    NgIf,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './top-bar.component.html',
  standalone: true,
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  isMenuOpen = false;
  isForm: boolean = false;
  currentLanguage: string;

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
    this.currentLanguage = this.languageService.getLanguage();
    this.translateService.use(this.currentLanguage);
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
