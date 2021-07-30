from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    universityname = models.CharField(max_length=250)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class studentTable(models.Model):

    first_name = models.CharField(max_length=250,default='')
    last_name = models.CharField(max_length=250)
    username = models.CharField(max_length=250)
    password1 = models.CharField(max_length=250)
    password2 = models.CharField(max_length=250)
    email = models.CharField(max_length=250)
    universityname = models.CharField(max_length=250)

class employeeTable(models.Model):

    first_name = models.CharField(max_length=250,default='')
    last_name = models.CharField(max_length=250)
    username = models.CharField(max_length=250)
    password1 = models.CharField(max_length=250)
    password2 = models.CharField(max_length=250)
    email = models.CharField(max_length=250)
    universityname = models.CharField(max_length=250)


class postFood(models.Model):

    organizationname=models.CharField(max_length=250,default='')
    campuslocation = models.CharField(max_length=250)
    typefood = models.CharField(max_length=250)
    capacity = models.IntegerField(default=0000)
    description=models.CharField(max_length=250)

class postFood1(models.Model):

    organizationname=models.CharField(max_length=250,default='')
    campuslocation = models.CharField(max_length=250)
    typefood = models.CharField(max_length=250)
    capacity = models.IntegerField(default=0000)
    description=models.CharField(max_length=250)
    universityname = models.CharField(max_length=250)

class postEvent(models.Model):

    eventname=models.CharField(max_length=250,default='')
    campuslocation = models.CharField(max_length=250)
    description=models.CharField(max_length=250)

class postEvent1(models.Model):

    eventname=models.CharField(max_length=250,default='')
    campuslocation = models.CharField(max_length=250)
    description=models.CharField(max_length=250)
    universityname = models.CharField(max_length=250)


class subscribe(models.Model):
         username = models.CharField(max_length=15,unique=True)
         email = models.EmailField()
         college = models.CharField(max_length=15)


    