import {Component, ElementRef, Input, OnInit, signal, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {Review, Tour} from '../models';
import {TourDetailService} from '../Service/tourDetail.service';
import {TruncatePipe} from '../Service/truncate.pipe';
import {TourReviewsService} from '../Service/tour-reviews.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { FilePreviewPipe } from '../pipes/file-preview.pipe';
import {AuthService} from '../Service/auth.service';
import {routes} from '../app.routes';
import {range} from 'rxjs';
import {CartService} from '../Service/CartService';

@Component({
  selector: 'app-tour-detail',
  imports: [
    NgIf,
    NgClass,
    TranslatePipe,
    NgForOf,
    TruncatePipe,
    DatePipe,
    FilePreviewPipe,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './tour-detail.component.html',
  standalone: true,
  styleUrl: './tour-detail.component.css'
})
export class TourDetailComponent implements OnInit{
  @ViewChild('tourCard') tourCard!: ElementRef;
  @ViewChild('information') information!: ElementRef;
  @ViewChild('location') location!: ElementRef;
  @ViewChild('reviews') reviews!: ElementRef;
  isReviewBody: boolean = false;
  selectedSection: string = 'tourCard';
  isModalFormReview: boolean = false;
  selectedRating: number = 0;
  tourId: string | null = null;
  tour?: Tour;
  Reviews: Review[] = []
  isModalOpen: boolean = false;
  fullText: string = '';
  showAll: boolean = false;
  selectedIndex: number = 2;
  user = signal<any>(null);

  reviewForm: FormGroup;
  text: string = ''
  selectedImages: File[] = [];
  isAuth: boolean = false;
  UserReviewText: string = ''
  UserReview: Review | null = null;
  isUserReview: boolean = false
  isUpdateModalOpen: boolean = false;



  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      for (let file of files) {
        this.selectedImages.push(file);
      }
    }
  }

  submitReview() {
    let formData = new FormData();
    formData.append('tour', this.tourId || "1");
    formData.append('text', this.text || '');
    formData.append('star', this.selectedRating.toString());

    this.selectedImages.forEach((file) => {
      formData.append('images', file);
    });

    if (this.authService.isAuthenticated() && this.UserReview !== null) {
      alert('updated')
      this.reviewService.updateReview(formData, this.tourId || "1", this.UserReview.id.toString()).subscribe(
        () => {
          alert('Отзыв отправлен!');
          this.isModalFormReview = false;
        },
        (error) => {
          console.error('Ошибка отправки отзыва:', error);
        }
      );
      return;
    }
    else {
      alert('posted')

      this.reviewService.postReview(formData, this.tourId || "1").subscribe(
        () => {
          alert('Отзыв отправлен!');
          this.isModalFormReview = false;
        },
        (error) => {
          console.error('Ошибка отправки отзыва:', error);
        }
      );
    }
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  openFullText(text: string) {
    this.fullText = text;
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }


  constructor(
    private route: ActivatedRoute,
    private tourDetailService: TourDetailService,
    private tourReviewsService: TourReviewsService,
    private fb: FormBuilder, private reviewService: TourReviewsService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.isAuth = !this.authService.isAuthenticated();
    this.reviewForm = this.fb.group({
      text: [''],
      images: [[]]
    });
  }

  ngOnInit() {
    this.tourId = this.route.snapshot.paramMap.get('id');
    this.authService.getUserProfile().subscribe(
      data => {
        this.user.set(data);
        this.isAuth = this.authService.isAuthenticated()
      },
      err => console.error('Failed to fetch user data', err)
    );

    if (this.tourId) {
      this.tourDetailService.getList(this.tourId).subscribe({
        next: (tour) => this.tour = tour,
        error: (err) => console.error('Ошибка загрузки тура:', err)
      });
      this.tourReviewsService.getList(this.tourId).subscribe({
        next: (review) => {
          this.Reviews = review;
          this.isUserReview = this.isUpdateForm()
        },
        error: (err) => console.error('Ошибка загрузки тура:', err)
      })
    } else {
      console.warn('Не удалось получить ID тура из маршрута');
    }
  }

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

  getCountriesList(): string {
    if (this.tour) {
      return this.tour.country.join(", ");
    }
    return ""
  }
  getCityList(): string {
    if (this.tour) {
      return this.tour.city.join(", ");
    }
    return ""
  }

  getListRatingStar(tour_rating: number): string[] {
    let full_star = "assets/img_5.png";
    let half_star = "assets/img_7.png";  // Половина звезды
    let empty_star = "assets/img_10.png"; // Пустая звезда (если нужна)

    let stars: string[] = [];
    let fullStars = Math.floor(tour_rating); // Количество полных звезд
    let hasHalfStar = tour_rating % 1 >= 0.5; // Проверка на половину звезды

    // Добавляем полные звезды
    for (let i = 0; i < fullStars; i++) {
      stars.push(full_star);
    }

    // Добавляем половину звезды, если есть
    if (hasHalfStar) {
      stars.push(half_star);
    }

    // Заполняем пустыми звездами, если нужно 5 звезд в общем
    while (stars.length < 5) {
      stars.push(empty_star);
    }

    return stars;
  }

  closeReview() {
    this.showAll = false
  }
  nextReview() {
    if (this.tour != undefined){
      if (this.selectedIndex !== null && this.selectedIndex < this.tour?.tour_images.length - 1) {
        this.selectedIndex++;
      }
    }
  }

  prevReview() {
    if (this.selectedIndex !== null && this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  getComment() {
    switch (this.selectedRating) {
      case 5:
        return "Оценка принята. Кажется, вы в восторге! Поделитесь, что именно понравилось?";
      case 4:
        return "Спасибо за высокую оценку! Что, по вашему мнению, можно улучшить?";
      case 3:
        return "Благодарим за отзыв! Что вам понравилось, а что нет?";
      case 2:
        return "Жаль, что вам не совсем понравилось. Расскажите, что можно улучшить.";
      case 1:
        return "Нам жаль, что у вас остались плохие впечатления. Как мы можем исправить ситуацию?";
      default:
        return "";
    }
  }

  isAuthUser(): string {
    if(this.authService.isAuthenticated()) {
      return "cart";
    }
    return "register";
  }

  isAuthUserTest() {
    if(!this.authService.isAuthenticated()) {
      this.router.navigate(['/register']).then(() => {
        window.location.reload();
      });
    }
  }

  isUpdateForm(): boolean {
    if (!this.isAuth) return false;

    const userId = this.user().id;
    this.UserReview = this.Reviews.find(review => review.user.id === userId) || null;

    if (this.UserReview) {
      this.Reviews = this.Reviews.filter(review => review.user.id !== userId);
      return true;
    }

    return false;
  }

  protected readonly range = range;

  getStarArray(star: number) {
    return Array(star).fill(0);
  }

  addToCart() {
    if (!this.tour) {
      alert("Tour is undefined!");
      return;
    }
    this.cartService.addToCart(this.tour.id, 1).subscribe({
      next: (item) => {
        console.log("Added to cart:", item)
        this.router.navigate(['/cart']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => console.error("Error adding to cart:", err)
    });
  }
}
