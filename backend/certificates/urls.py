from django.urls import path
from .views import CertificateListView, GenerateCertificateView, generate_pdf_certificate

urlpatterns = [
    path('', CertificateListView.as_view(), name='certificate-list'),
    path('generate/', GenerateCertificateView.as_view(), name='generate-certificate'),
    path('download/<int:certificate_id>/', generate_pdf_certificate, name='download-certificate'),
]