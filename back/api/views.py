import uuid

import django_filters
from urllib.parse import unquote
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Payment, Booking, Country
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .serializers import TourSerializer, CountrySerializer, TourDetailSerializer, \
    UserProfileSerializer_2, BookingSerializer, ReviewSerializer2, UserFormSerializer
from django.utils.translation import activate
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework import generics, status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from .models import Tour, Review, ReviewImage
from .serializers import ReviewSerializer, ReviewSerializer3


class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer_2
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class UserProfileView_2(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # ← Блокируем refresh_token
            return Response({"success": "Logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class TourFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    duration_min = django_filters.NumberFilter(field_name="duration_days", lookup_expr='gte')
    duration_max = django_filters.NumberFilter(field_name="duration_days", lookup_expr='lte')

    class Meta:
        model = Tour
        fields = ['country__Continent', 'country']

class TopTourViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tour.objects.filter(is_top=True)
    serializer_class = TourSerializer

class TourViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tour.objects.all().distinct()
    serializer_class = TourSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TourFilter
    search_fields = ['title', 'description']
    ordering_fields = ['duration_days']

    def initial(self, request, *args, **kwargs):
        """Смена языка в зависимости от Accept-Language"""
        lang = request.headers.get('Accept-Language', 'ru')
        activate(lang)

        if 'search' in request.GET:
            request.GET._mutable = True  # Делаем QueryDict изменяемым (только в debug)
            request.GET['search'] = unquote(request.GET['search'])
            request.GET._mutable = False

        super().initial(request, *args, **kwargs)


class TourDetailView(RetrieveAPIView):
    """Класс для детального просмотра тура"""
    queryset = Tour.objects.all()
    serializer_class = TourDetailSerializer
    lookup_field = "id"  # Используем id вместо pk

    def initial(self, request, *args, **kwargs):
        """Смена языка в зависимости от Accept-Language"""
        lang = request.headers.get('Accept-Language', 'ru')
        activate(lang)
        super().initial(request, *args, **kwargs)


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['Continent']

class TourReviewsAPIView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        """Доступ к POST и PUT только для авторизованных пользователей"""
        if self.request.method in ["POST"]:
            return [permissions.IsAuthenticated()]
        return []

    def get_queryset(self):
        tour_id = self.kwargs.get('tour_id')
        if not Tour.objects.filter(id=tour_id).exists():
            raise NotFound("Тур не найден")
        return Review.objects.filter(tour_id=tour_id)

    def get_serializer_class(self):
        if self.request.method in ["POST"]:
            return ReviewSerializer3
        return ReviewSerializer

    def create(self, request, *args, **kwargs):
        tour_id = self.kwargs.get('tour_id')
        try:
            tour = Tour.objects.get(id=tour_id)
        except Tour.DoesNotExist:
            raise NotFound("Тур не найден")

        data = request.data.copy()
        data['tour'] = tour_id
        data['user'] = request.user.id

        serializer = self.get_serializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewUpdateAPIView(generics.UpdateAPIView):
    """Обновление отзыва"""
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.all()

    def get_serializer_class(self):
        return ReviewSerializer3

    def update(self, request, *args, **kwargs):
        review = get_object_or_404(Review, id=kwargs["review_id"], user=request.user)

        # Удаляем старые изображения
        review.review_images.all().delete()

        # Копируем данные из запроса
        data = request.data.copy()

        # Обрабатываем сериализатор
        serializer = self.get_serializer(review, data=data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Загружаем новые изображения
        images_data = request.FILES.getlist("images")
        for image in images_data:
            ReviewImage.objects.create(review=review, image=image)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")


        user = authenticate(request, username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Доступ только для авторизованных пользователей

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

class UserBookingHistoryView(APIView):
    permission_classes = [IsAuthenticated]  # Доступ только для авторизованных пользователей

    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(user=user, status__in=['confirmed', 'cancelled'])
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class UserReviewView(APIView):
    permission_classes = [IsAuthenticated]  # Доступ только для авторизованных пользователей

    def get(self, request):
        user = request.user
        reviews = Review.objects.filter(user=user)
        serializer = ReviewSerializer2(reviews, many=True)
        return Response(serializer.data)


class UserFormCreateView(APIView):
    def post(self, request):
        serializer = UserFormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Форма успешно отправлена!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def create_payment(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)

    payment = Payment.objects.create(
        booking=booking,
        amount=booking.tour.price * 10000,
        order_id=str(uuid.uuid4())
    )
    payment.order_id = str(payment.id)
    payment.save()

    headers = {
        "Authorization": f"Bearer {settings.KASPI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "amount": payment.amount,
        "currency": payment.currency,
        "orderId": payment.order_id,
        "description": "Оплата тура",
        "returnUrl": "https://example.com/payment-success"
    }

    response = requests.post(settings.KASPI_PAYMENT_URL, json=data, headers=headers)

    if response.status_code == 200:
        payment.payment_url = response.json().get("payment_url")
        payment.save()
        return JsonResponse({"payment_url": payment.payment_url})

    return JsonResponse({"error": "Ошибка при создании платежа"}, status=400)


def check_payment_status(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id)

    headers = {"Authorization": f"Bearer {settings.KASPI_API_KEY}"}
    response = requests.get(f"{settings.KASPI_PAYMENT_URL}/{payment.order_id}", headers=headers)

    if response.status_code == 200:
        status = response.json().get("status")
        payment.payment_status = status
        payment.save()
        return JsonResponse({"status": status})

    return JsonResponse({"error": "Ошибка при получении статуса"}, status=400)