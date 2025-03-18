from django.contrib.auth.models import User

from .models import Tour, Country, Review, Booking, ReviewImage, UserForm
from rest_framework import serializers
from .models import UserProfile


class TourSerializer(serializers.ModelSerializer):
    continent = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = ['id', 'title', 'country', 'duration_days', 'price_list', 'city', 'continent', 'cover_image', 'rating', 'price', 'duration']

    def get_continent(self, obj):
        first_country = obj.country.first()
        return first_country.Continent if first_country else None

    def get_country(self, obj):
        return [country.name for country in obj.country.all()]

    def get_city(self, obj):
        return [city.name for city in obj.city.all()]


class TourDetailSerializer(serializers.ModelSerializer):
    continent = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    tour_images = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = '__all__'

    def get_continent(self, obj):
        first_country = obj.country.first()
        return first_country.Continent if first_country else None

    def get_country(self, obj):
        return [country.name for country in obj.country.all()]

    def get_city(self, obj):
        return [city.name for city in obj.city.all()]

    def get_tour_images(self, obj):
        request = self.context.get('request')
        return [request.build_absolute_uri(image.image.url) for image in obj.tour_images.all()]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    review_images = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = '__all__'

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "email": obj.user.email  # Можно убрать, если не нужен
        }

    def get_review_images(self, obj):
        request = self.context.get('request')
        if request is None:
            return [image.image.url for image in obj.review_images.all()]
        return [request.build_absolute_uri(image.image.url) for image in obj.review_images.all()]


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'Continent']



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class UserProfileSerializer_2(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['location_profile', 'full_name', 'cover_photo', 'profile_pic']


class BookingSerializer(serializers.ModelSerializer):
    tour = TourSerializer()

    class Meta:
        model = Booking
        fields = ['id', 'tour', 'status', 'created_at']


class ReviewSerializer2(serializers.ModelSerializer):
    tour = TourSerializer()
    review_images = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = '__all__'

    def get_review_images(self, obj):
        request = self.context.get('request')
        if request is None:
            return [image.image.url for image in obj.review_images.all()]
        return [request.build_absolute_uri(image.image.url) for image in obj.review_images.all()]


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ["image"]

class ReviewSerializer3(serializers.ModelSerializer):
    images = ReviewImageSerializer(many=True, required=False)

    class Meta:
        model = Review
        fields = ["tour", "user", "text", "images", "star"]

    def create(self, validated_data):
        images_data = self.context["request"].FILES.getlist("images")
        validated_data.pop("images", None)
        review = Review.objects.create(**validated_data)

        for image in images_data:
            ReviewImage.objects.create(review=review, image=image)

        return review


class UserFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserForm
        fields = ['name', 'email', 'phone', 'comment']