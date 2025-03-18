import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {UserFormService} from '../Service/user-form.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [
    TranslatePipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './contacts.component.html',
  standalone: true,
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  name = '';
  email = '';
  phone = '';
  comment = '';

  constructor(private userFormService: UserFormService) {
  }

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
        location.reload();
      },
      error: (error) => console.error('Ошибка:', error)
    });
  }
}
