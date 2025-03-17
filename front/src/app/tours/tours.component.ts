import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {TopBarComponent} from '../top-bar/top-bar.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TourService} from '../Service/tour.service';
import {LanguageService} from '../Service/language.service';
import {Continent, Country, Tour} from '../models';
import {RouterLink} from '@angular/router';
import {CountryService} from '../Service/country.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-tours',
  imports: [
    NgForOf,
    TranslatePipe,
    RouterLink,
    NgIf,
    FormsModule,
  ],
  templateUrl: './tours.component.html',
  standalone: true,
  styleUrl: './tours.component.css'
})
export class ToursComponent implements OnInit{
  Tours: Tour[] = [];
  allCountries: Country = {name: "All", id: 0, Continent: "AL"}
  countries: Country[] = [this.allCountries]
  filteredCountries: Country[] = [];
  selectedContinentId: number | null = 0;
  selectedContinent: string | null = '';
  dropdownOpen = true;
  selectedCountry: string = "All";
  selectedCountryId: number | null = null;
  selectedDuration: string | null = null;
  selectedPrice: string | null = null;
  searchInput: string | null = null;

  constructor(
    private tourService: TourService,
    private countryService: CountryService
  ){}
  ngOnInit(): void {
    this.getTours();
    this.getCountries();
  }
  getCountriesList(id: number): string {
    let countryList = this.Tours[id].country.join(", ");
    if (countryList.length > 19){
      countryList = countryList.slice(0, 19) + "..."
    }
    return countryList;
  }

  getTours(): void {
    let params: any = {};

    if (this.selectedContinent && this.selectedContinent !== 'AL') {
      params.country__Continent = this.selectedContinent;
    }
    if (this.searchInput !== null) {
      params.search = this.searchInput
    }

    if (this.selectedCountryId !== null) {
      if (this.selectedCountryId == 0){
        params.country = null;
      }
      else {
        params.country = this.selectedCountryId;
      }
    }

    if (this.selectedPrice !== null) {
      const [priceMin, priceMax] = this.selectedPrice.split('-').map(p => p.trim());
      params.price_min = priceMin;
      if (priceMax && priceMax !== "...₸") {
        params.price_max = priceMax;
      }
    }

    if (this.selectedDuration !== null) {
      const [durationMin, durationMax] = this.selectedDuration.split('-').map(d => d.trim());
      params.duration_min = durationMin;
      if (durationMax && durationMax !== "месяц") {
        params.duration_max = durationMax;
      }
    }

    this.tourService.getList(params).subscribe((tourResponse) => {
      this.Tours = tourResponse.results;
    });
  }

  getCountries(continent: string | null = null): void {
    let params = continent && continent !== 'AL' ? { Continent: continent } : {};

    this.countryService.getList(params).subscribe((countries) => {
      this.countries = [this.allCountries, ...countries];
      this.filteredCountries = this.countries;
    });
  }

  filterByContinent(continent: string, selectedContinentId: number): void {
    this.selectedCountryId = null;
    this.selectedContinent = continent
    this.getCountries(continent);
    this.getTours();
    this.dropdownOpen = false;
    this.selectedContinentId = selectedContinentId;
  }
  filterByCountry(countryId: number): void {
    this.selectedCountryId = countryId;
    this.selectedCountry = this.countries[countryId].name
    this.getTours();
  }
  filterByPrice(priceRange: string): void {
    this.selectedPrice = priceRange;
    this.getTours();
  }

  filterByDuration(durationRange: string): void {
    this.selectedDuration = durationRange;
    this.getTours();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
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

  searchTour() {
    this.getTours();
  }
}
