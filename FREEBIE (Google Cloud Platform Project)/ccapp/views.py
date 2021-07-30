from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.models import User, auth
from django.utils.datastructures import MultiValueDictKeyError
from django.views.generic import TemplateView, ListView
from django.core import mail
from .models import postEvent
from .models import postFood
from .models import studentTable
from .models import employeeTable
from .models import postFood1
from .models import postEvent1
from .models import subscribe

from django.contrib.auth import authenticate, login
from django.contrib import auth
import random
import json
from django.db.models import F
import re
from django.core.mail import send_mail
from django.template import Context
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import smtplib

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# environment variables
username = 'noreply.freebiecc@gmail.com'
password = 'rajini123'

def home(request):
    return render(request,'ccapp/index1.html')

def about(request):
    return HttpResponse('<h1>Blog About</h1>')

def empsignin(request):
    global emp_user_emailId
    global emp_user_name
    global emp_college

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password'] 


        if employeeTable.objects.filter(username = username).exists():
            
            user_record = employeeTable.objects.get(username=username)

            emp_user_emailId = user_record.email
            emp_user_name = user_record.username
            emp_password = user_record.password1
            emp_college = user_record.universityname
            user  = auth.authenticate(username= username, password = password)
            user = None
            if emp_user_name==username and emp_password==password:
                user = user_record

            if user is not None:
                return render(request,'ccapp/employeePage.html',{"user": emp_user_name,"clg":emp_college})

        
        messages.info(request,'Invalid credentials')
        return redirect('../employee/')

    else:
        return render(request, 'ccapp/empLogin.html')


