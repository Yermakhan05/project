import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef, HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf, CommonModule, NgOptimizedImage} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../Service/language.service';
import {TruncatePipe} from '../Service/truncate.pipe';
import {Tour} from '../models';
import {TourService} from '../Service/tour.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, CommonModule, TranslatePipe, TruncatePipe, NgOptimizedImage, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  intervalId: any;
  currentIndex: number = 0;
  images: string[] = ['assets/slide1.jpg', 'assets/slide2.jpg', 'assets/slide3.jpg'];
  link_img: string = 'assets/slide1.jpg';
  @ViewChild('storyElement', { static: false }) storyElement!: ElementRef;
  isVisible = false;
  @ViewChild('videoElement') video!: ElementRef<HTMLVideoElement>;
  isModalOpen: boolean = false;
  fullText: string = '';
  Tours: Tour[] = [];

  openFullText(text: string) {
    this.fullText = text;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (this.storyElement) {
      const rect = this.storyElement.nativeElement.getBoundingClientRect();
      this.isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    }
  }

  reviews = [
    { id: 1, name: "Амина", reviewText: "@Kamilla привет Спасибо тебе за твой профессиональный опыт и поддержку 🥳🥳🥳", image: "assets/review6.jpeg" },
    { id: 2, name: "No name", reviewText: "Я так рада, спасибо большое.🫶🫶🫶 Басы кыйын болганмен ,результат 🔥", image: "assets/review5.jpeg" },
    { id: 3, name: "Gaukhar", reviewText: "Здравствуйте! Камилла, спасибо, с Вашей помощью у нас получилось! Алла разы болсын!", image: "assets/review4.jpeg" },
    { id: 4, name: "Azhar Rakhm..", reviewText: "Аааа нам одобрили визууууу.🥹🥹🥹 Спасииибо Я очень сильно переживала, так как даты у нас были крайние. Спасибо Вам 🫶🫶🫶", image: "assets/review3.jpeg" },
    { id: 5, name: "No name", reviewText: "Граце, мерси, грациесес, спасибо Вам большое за проделанную работу 😘😘😘 Благодаря Вам получила визу и путешествовала по Европе одна. Очень очень благодарна ☺️☺️☺️ Всегда были на связи, а это очень важно. Очень рада, что познакомилась с Вами 🥰🥰🥰 Я реально как будто обрела подружку с одинаковыми интересами и нашла наставника. Никогда в жизни заграницу одна не ездила. Для меня это было большим опытом, получила много инсайтов, что не надо кого-то ждать, не надо бояться, а надо рисковать. Говорят же, мир безграничен, главное — сделать шаг, оно так и есть оказывается. Если кто-то у меня будет спрашивать, рекомендовать Вас буду однозначно. Рахмет улкен Вам 🥹🥹🥹❤️❤️❤️❤️ Я Вам ещё буду писать мени 😁🤭 Умытпаныз 😂", image: "assets/review2.jpeg" },
    { id: 6, name: "No name", reviewText: "Кайырлы кун Камила жаным, калайсын? Аман-есен жетуінмен! Сондай аккеніл, сабырлы, иман жузді, кішіпейіл мінезінмен эркашанда кепшіліктін кенілін тауып, акжаркын жузінмен элемді нурландырып, денін сау болып, басыннан багын, астыннан татын таймай аман болып, жуз жасап журе бер. Кайда журсенде ісін берекелі, кунін мерекелі болсын! Улкеееен ракмет саган жаным! 🤲🤲🤲🥰🥰🥰", image: "assets/review1.jpeg" },
  ];


  selectedIndex: number | null = null;

  openReview(index: number) {
    this.selectedIndex = index;
  }

  closeReview() {
    this.selectedIndex = null;
  }

  nextReview() {
    if (this.selectedIndex !== null && this.selectedIndex < this.reviews.length - 1) {
      this.selectedIndex++;
    }
  }

  prevReview() {
    if (this.selectedIndex !== null && this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }
  ngOnInit() {
    this.languageService.language$.subscribe((lang) => {
      this.translateService.use(lang);
    });
    this.tourService.getList().subscribe((tourResponse)=>{
      this.Tours = tourResponse.results;
      this.cloneSlides()
    })
  }

  ngAfterViewInit() {
    // this.cloneSlides();
    this.enableInfiniteScroll();
    const vid = this.video.nativeElement;
    vid.muted = true; // Убедимся, что звук выключен (иначе autoplay может не сработать)
    vid.play().catch(err => console.log('Autoplay blocked:', err));
  }

  cloneSlides() {
    const carouselElement = this.carousel.nativeElement;

    for (let i = 0; i < 2; i++) {
      let lastClone = this.Tours[this.Tours.length - 1 - (i % this.Tours.length)];
      this.Tours.unshift(lastClone);
    }

    setTimeout(() => {
      carouselElement.scrollLeft = carouselElement.children[2].offsetLeft;
    }, 0);
  }

  enableInfiniteScroll() {
    const carouselElement = this.carousel.nativeElement;
    carouselElement.addEventListener('scroll', () => {
      const firstRealSlide = carouselElement.children[2];
      const lastRealSlide = carouselElement.children[carouselElement.children.length - 3];

      if (carouselElement.scrollLeft <= firstRealSlide.offsetLeft - 50) {
        carouselElement.scrollLeft = lastRealSlide.offsetLeft;
      } else if (carouselElement.scrollLeft >= lastRealSlide.offsetLeft + 50) {
        carouselElement.scrollLeft = firstRealSlide.offsetLeft;
      }
    });
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -370, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 370, behavior: 'smooth' });
  }


  constructor(
    private tourService: TourService,
    private languageService: LanguageService,
    private translateService: TranslateService) {
    this.intervalId = setInterval(() => {
      this.changeImage();
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  changeImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.link_img = this.images[this.currentIndex];
  }
}
