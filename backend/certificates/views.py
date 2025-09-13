from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers import CertificateSerializer
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from django.http import HttpResponse
from io import BytesIO

class CertificateListView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Certificate.objects.all()
        return Certificate.objects.filter(participant=user)

class GenerateCertificateView(generics.CreateAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # In a real implementation, you would generate the actual PDF certificate
        # This is a simplified version
        participant_id = request.data.get('participant')
        event_id = request.data.get('event')
        
        # Create certificate record
        certificate = Certificate.objects.create(
            participant_id=participant_id,
            event_id=event_id
        )
        
        serializer = self.get_serializer(certificate)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

def generate_pdf_certificate(request, certificate_id):
    try:
        certificate = Certificate.objects.get(id=certificate_id)
    except Certificate.DoesNotExist:
        return HttpResponse("Certificate not found", status=404)
    
    # Create a file-like buffer to receive PDF data
    buffer = BytesIO()
    
    # Create the PDF object, using the buffer as its "file."
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Draw things on the PDF
    p.drawString(100, height - 100, f"Certificate of Participation")
    p.drawString(100, height - 150, f"This certifies that {certificate.participant.get_full_name()}")
    p.drawString(100, height - 170, f"has participated in {certificate.event.name}")
    p.drawString(100, height - 190, f"on {certificate.event.date}")
    
    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()
    
    # FileResponse sets the Content-Disposition header so that browsers
    # present the option to save the file.
    buffer.seek(0)
    return HttpResponse(buffer, content_type='application/pdf')