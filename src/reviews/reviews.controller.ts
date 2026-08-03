import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common'; // API rotaları ve güvenlik işlemleri için NestJS temel bileşenlerini içeri aktardım.[cite: 75]
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Swagger dökümantasyonu etiketleri ve yetkilendirme simgeleri için gerekli dekoratörleri getirdim.[cite: 75]
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Yorum yapma işlemini sadece giriş yapmış kullanıcılarla sınırlandırmak için JWT kalkanını dahil ettim.[cite: 75]
import { ReviewsService } from './reviews.service'; // Yorum iş mantığını yürütecek servisi projeye bağladım.[cite: 75]
import { CreateReviewDto } from './dto/create-review.dto'; // Gelen yorum isteklerini doğrulamak için DTO şablonunu getirdim.[cite: 75]

@ApiTags('reviews') // Swagger'da bu rotaları 'reviews' başlığı altında düzenledim.[cite: 75]
@Controller('reviews') // Rotalarımın '/reviews' ön ekiyle başlamasını sağladım.[cite: 75]
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {} // İşlemleri devretmek üzere ReviewsService'i sınıfıma enjekte ettim.[cite: 75]

  @ApiBearerAuth() // Yorum yapma rotasının token gerektirdiğini Swagger'a bildirdim.[cite: 75]
  @UseGuards(JwtAuthGuard) // Sadece giriş yapmış kullanıcıların POST isteği atabilmesi için JWT kalkanını ekledim.[cite: 75]
  @Post() // Yeni bir yorum/puan eklemek için POST rotası tanımladım.[cite: 75]
  create(@Request() req: any, @Body() dto: CreateReviewDto) { // İsteği yapan kişinin ID'sini token'dan (req.user), yorum detaylarını da gövdeden (dto) yakaladım.[cite: 75]
    return this.reviewsService.create(req.user.userId, dto); // Yakaladığım verileri servise ileterek kayıt işlemini başlattım.[cite: 75]
  }

  @Get('book/:bookId') // Bir kitaba ait tüm yorumları getirmek için herkesin (Guard olmadan) erişebileceği bir GET rotası tanımladım.[cite: 75]
  findByBook(@Param('bookId', ParseIntPipe) bookId: number) { // URL'den gelen kitap ID'sini sayıya çevirerek güvenle aldım.[cite: 75]
    return this.reviewsService.findByBook(bookId); // Kitap ID'sini servise vererek ilgili yorumların getirilmesini sağladım.[cite: 75]
  }
}