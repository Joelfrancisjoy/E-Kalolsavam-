from django.db import models
from users.models import User
from events.models import Event
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw

class Certificate(models.Model):
    participant = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    certificate_file = models.FileField(upload_to='certificates/')
    issued_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)

    def __str__(self):
        return f"Certificate for {self.participant.username} - {self.event.name}"

    def save(self, *args, **kwargs):
        if not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)

    def generate_qr_code(self):
        qr_content = f"Certificate ID: {self.id} | Participant: {self.participant.username} | Event: {self.event.name}"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_content)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        filename = f'qr_{self.id}.png'
        filebuffer = File(buffer, name=filename)
        self.qr_code.save(filename, filebuffer)