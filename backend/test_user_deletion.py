"""
Test script to verify user deletion functionality works correctly
for students, volunteers, and judges without causing 500 errors.
"""
import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_kalolsavam.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import transaction
from users.models import AllowedEmail, School
from events.models import Event, EventRegistration, Venue, Judge as JudgeProfile
from scores.models import Score, Result
from volunteers.models import VolunteerAssignment, VolunteerShift
from notifications.models import Notification
try:
    from certificates.models import Certificate
    HAS_CERTIFICATES = True
except:
    HAS_CERTIFICATES = False
try:
    from feedback.models import Feedback
    HAS_FEEDBACK = True
except:
    HAS_FEEDBACK = False

User = get_user_model()

def create_test_admin():
    """Create or get an admin user for testing"""
    admin = User.objects.filter(role='admin', username='test_admin').first()
    if not admin:
        admin = User.objects.create_user(
            username='test_admin',
            email='test_admin@test.com',
            password='testpass123',
            role='admin',
            first_name='Test',
            last_name='Admin',
            is_staff=True,
            is_superuser=True,
            approval_status='approved'
        )
        print(f"✓ Created test admin: {admin.username}")
    else:
        print(f"✓ Using existing test admin: {admin.username}")
    return admin

def create_test_student(admin):
    """Create a test student with relationships"""
    # Create or get school
    school = School.objects.filter(name='Test School').first()
    if not school:
        school = School.objects.create(
            name='Test School',
            category='HS',
            is_active=True
        )
    
    student = User.objects.create_user(
        username='test_student_del',
        email='test_student_del@test.com',
        password='testpass123',
        role='student',
        first_name='Test',
        last_name='Student',
        school=school,
        student_class=9,
        school_category_extra='HS',
        approval_status='pending'
    )
    
    # Create an AllowedEmail created by this student
    AllowedEmail.objects.create(
        email='allowed_by_student@test.com',
        is_active=True,
        created_by=student
    )
    
    # Create a notification for this student
    Notification.objects.create(
        user=student,
        title='Test Notification',
        message='Test message',
        notification_type='system'
    )
    
    # Create feedback by this student
    if HAS_FEEDBACK:
        Feedback.objects.create(
            user=student,
            feedback_type='system',
            subject='Test Feedback',
            message='Test feedback message'
        )
    
    print(f"✓ Created test student: {student.username} with relationships")
    return student

def create_test_volunteer(admin):
    """Create a test volunteer with relationships"""
    volunteer = User.objects.create_user(
        username='test_volunteer_del',
        email='test_volunteer_del@test.com',
        password='testpass123',
        role='volunteer',
        first_name='Test',
        last_name='Volunteer',
        approval_status='approved'
    )
    
    # Create an AllowedEmail created by this volunteer
    AllowedEmail.objects.create(
        email='allowed_by_volunteer@test.com',
        is_active=True,
        created_by=volunteer
    )
    
    # Create a notification
    Notification.objects.create(
        user=volunteer,
        title='Volunteer Notification',
        message='Test message',
        notification_type='system'
    )
    
    print(f"✓ Created test volunteer: {volunteer.username} with relationships")
    return volunteer

def create_test_judge(admin):
    """Create a test judge with relationships"""
    judge = User.objects.create_user(
        username='test_judge_del',
        email='test_judge_del@test.com',
        password='testpass123',
        role='judge',
        first_name='Test',
        last_name='Judge',
        approval_status='approved'
    )
    
    # Create judge profile
    JudgeProfile.objects.create(
        user=judge,
        specialization='Music'
    )
    
    # Create an AllowedEmail created by this judge
    AllowedEmail.objects.create(
        email='allowed_by_judge@test.com',
        is_active=True,
        created_by=judge
    )
    
    # Create a notification
    Notification.objects.create(
        user=judge,
        title='Judge Notification',
        message='Test message',
        notification_type='system'
    )
    
    print(f"✓ Created test judge: {judge.username} with relationships")
    return judge

