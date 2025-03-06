from django.contrib import admin
from django.urls import path,include
from student.views import *

urlpatterns = [
    path("", student_list, name='student_list'),
    path("add/", add_student, name="add_student"),
    path("<str:slug>/",view_student, name='view_student'),
    path("edit/<str:slug>/",edit_student, name='edit_student'),
    path("delete/<str:slug>/",delete_student, name='delete_student'),

  

]
