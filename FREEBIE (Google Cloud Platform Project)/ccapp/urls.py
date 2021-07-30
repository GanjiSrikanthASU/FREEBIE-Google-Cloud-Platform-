from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='blog-home'),
    path('about/', views.about, name='blog-about'),
    path('employee/', views.empsignin, name='emp-about'),
    path('student/', views.stdsignin, name='std-about'),
    path('employeecreate/', views.empcreate, name='emp-create'),
    path('studentcreate/', views.stdcreate, name='std-create'),
    path('employeepage/', views.emppage, name='emp-page'),
    path('studentpage/', views.stdpage, name='std-page'),
    path('foodpost/', views.foodpost, name='emp-post'),
    path('eventpost/', views.eventpost, name='emp-post'),
    path('searchfood/', views.searchfood, name='std-searchfood'),
    path('generatefoodbookingid/', views.generateFoodBookingId, name='booking-id'),
    path('generateeventbookingid/', views.generateEventBookingId, name='booking-id1'),
    path('searchevents/', views.searchevents, name='std-searchevents'),
    path('student/subscribe/', views.subscribeUser, name='std-subscribe'),
    path('studentpage/mail/', views.mail, name='std-subscribe')
]