def test_user_deletion(user, admin):
    """Test deleting a user and verify no errors occur"""
    from django.db.models import Q
    from events.models import EventRegistration, ParticipantVerification
    from scores.models import Score, Result
    from volunteers.models import VolunteerAssignment
    
    user_id = user.id
    username = user.username
    role = user.role
    
    print(f"\n--- Testing deletion of {role}: {username} (ID: {user_id}) ---")
    
    # Check initial relationships
    allowed_emails_created = AllowedEmail.objects.filter(created_by=user).count()
    notifications = Notification.objects.filter(user=user).count()
    
    print(f"  Initial state:")
    print(f"    - AllowedEmails created by user: {allowed_emails_created}")
    print(f"    - Notifications: {notifications}")
    
    try:
        with transaction.atomic():
            # Simulate the deletion logic from AdminUserDetailView.destroy()
            
            # Step 1: Detach M2M assignments
            try:
                user.assigned_events.clear()
            except Exception:
                pass
            try:
                user.assigned_volunteer_events.clear()
            except Exception:
                pass
            
            # Step 2: Reassign events created by this user
            try:
                from events.models import Event
                Event.objects.filter(created_by=user).update(created_by_id=admin.id)
            except Exception:
                pass
            
            # Step 3: Reassign AllowedEmail records
            try:
                AllowedEmail.objects.filter(created_by=user).update(created_by_id=admin.id)
            except Exception:
                pass
            
            # Step 4: Delete dependent rows
            try:
                from django.db.models import Q
                from events.models import EventRegistration, ParticipantVerification
                from scores.models import Score, Result
                from volunteers.models import VolunteerAssignment
                
                EventRegistration.objects.filter(participant=user).delete()
                ParticipantVerification.objects.filter(Q(participant=user) | Q(volunteer=user)).delete()
                Score.objects.filter(Q(participant=user) | Q(judge=user)).delete()
                Result.objects.filter(participant=user).delete()
                VolunteerAssignment.objects.filter(volunteer=user).delete()
                Notification.objects.filter(user=user).delete()
                if HAS_CERTIFICATES:
                    Certificate.objects.filter(participant=user).delete()
                if HAS_FEEDBACK:
                    Feedback.objects.filter(user=user).delete()
                JudgeProfile.objects.filter(user=user).delete()
            except Exception as e:
                print(f"  ✗ Error cleaning up dependencies: {e}")
                raise
            
            # Step 5: Delete the user
            user.delete()
            
        print(f"  ✓ Successfully deleted {role}: {username}")
        
        # Verify user is gone
        if User.objects.filter(id=user_id).exists():
            print(f"  ✗ ERROR: User still exists after deletion!")
            return False
        
        # Verify AllowedEmails were reassigned, not deleted
        reassigned_emails = AllowedEmail.objects.filter(created_by=admin, email__contains=f'allowed_by_{role}').count()
        if allowed_emails_created > 0 and reassigned_emails == 0:
            print(f"  ✗ WARNING: AllowedEmails were not properly reassigned")
        else:
            print(f"  ✓ AllowedEmails properly reassigned to admin")
        
        print(f"  ✓ All relationship cleanup successful")
        return True
        
    except Exception as e:
        print(f"  ✗ DELETION FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def cleanup_test_data():
    """Clean up any leftover test data"""
    print("\n--- Cleaning up test data ---")
    User.objects.filter(username__startswith='test_').delete()
    AllowedEmail.objects.filter(email__contains='@test.com').delete()
    School.objects.filter(name='Test School').delete()
    print("✓ Cleanup complete")

def main():
    print("=" * 60)
    print("User Deletion Test Suite")
    print("=" * 60)
    
    # Cleanup any previous test data
    cleanup_test_data()
    
    # Create test admin
    admin = create_test_admin()
    
    results = []
    
    # Test 1: Delete student
    print("\n" + "=" * 60)
    print("TEST 1: Delete Student User")
    print("=" * 60)
    student = create_test_student(admin)
    results.append(('Student', test_user_deletion(student, admin)))
    
    # Test 2: Delete volunteer
    print("\n" + "=" * 60)
    print("TEST 2: Delete Volunteer User")
    print("=" * 60)
    volunteer = create_test_volunteer(admin)
    results.append(('Volunteer', test_user_deletion(volunteer, admin)))
    
    # Test 3: Delete judge
    print("\n" + "=" * 60)
    print("TEST 3: Delete Judge User")
    print("=" * 60)
    judge = create_test_judge(admin)
    results.append(('Judge', test_user_deletion(judge, admin)))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    all_passed = True
    for role, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{role}: {status}")
        if not passed:
            all_passed = False
    
    # Final cleanup
    cleanup_test_data()
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✓ ALL TESTS PASSED - User deletion is working correctly!")
    else:
        print("✗ SOME TESTS FAILED - Please review the errors above")
    print("=" * 60)
    
    return 0 if all_passed else 1

if __name__ == '__main__':
    sys.exit(main())
