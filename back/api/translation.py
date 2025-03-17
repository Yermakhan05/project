from modeltranslation.translator import register, TranslationOptions
from .models import Tour

@register(Tour)
class TourTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'duration', 'highlights')  # Укажи поля, которые надо переводить