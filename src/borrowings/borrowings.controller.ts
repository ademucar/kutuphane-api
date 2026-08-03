import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BorrowingsService } from './borrowings.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';

@ApiTags('borrowings') // Swagger dokümanında ödünç alma rotalarını 'borrowings' başlığında topladım.[cite: 45]
@ApiBearerAuth() // Bu controller'daki tüm rotaların Bearer Token (giriş yapmayı) gerektirdiğini Swagger arayüzünde belirttim.[cite: 45]
@UseGuards(JwtAuthGuard) // Controller seviyesine JWT kalkanını koydum ki buradaki hiçbir metoda yetkisiz (tokensız) erişilemesin.[cite: 45]
@Controller('borrowings') // Rotalarımın '/borrowings' ön eki ile başlamasını sağladım.[cite: 45]
export class BorrowingsController {
  constructor(private borrowingsService: BorrowingsService) {} // Ödünç alma iş mantığını yönetecek servisi sınıfıma enjekte ettim.[cite: 45]

  @Post() // Yeni bir ödünç alma işlemi başlatmak için POST rotası tanımladım.[cite: 45]
  borrow(@Request() req: any, @Body() dto: CreateBorrowingDto) { // İsteği yapan kullanıcının token'ından çıkarılan ID'sini (req.user.userId) ve almak istediği kitabın ID'sini (dto) yakaladım.[cite: 45]
    return this.borrowingsService.borrow(req.user.userId, dto.bookId); // Bu verileri doğrudan servise ileterek asıl işlemin başlamasını sağladım.[cite: 45]
  }

  @Patch(':id/return') // Bir kitabı iade etmek için o işlemin ID'sini alan bir PATCH rotası oluşturdum ki kısmi güncelleme mantığına uygun olsun.[cite: 45]
  returnBook(@Request() req: any, @Param('id', ParseIntPipe) id: number) { // Hangi kullanıcının hangi kayıt ID'sini iade etmek istediğini yakaladım ve ID'yi sayıya çevirerek doğruladım.[cite: 45]
    return this.borrowingsService.returnBook(req.user.userId, id); // İade işlemini servise yönlendirdim.[cite: 45]
  }

  @Get('my') // Kullanıcının sadece kendi aldığı kitapları görmesi için özel bir GET rotası ekledim.[cite: 45]
  myBorrowings(@Request() req: any) { // JWT token'dan gelen kullanıcı ID'sini çektim.[cite: 45]
    return this.borrowingsService.myBorrowings(req.user.userId); // Sadece bu ID'ye ait ödünç kayıtlarını listelemesi için servisi çağırdım.[cite: 45]
  }

  @UseGuards(RolesGuard) // İstatistik rotaları için sadece yetki kontrolü yapan ek bir kalkan ekledim (Zaten yukarıda JWT kalkanı tüm sınıf için devrede).[cite: 45]
  @Roles('ADMIN') // İstatistikleri yalnızca yöneticilerin görebilmesini sağladım ki hassas veriler normal kullanıcılara sızmasın.[cite: 45]
  @Get('stats/popular-books') // En çok okunan kitapları listelemek için GET rotası oluşturdum.[cite: 45]
  mostBorrowedBooks() {
    return this.borrowingsService.mostBorrowedBooks();
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN') // En aktif kullanıcıları görme yetkisini de sadece ADMIN'lere özel kıldım.[cite: 45]
  @Get('stats/active-users')
  mostActiveUsers() {
    return this.borrowingsService.mostActiveUsers();
  }
}