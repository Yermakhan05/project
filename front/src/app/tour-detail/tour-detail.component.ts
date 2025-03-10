import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-tour-detail',
  imports: [
    NgIf,
    NgClass,
    TranslatePipe,
    NgForOf,
  ],
  templateUrl: './tour-detail.component.html',
  standalone: true,
  styleUrl: './tour-detail.component.css'
})
export class TourDetailComponent {
  @ViewChild('tourCard') tourCard!: ElementRef;
  @ViewChild('about') about!: ElementRef;
  @ViewChild('information') information!: ElementRef;
  @ViewChild('location') location!: ElementRef;
  @ViewChild('reviews') reviews!: ElementRef;
  isReviewBody: boolean = false;
  selectedSection: string = 'tourCard';
  isModalFormReview: boolean = false;
  selectedRating: number = 0;

  scrollTo(section: string) {
    const element = (this as any)[section]?.nativeElement;
    this.selectedSection = section;

    if (section === 'reviews') {
      this.isReviewBody = true;
    } else {
      this.isReviewBody = false;
    }

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openReviewForm(num: number) {
    this.selectedRating = num;
    this.isModalFormReview = true;
  }
}
