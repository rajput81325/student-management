from django.contrib import admin
from django.urls import path,include
from school.views import *

urlpatterns = [
   path('',index, name="index"),
   path('dashboard/', dashboard, name='dashboard'), 
   path('notification/mark-as-read/', mark_notification_as_read, name='mark_notification_as_read' ),
   path('notification/clear-all', clear_all_notification, name= "clear_all_notification")


]
