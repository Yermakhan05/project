import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './not-found.component.html',
  standalone: true,
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
