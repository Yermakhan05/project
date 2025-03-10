from rest_framework import serializers
from .models import Tour

class TourSerializer(serializers.ModelSerializer):
    continent = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = '__all__'  # Либо явно перечисли, если нужно

    def get_continent(self, obj):
        first_country = obj.country.first()
        return first_country.Continent if first_country else None
