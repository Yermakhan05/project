import {Component, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../Service/auth.service';
import {ProfileService} from '../Service/profile.service';
import {Booking, Review, Tour, UserProfile} from '../models';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TruncatePipe} from '../Service/truncate.pipe';
import {TourReviewsService} from '../Service/tour-reviews.service';

@Component({
  selector: 'app-profile',
  imports: [
    TranslatePipe,
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    TruncatePipe
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  user = signal<any>(null);
  userProfile: UserProfile = {
    booking_history: [],
    cover_photo: '',
    favourites: [],
    location_profile: '',
    profile_pic: '',
    id: -1, full_name: ""};

  profileForm: FormGroup;
  isLoading = true;

  profilePicPreview: string | undefined;
  coverPhotoPreview: string | undefined;
  Reviews?: Review[];
  BookingTours: Booking[] = [];
  selectedTab: string = 'reviews';
  UserPoint: number = 0
  isModalOpen: boolean = false;
  fullText: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private profileService: ProfileService, private tourReviewsService: TourReviewsService) {
    this.profileForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      location_profile: [''],
      cover_photo: [null],
      profile_pic: [null]
    });
    this.loadUserProfile()
  }
  setActiveTab(tab: string) {
    this.selectedTab = tab;
  }

  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe((profile)=>{
      this.userProfile = profile
      this.profileForm.patchValue({
        full_name: profile.full_name,
        location_profile: profile.location_profile
      });

      // Устанавливаем превью картинок, если они уже есть
      this.profilePicPreview = profile.profile_pic;
      this.coverPhotoPreview = profile.cover_photo;

      this.isLoading = false;
    })
  }

  onFileChange(event: any, fieldName: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === 'profile_pic') {
          this.profilePicPreview = reader.result as string;
        } else if (fieldName === 'cover_photo') {
          this.coverPhotoPreview = reader.result as string;
        }
        this.profileForm.get(fieldName)?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value).subscribe(response => {
        alert('Profile updated successfully!');
      });
    }
  }


  ngOnInit() {
    this.authService.getUserProfile().subscribe(
      data => this.user.set(data),
      err => {
        this.logout()
        console.error('Failed to fetch user data', err)
      }
    );
    this.profileService.getUserReviews().subscribe({
      next: (review) => this.Reviews = review,
      error: (err) => console.error('Ошибка загрузки тура:', err)
    })
    this.profileService.getUserBookingHistory().subscribe(
      (data) => {
        this.BookingTours = data;
        this.countVisitedCountries();
      },
     (err) => console.error('Failed to fetch user data', err)
    );
    this.isLoading = false;
  }
  logout() {
    this.authService.logout();
  }
  countVisitedCountries() {
    let visitedCountries = new Set<string>();

    for (let tour of this.BookingTours) {
        for (let country of tour.tour.country){
          visitedCountries.add(country);
      }
    }
    this.UserPoint = visitedCountries.size
    this.fullText = "You visited: " + Array.from(visitedCountries).join(', ');
  }

  closeModal() {
    this.isModalOpen = false;
  }
  getStarArray(star: number) {
    return Array(star).fill(0);
  }
}
