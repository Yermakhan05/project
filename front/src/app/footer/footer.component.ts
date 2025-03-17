import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../Service/language.service';
import {UserFormService} from '../Service/user-form.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [
    NgIf,
    RouterLink,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  isForm: boolean = false;
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

  constructor(
    private router: Router,
    private userFormService: UserFormService
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
