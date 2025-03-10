import uuid

from django.shortcuts import render
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Payment, Booking
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Tour
from .serializers import TourSerializer

class CustomPagination(PageNumberPagination):
    page_size = 10  # Количество туров на странице
    page_size_query_param = 'page_size'
    max_page_size = 100

# ViewSet для работы с турами
class TourViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['country__Continent', 'country', 'city', 'duration_days']  # Фильтры по параметрам
    search_fields = ['title', 'description']  # Полнотекстовый поиск
    ordering_fields = ['duration_days']  # Сортировка по цене и длительности



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