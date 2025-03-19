from modeltranslation.translator import register, TranslationOptions
from .models import Tour, Country, City


@register(Tour)
class TourTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'duration', 'highlights', 'events', 'price_list')  # Укажи поля, которые надо переводить

@register(Country)
class CountryTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(City)
class CityTranslationOptions(TranslationOptions):
    fields = ('name',)