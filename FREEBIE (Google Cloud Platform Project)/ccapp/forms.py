
# from django.contrib.auth.models import User
# from django import forms
# from .models import Core
# from django.core.exceptions import ValidationError

# class Registrationform(forms.ModelForm):
#     username = forms.CharField(max_length=15, label="Username")
#     firstname = forms.CharField(max_length=15,label="Firstname")
#     lastname = forms.CharField(max_length=15,label="Lastname")
#     email = forms.EmailField(required=True)
#     password = forms.CharField(widget=forms.PasswordInput, label="Password")
#     password1 = forms.CharField(widget=forms.PasswordInput, label="PasswordConfirmation")
    
#     class Meta:
#         model = Core
#         fields = ("username", "firstname", "lastname", "email", "password", "password1",)
        
        
#     def clean_username(self):
#         username = self.cleaned_data.get('username')
#         username_qs = User.objects.filter(username=username)
        
#         if username_qs.exists():
#             raise forms.ValidationError("Username already exists")
#         return username
        
        
#     def clean_password1(self):
#         password = self.cleaned_data.get('password')
#         password1 = self.cleaned_data.get('password1')
        
#         if password and password1 and password != password1:
#             raise ValidationError("Password did n't match")
            
#         return password1
        
#     class login_form(forms.Form):
        
#         username = forms.CharField()
#         password1 = forms.CharField(widget=forms.PasswordInput)
        
#         def clean(self, *args, **kwargs):
            
#             username = self.cleaned_data.get("username")
#             password = self.cleaned_data.get("password")
#             if username and password:
#                 user = authenticate(username=username, password=password)
#                 if not user:
#                     raise forms.ValidationError("Username does not exists")
                
#                 if user.checkpassword(password):
#                     raise forms.ValidationError("Wrong Password")
#                 return render(request, 'invalid.html')