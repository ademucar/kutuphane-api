import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common'; // API rotalarını ve güvenlik kalkanlarını oluşturmak için gerekli NestJS paketlerini dahil ettim.[cite: 68]
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Swagger dökümantasyonu için gerekli etiket ve yetkilendirme (kilit) simgelerini getirdim.[cite: 68]
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Rotayı koruyacak JWT kalkanımı dahil ettim.[cite: 68]
import { ReservationsService } from './reservations.service'; // İş mantığını barındıran servisi projeye bağladım.[cite: 68]
import { CreateReservationDto } from './dto/create-reservation.dto'; // Gelen veriyi doğrulamak için yazdığım DTO'yu getirdim.[cite: 68]

@ApiTags('reservations') // Bu controller'daki işlemleri Swagger üzerinde 'reservations' başlığı altında grupladım.[cite: 68]
@ApiBearerAuth() // Buradaki tüm rotaların token gerektirdiğini Swagger'a bildirdim.[cite: 68]
@UseGuards(JwtAuthGuard) // Tüm sınıf seviyesinde JWT kalkanını aktif ettim ki giriş yapmayan kimse buradaki işlemlere erişemesin.[cite: 68]
@Controller('reservations') // Rotalarımın '/reservations' ön ekiyle başlamasını sağladım.[cite: 68]
export class ReservationsController { // Controller sınıfımı dışa aktardım.[cite: 68]
  constructor(private reservationsService: ReservationsService) {} // Controller'ın içinde kullanmak üzere rezervasyon servisini enjekte ettim.[cite: 68]

  @Post() // Yeni rezervasyon oluşturmak için POST rotasını tanımladım.[cite: 68]
  reserve(@Request() req: any, @Body() dto: CreateReservationDto) { // İsteği yapan kullanıcının kimliğini token'dan (req.user), hedef kitap ID'sini ise DTO'dan (body) yakaladım.[cite: 68]
    return this.reservationsService.reserve(req.user.userId, dto.bookId); // Bilgileri servise gönderip rezervasyon işlemini başlattım.[cite: 68]
  }

  @Delete(':id') // Var olan bir rezervasyonu iptal etmek (silmek) için DELETE rotasını belirledim.[cite: 68]
  cancel(@Request() req: any, @Param('id', ParseIntPipe) id: number) { // Kullanıcının kimliğini ve iptal edeceği rezervasyonun ID'sini sayı olarak (ParseIntPipe) aldım.[cite: 68]
    return this.reservationsService.cancel(req.user.userId, id); // İptal işlemi için servisi çağırdım.[cite: 68]
  }

  @Get('my') // Kullanıcının sadece kendi rezervasyonlarını görebilmesi için '/reservations/my' GET rotasını tanımladım.[cite: 68]
  myReservations(@Request() req: any) { // İstek yapan kullanıcının ID'sini yakaladım.[cite: 68]
    return this.reservationsService.myReservations(req.user.userId); // Kullanıcının aktif rezervasyonlarını getirmesi için servise yönlendirdim.[cite: 68]
  }
}