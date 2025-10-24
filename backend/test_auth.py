#!/usr/bin/env python
"""
Simple test script to verify authentication endpoints are working.
Run this from the backend directory: python test_auth.py
"""

import os
import sys
import django
import requests
import json

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_kalolsavam.settings')
django.setup()

from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from users.models import AllowedEmail, School

User = get_user_model()

def test_authentication_endpoints():
    """Test all authentication endpoints"""
    client = Client()
    base_url = 'http://localhost:8000'
    
    print("Testing Authentication Endpoints...")
    print("=" * 50)
    
    # Test 1: Check if schools endpoint is accessible
    print("1. Testing schools endpoint...")
    try:
        response = client.get('/api/auth/schools/')
        if response.status_code == 200:
            print("   ✓ Schools endpoint accessible")
        else:
            print(f"   ✗ Schools endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Schools endpoint error: {e}")
    
    # Test 2: Test user registration
    print("2. Testing user registration...")
    try:
        # Create a test school first
        school, created = School.objects.get_or_create(
            name="Test School",
            defaults={'category': 'HS', 'is_active': True}
        )
        
        registration_data = {
            'username': 'testuser123',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '9876543210',
            'role': 'judge'
        }
        
        response = client.post('/api/auth/register/', registration_data)
        if response.status_code == 201:
            print("   ✓ User registration successful")
            # Clean up test user
            User.objects.filter(username='testuser123').delete()
        else:
            print(f"   ✗ User registration failed: {response.status_code}")
            if hasattr(response, 'data'):
                print(f"     Error: {response.data}")
    except Exception as e:
        print(f"   ✗ User registration error: {e}")
    
    # Test 3: Test login endpoint
    print("3. Testing login endpoint...")
    try:
        # Create a test user for login
        test_user = User.objects.create_user(
            username='logintest',
            email='logintest@example.com',
            password='testpass123',
            first_name='Login',
            last_name='Test',
            role='student'
        )
        
        login_data = {
            'username': 'logintest',
            'password': 'testpass123'
        }
        
        response = client.post('/api/auth/login/', login_data)
        if response.status_code == 200:
            print("   ✓ Login successful")
        else:
            print(f"   ✗ Login failed: {response.status_code}")
            if hasattr(response, 'data'):
                print(f"     Error: {response.data}")
        
        # Clean up test user
        test_user.delete()
    except Exception as e:
        print(f"   ✗ Login error: {e}")
    
    # Test 4: Test Google auth endpoint (without actual token)
    print("4. Testing Google auth endpoint...")
    try:
        response = client.post('/api/auth/google/', {'token': 'invalid_token'})
        if response.status_code == 400:
            print("   ✓ Google auth endpoint accessible (correctly rejected invalid token)")
        else:
            print(f"   ✗ Google auth endpoint unexpected response: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Google auth endpoint error: {e}")
    
    print("=" * 50)
    print("Authentication endpoint testing completed!")

if __name__ == '__main__':
    test_authentication_endpoints()

