from django.urls import path
from .views import create_payment, check_payment_status, TourViewSet

urlpatterns = [
    path('tours', TourViewSet.as_view({'get': 'list'}), name='tour-list'),
    path('pay/<int:booking_id>/', create_payment, name='create_payment'),
    path('pay/status/<uuid:payment_id>/', check_payment_status, name='check_payment_status'),
]
