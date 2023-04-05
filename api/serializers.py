from rest_framework import serializers
from . import models


class UsersSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = models.Users
        fields = ('id', 'username', 'email', 'password',
                  'first_name', 'last_name', 'address', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class ViewUsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Users
        fields = (
            "id",
            'username',
            'address',
            "timestamp",
            'role'
        )


class ViewReviewsSerializer(serializers.ModelSerializer):
    donor = ViewUsersSerializer()
    acceptor = ViewUsersSerializer()

    class Meta:
        model = models.Review
        fields = "__all__"


class ReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = "__all__"
