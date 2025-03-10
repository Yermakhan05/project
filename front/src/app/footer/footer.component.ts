import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../Service/language.service';

@Component({
  selector: 'app-footer',
  imports: [
    NgIf,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  isForm: boolean = false;

  constructor(
    private router: Router,
  ) {
  }
  navigateAndScroll(sectionId: string) {
    if (this.router.url === '/main') {
      this.scrollToSection(sectionId);
    } else {
      this.router.navigate(['/main'], { skipLocationChange: false }).then(() => {
        setTimeout(() => this.scrollToSection(sectionId), 100);
      });
    }
  }

  private scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
