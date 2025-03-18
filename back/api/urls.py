from django.urls import path
from .views import create_payment, check_payment_status, TourViewSet, CountryViewSet, TourDetailView, \
    TourReviewsAPIView, RegisterView, LoginView, UserProfileView, LogoutView, UserProfileView_2, UserProfileUpdateView, \
    UserBookingHistoryView, UserReviewView, ReviewUpdateAPIView, UserFormCreateView, TopTourViewSet

urlpatterns = [
    path('tours/', TourViewSet.as_view({'get': 'list'}), name='tour-list'),
    path('top-tours/', TopTourViewSet.as_view({'get': 'list'}), name='top-tour-list'),
    path('tour/<int:id>/', TourDetailView.as_view(), name='tour-detail'),

    path('profile/', UserProfileView.as_view(), name='user-profile'),

    path('user-profile/', UserProfileView_2.as_view(), name='user-profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),

    path('user-booking-history/', UserBookingHistoryView.as_view(), name='user-booking-history'),

    path('user-reviews/', UserReviewView.as_view(), name='user-reviews'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path("tour/<int:tour_id>/reviews/<int:review_id>/", ReviewUpdateAPIView.as_view(), name="update-review"),

    path('forms/', UserFormCreateView.as_view(), name='user_form_create'),

    path('tour/<int:tour_id>/reviews/', TourReviewsAPIView.as_view(), name='tour-reviews'),

    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),

    path('countries/', CountryViewSet.as_view({'get': 'list'}), name='countries-list'),
    path('pay/<int:booking_id>/', create_payment, name='create_payment'),
    path('pay/status/<uuid:payment_id>/', check_payment_status, name='check_payment_status'),

]
