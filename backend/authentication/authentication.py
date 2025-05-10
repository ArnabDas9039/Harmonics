# accounts/authentication.py

from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Get token from 'access_token' cookie instead of Authorization header
        access_token = request.COOKIES.get("access_token")
        if access_token is None:
            return None  # No token, no auth

        validated_token = self.get_validated_token(access_token)
        return self.get_user(validated_token), validated_token