def empcreate(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email')
        universityname = request.POST.get('universityname')
        
        if password1 == password2:
            if employeeTable.objects.filter(username=username).exists():
                messages.info(request, 'Username Taken')
                return redirect('/employeecreate/')

            elif employeeTable.objects.filter(email=email).exists():
                messages.info(request, 'Email Taken')
                return redirect('/employeecreate/')

            else:
                empcreateobj = employeeTable()
                empcreateobj.first_name = first_name
                empcreateobj.last_name = last_name
                empcreateobj.username = username
                empcreateobj.password1 = password1
                empcreateobj.password2 = password2
                empcreateobj.email = email
                empcreateobj.universityname = universityname
                empcreateobj.save()
                messages.info(request, 'User created successfully')
                return redirect('../employee/')
        else:
            messages.info(request, 'Password not matching')
            return redirect('/employeecreate/')

        
    else:
        return render(request,'ccapp/empCreate.html')

def stdsignin(request):
    global std_user_emailId
    global std_user_name
    global std_college

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password'] 
        totalstudents = studentTable.objects.all().values()
        count = 0
        for i in totalstudents:
            user_std = i["username"]
            pass_std = i["password1"]

            if username ==  user_std:
                if password == pass_std:
                    count +=100
            else:
                count +=1

        if count > 99:
            user_record = studentTable.objects.get(username=username)
            std_college = user_record.universityname
            std_user_name = user_record.username
            std_user_emailId = user_record.email
            return render(request,'ccapp/studentPage.html',{"user": std_user_name,"clg":std_college})

        else:
            messages.info(request,'Invalid credentials')
            return redirect('../student/')

    else:
        return render(request, 'ccapp/stdLogin.html')


def stdcreate(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email')
        universityname = request.POST.get('universityname')

        if password1 == password2:
            if studentTable.objects.filter(username=username).exists():
                messages.info(request, 'Username Taken')
                return redirect('/studentcreate/')

            elif studentTable.objects.filter(email=email).exists():
                messages.info(request, 'Email Taken')
                return redirect('/studentcreate/')

            else:
                stdcreateobj = studentTable()
                stdcreateobj.first_name = first_name
                stdcreateobj.last_name = last_name
                stdcreateobj.username = username
                stdcreateobj.password1 = password1
                stdcreateobj.password2 = password2
                stdcreateobj.email = email
                stdcreateobj.universityname = universityname
                stdcreateobj.save()
                messages.info(request, 'User created successfully')
                return redirect('../student/')
        else:
            messages.info(request, 'Password not matching')
            return redirect('/studentcreate/')

        
    else:
        return render(request,'ccapp/stdCreate.html')


def emppage(request):
        return render(request,'ccapp/employeePage.html')


def stdpage(request):
    return render(request,'ccapp/studentPage.html')

def foodpost(request):
    if request.method == 'POST':
        postfoodobj = postFood1()
        organizationname=request.POST.get('organizationName')
        universityname = request.POST.get('universityname')
        campuslocation = request.POST.get('location')
        typefood = request.POST.get('typeOfFood')
        capacity = request.POST.get('numberOfPeopleItFeeds')
        description=request.POST.get('description')

        postfoodobj.organizationname = organizationname
        postfoodobj.campuslocation = campuslocation
        postfoodobj.typefood = typefood
        postfoodobj.capacity = capacity
        postfoodobj.description = description
        postfoodobj.universityname = universityname
        postfoodobj.save()

        totalSubscribers = subscribe.objects.all().values()

        for i in totalSubscribers:
            subscriberEmail = i['email']
            send_mail(
            "New food posted for you",'New Food Posted','FREEBIE <noreply.freebiecc@gmail.com>',[subscriberEmail],
                None,
                )
        
        messages.info(request, 'Food Availability Posted Successfully')
        return render(request,'ccapp/employeePage.html',{"user": emp_user_name,"clg":emp_college})


    else:
        return render(request,'ccapp/foodPost.html')


def eventpost(request):
    if request.method == 'POST':
        posteventobj = postEvent1()
        eventname=request.POST.get('eventName')
        universityname = request.POST.get('universityname')
        campuslocation = request.POST.get('location')
        description=request.POST.get('description')

        posteventobj.eventname = eventname
        posteventobj.campuslocation = campuslocation
        posteventobj.description = description
        posteventobj.universityname = universityname
        posteventobj.save()

        totalSubscribers = subscribe.objects.all().values()
        for i in totalSubscribers:
            subscriberEmail = i['email']
            send_mail(
           "New event posted for you",'New Event Posted','FREEBIE <noreply.freebiecc@gmail.com>',[subscriberEmail],
             None,
             )


        messages.info(request, 'Event Availability Posted Successfully')
        return render(request,'ccapp/employeePage.html',{"user": emp_user_name,"clg":emp_college})


    else:
        return render(request,'ccapp/eventPost.html')


def searchevents(request):
    univ = request.GET.get('univ2')
    event_record = postEvent1.objects.filter(universityname=univ)
    return render(request,'ccapp/searchEvents.html',{"data": event_record,"user": std_user_name,"clg":std_college})


def searchfood(request):
    univ = request.GET.get('univ1')
    food_record = postFood1.objects.filter(universityname=univ)
    return render(request,'ccapp/searchFood.html',{"data": food_record,"user": std_user_name,"clg":std_college})

def generateFoodBookingId(request):
    bookingId=random.randint(1000,10000)
    msg="Your booking Id is "+str(bookingId)
    postfoodobj = postFood1()
    newId=request.GET.get('searchFoodid')
    
    product = postFood1.objects.get(id=newId)
    newOrganizationName = product.organizationname
    newCampusLocation = product.campuslocation
    newTypefood = product.typefood
    newDescription = product.description
    newUniversity = product.universityname
    newCapacity = product.capacity -1
        
    postfoodobj.organizationname = newOrganizationName
    postfoodobj.campuslocation = newCampusLocation
    postfoodobj.typefood = newTypefood
    postfoodobj.capacity = newCapacity
    postfoodobj.description = newDescription
    postfoodobj.universityname = newUniversity
    postfoodobj.id = newId

    postfoodobj.save()
    send_mail(
           'Hello ' +std_user_name+'Thankyou for booking at '+newOrganizationName+' and your booking Id is :'+str(bookingId)+'.','Thank You for Booking','FREEBIE <noreply.freebiecc@gmail.com>',[std_user_emailId],
             None,
             )
    
    food_record = postFood1.objects.filter(universityname=newUniversity)
    return render(request,'ccapp/searchFood.html',{"data": food_record,"msg": msg, "user": std_user_name,"clg":std_college})

def generateEventBookingId(request):
    eventBookingId=random.randint(10000,100000)
    msg="Your booking Id is "+str(eventBookingId)
    posteventobj = postEvent1()
    newId=request.GET.get('searchEventid')
    
    event = postEvent1.objects.get(id=newId)
    newEventName = event.eventname
    newCampusLocation = event.campuslocation
    newUniversity = event.universityname
    send_mail(
           'Hello ' +std_user_name+'Thankyou for booking at '+newEventName+' at '+newCampusLocation+' and your booking Id is :'+str(eventBookingId)+'.','Thank You for Booking','FREEBIE <noreply.freebiecc@gmail.com>',[std_user_emailId],
             None,
             )
    
    event_record = postEvent1.objects.filter(universityname=newUniversity)
    return render(request,'ccapp/searchEvents.html',{"data": event_record,"msg": msg, "user": std_user_name,"clg":std_college})

def subscribeUser(request):
    if request.method == 'POST':

        subscribeobj = subscribe()
        user_name = request.POST.get('name')
        user_email = request.POST.get('email')
        user_college = request.POST.get('colleges')
        
        subscribeobj.username = user_name
        subscribeobj.email = user_email
        subscribeobj.college = user_college
        subscribeobj.save()
        send_mail(
           'Hello ' +user_name+', Thankyou for Subscribing ','Thank You for Subscribing our Application','FREEBIE <noreply.freebiecc@gmail.com>',[user_email],
             None,
             )
        
        messages.info(request, 'Subscribed Successfully')
        return redirect('../subscribe/')

    else:
        return render(request,'ccapp/subscribe.html')


def mail(request):
    return render(request,'ccapp/mail.html')

def send_mail(text='Email Body', subject='Hello World', from_email='FREEBIE <noreply.freebiecc@gmail.com>', to_emails=['nikhilpersonal12@gmail.com'], html=None):
    assert isinstance(to_emails, list)

    msg=MIMEMultipart('alternative')
    msg['From']=from_email
    msg['To']=",".join(to_emails)
    msg['Subject']=subject
    
    txt_part = MIMEText(text, 'plain')
    msg.attach(txt_part)

    msg_str=msg.as_string()

    server=smtplib.SMTP(host='smtp.gmail.com',port=587)
    server.ehlo()
    server.starttls()
    server.login(username,password)
    server.sendmail(from_email,to_emails,msg_str)
    server.quit()

    




