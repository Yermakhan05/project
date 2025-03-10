import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {TopBarComponent} from '../top-bar/top-bar.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TourService} from '../Service/tour.service';
import {LanguageService} from '../Service/language.service';
import {Tour} from '../models';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-tours',
  imports: [
    NgForOf,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './tours.component.html',
  standalone: true,
  styleUrl: './tours.component.css'
})
export class ToursComponent implements OnInit{
  Tours: Tour[] = [];
  slides = [
    { image: 'assets/country.jpeg', title: 'Monumen National', location: 'Central Jakarta', rating: 4.8 },
    { image: 'https://source.unsplash.com/400x250/?indonesia', title: 'Taman Mini Indonesia', location: 'East Jakarta', rating: 4.8 },
    { image: 'https://source.unsplash.com/400x250/?bali', title: 'Taman Mini Indonesia', location: 'North Bali', rating: 4.8 },
    { image: 'https://source.unsplash.com/400x250/?bali', title: 'Taman Mini Indonesia', location: 'North Bali', rating: 4.8 },

  ];
  constructor(
    private tourService: TourService,){}
  ngOnInit(): void {
    this.tourService.getList().subscribe((tourResponse)=>{
      this.Tours = tourResponse.results;

      this.Tours.push(this.Tours[2])
      this.Tours.push(this.Tours[1])
      this.Tours.push(this.Tours[0])
    })
  }
}
