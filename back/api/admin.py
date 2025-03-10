from django.contrib import admin
from .models import Country, City, Tour, TourImage, UserProfile, Review, ReviewImage

# Inline для изображений тура
class TourImageInline(admin.TabularInline):  # Можно заменить на StackedInline
    model = TourImage
    extra = 1

# Inline для изображений в отзывах
class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 1

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'Continent')
    list_filter = ('Continent',)
    search_fields = ('name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'country')
    list_filter = ('country',)
    search_fields = ('name',)


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'get_countries', 'get_cities', 'duration')
    list_filter = ('country', 'city')
    search_fields = ('title', 'description')
    readonly_fields = ('review_report',)

    def get_countries(self, obj):
        return ", ".join([country.name for country in obj.country.all()])

    get_countries.short_description = "Страны"

    def get_cities(self, obj):
        return ", ".join([city.name for city in obj.city.all()])

    get_cities.short_description = "Города"

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'full_name', 'location_profile')
    search_fields = ('full_name', 'user__email')
    list_filter = ('location_profile',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'tour', 'star', 'helpful', 'not_helpful', 'average_rating')
    list_filter = ('star',)
    search_fields = ('user__email', 'tour__title', 'text')
    readonly_fields = ('average_rating',)
    inlines = [ReviewImageInline]

    def average_rating(self, obj):
        return f"{obj.star} / 5"
    average_rating.short_description = 'Средняя оценка'

@admin.register(TourImage)
class TourImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'tour', 'image')
    list_filter = ('tour',)
    search_fields = ('tour__title',)

@admin.register(ReviewImage)
class ReviewImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'review', 'image')
    list_filter = ('review',)
    search_fields = ('review__text',)