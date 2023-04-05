import base64
from rest_framework import status
from . import serializers
from . import models
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password, check_password
from googleapiclient.discovery import build
from django.conf import settings
from django.utils import timezone


def add_admin():
    try:
        models.Users.objects.get(email="admin@gmail.com")
    except Exception as e:
        user = models.Users()
        user.password = make_password("admin")
        user.username = "admin"
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print("ADMIN ADDED")


add_admin()


@api_view(['POST'])
def validate(request):
    if request.method == "POST":
        # VALIDATE A USER
        data = JSONParser().parse(request)
        Users = models.Users.objects.all()
        username = data["username"]
        password = data["password"]
        if username and password is not None:
            count = Users.filter(username=username).count()
            if count != 0:
                data = Users.filter(username=username).values(
                    'password').first()
                if check_password(password, data["password"]) or password == data["password"]:
                    userData = Users.filter(username=username).first()
                    SerializedData = serializers.ViewUsersSerializer(
                        userData, many=False)
                    return JsonResponse(SerializedData.data, safe=False)
                else:
                    return JsonResponse({'message': 'Incorrect password'}, safe=False)
            else:
                return JsonResponse({'message': 'No account associated with this email'}, status=status.HTTP_200_OK)
        return JsonResponse({'message': 'empty'}, status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET'])
def user(request, pk=None):
    if request.method == "GET":
        # GET A USER BY ID
        if pk is None:
            return JsonResponse({"message": "No user id given"}, safe=False)
        instance = models.Users.objects.exclude(pk=pk).exclude(username="admin").all()
        object = serializers.ViewUsersSerializer(instance, many=True)
        return JsonResponse(object.data, safe=False)
    if request.method == "POST":
        # ADD A USER
        data = JSONParser().parse(request)
        serializer = serializers.UsersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            instance = models.Users.objects.get(username=data['username'])
            SerializedData = serializers.ViewUsersSerializer(
                instance, many=False)
            return JsonResponse(SerializedData.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "Username or email already exists"
        },  status=status.HTTP_200_OK)
    if request.method == "PUT":
        # UPDATE A USER
        if pk is None:
            return JsonResponse({"message": "No user id given"}, safe=False)
        data = JSONParser().parse(request)
        instance = models.Users.objects.get(pk=int(pk))
        object = serializers.ViewUsersSerializer(instance, data=data)
        if object.is_valid():
            object.save()
            return JsonResponse(object.data, status=status.HTTP_200_OK)
        print(object.errors)
        return JsonResponse({
            "message": "Username/Email already exists"
        },  status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'GET', 'DELETE'])
def review(request, pk=None):
    if request.method == "GET":
        # GET REVIEWS BY ID
        if pk is None:
            return JsonResponse({"message": "No user id given"}, safe=False)
        instance = models.Review.objects.filter(
            acceptor__id=pk).order_by("-timestamp")
        object = serializers.ViewCommentsSerializer(instance, many=True)
        data = []
        for one in object.data:
            data.append({
                **one,
                "replies": serializers.ViewRepliesSerializer(models.Replies.objects.filter(comment__id=one["id"]).order_by("-timestamp"), many=True).data
            })
        return JsonResponse(data, safe=False)
    if request.method == "POST":
        # ADD A REVIEW
        data = JSONParser().parse(request)
        serializer = serializers.CommentsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "PUT":
        # UPDATE A REVIEW
        if pk is None:
            return JsonResponse({"message": "No comment id given"}, safe=False)
        data = JSONParser().parse(request)
        instance = models.Comments.objects.get(pk=int(pk))
        object = serializers.CommentsSerializer(instance, data=data)
        if object.is_valid():
            object.save()
            return JsonResponse(object.data, status=status.HTTP_200_OK)
        print(object.errors)
        return JsonResponse({
            "message": "System error. Please try again."
        },  status=status.HTTP_200_OK)
    if request.method == "DELETE":
        # DELETE A REVIEW
        if pk is None:
            return JsonResponse({"message": "No comment id given"}, safe=False)
        instance = models.Comments.objects.get(pk=int(pk))
        instance.delete()
        return JsonResponse({},  status=status.HTTP_200_OK)
