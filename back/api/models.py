from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
import uuid

from django.db.models import Avg


class Country(models.Model):
    CONTINENT_CHOICES = [
        ('AF', 'Африка'),
        ('AS', 'Азия'),
        ('EU', 'Европа'),
        ('NA', 'Северная Америка'),
        ('SA', 'Южная Америка'),
        ('OC', 'Океания'),
        ('AN', 'Антарктида'),
    ]
    name = models.CharField(max_length=100, unique=True, help_text="Название страны")
    Continent = models.CharField(
        max_length=2,
        choices=CONTINENT_CHOICES,
        default='AS',
        help_text="Континент, к которому относится страна"
    )
    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=100, help_text="Название города")
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="cities",
                                help_text="Страна, к которой относится город")

    def __str__(self):
        return f"{self.name}, {self.country.name}"

def default_map_links():
    return {"google": "", "apple": ""}

class Tour(models.Model):
    title = models.CharField(max_length=255, help_text="Название тура")
    country = models.ManyToManyField(Country, related_name="tours", help_text="Страна тура")
    city = models.ManyToManyField(City, related_name="tours", help_text="Город тура")
    review_report = models.JSONField(default=dict, help_text="Отчет по отзывам")
    duration = models.TextField(help_text="Продолжительность тура")
    description = models.TextField(help_text="Описание тура")
    events = models.JSONField(default=list, help_text="Список мероприятий")
    duration_days = models.IntegerField(help_text="Продолжительность тура в днях", default=1)
    highlights = models.JSONField(default=list, help_text="Ключевые моменты тура")
    map_image = models.ImageField(upload_to='maps/', blank=True, null=True, help_text="Карта тура")
    map_links = models.JSONField(default=default_map_links, help_text="Ссылки на карты",)
    cover_image = models.ImageField(upload_to='tours/covers/', blank=True, null=True, help_text="Обложка тура")
    rating = models.FloatField(default=0.0, help_text="Средняя оценка тура")
    price_list = models.TextField(help_text="Цены тура", null=True)
    price = models.IntegerField(help_text="Цена в тенге", default=1, null=True)
    is_top = models.BooleanField(help_text="Горящие тур или нет", default=True, null=True)

    def __str__(self):
        return self.title

    def update_rating(self):
        """Обновляет средний рейтинг тура на основе отзывов"""
        avg_rating = self.reviews.aggregate(avg_rating=Avg('star'))['avg_rating']
        self.rating = avg_rating if avg_rating is not None else 0.0
        self.save()

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews", help_text="Пользователь, оставивший отзыв")
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="reviews", help_text="Тур, на который оставлен отзыв")
    star = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], help_text="Оценка тура (1-5)")
    text = models.TextField(help_text="Текст отзыва")
    helpful = models.PositiveIntegerField(default=0, help_text="Количество отметок 'Полезно'")
    not_helpful = models.PositiveIntegerField(default=0, help_text="Количество отметок 'Не полезно'")
    date = models.DateTimeField(auto_now_add=True, help_text="Дата и время создания отзыва", null=True)

    def save(self, *args, **kwargs):
        """Пересчитывает рейтинг тура при добавлении или изменении отзыва"""
        super().save(*args, **kwargs)
        self.tour.update_rating()

    def delete(self, *args, **kwargs):
        """Пересчитывает рейтинг тура при удалении отзыва"""
        super().delete(*args, **kwargs)
        self.tour.update_rating()

class TourImage(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, help_text="Связанный тур" , related_name="tour_images")
    image = models.ImageField(upload_to='media/', help_text="Изображение тура")

class ReviewImage(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="review_images", help_text="Связанный отзыв")
    image = models.ImageField(upload_to='reviews/', help_text="Изображение отзыва")

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile", help_text="Связанный пользователь")
    location_profile = models.TextField(blank=True, null=True, help_text="Локация пользователя")
    full_name = models.CharField(max_length=255, null=True, help_text="Полное имя пользователя")
    cover_photo = models.ImageField(upload_to='users/covers/', blank=True, null=True, help_text="Обложка профиля")
    profile_pic = models.ImageField(upload_to='users/profiles/', blank=True, null=True, help_text="Фото профиля")
    booking_history = models.ManyToManyField(Tour, blank=True, related_name="booked_users", help_text="История бронирований пользователя")
    favourites = models.ManyToManyField(Tour, blank=True, related_name="favourite_users", help_text="Избранные туры пользователя")


    def __str__(self):
        return self.full_name

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидание'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.tour.title} ({self.status})"


class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    amount = models.IntegerField()
    currency = models.CharField(max_length=3, default="KZT")
    order_id = models.CharField(max_length=100, unique=True)
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Ожидание'),
        ('paid', 'Оплачено'),
        ('failed', 'Ошибка')
    ], default='pending')
    payment_url = models.URLField(blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.tour.title} ({self.quantity})"


class UserForm(models.Model):
    name = models.CharField(max_length=255, help_text="Имя пользователя")
    email = models.EmailField(help_text="Электронная почта пользователя")
    phone = models.CharField(max_length=20, help_text="Телефон пользователя")
    comment = models.TextField(blank=True, null=True, help_text="Комментарий пользователя")
    status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('processed', 'Processed')], default='pending', help_text="Статус заявки")