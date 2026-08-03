import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'; // Rotaları ve HTTP metotlarını bağlamak için NestJS core paketini kullandım.[cite: 38]
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Swagger dökümantasyonu için kilit ikonu ve etiket atamasını sağladım.[cite: 38]
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Sadece yetkili kullanıcıların işlem yapmasını sağlamak için JWT kalkanını getirdim.[cite: 38]
import { Roles } from '../auth/roles.decorator'; // Rol bazlı yetkilendirme dekoratörümü dahil ettim.[cite: 38]
import { RolesGuard } from '../auth/roles.guard'; // Rol kalkanımı getirdim.[cite: 38]
import { BooksService } from './books.service'; // Kitap işlemlerini halledecek servisi projeye bağladım.[cite: 38]
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books') // Swagger'da bu controller'ın rotalarını 'books' altında grupladım.[cite: 38]
@Controller('books') // Tüm uç noktaların (endpoint) '/books' prefix'i ile başlamasını sağladım.[cite: 38]
export class BooksController {
  constructor(private booksService: BooksService) {} // İş mantığını yürütecek BooksService'i dependency injection ile aldım.[cite: 38]

  @Get() // Herkesin kitapları arayabileceği bir GET rotası tanımladım.[cite: 38]
  findAll(@Query() query: QueryBooksDto) { // URL'deki '?page=1&search=Harry' gibi filtreleri (Query parameter) QueryBooksDto tipinde yakaladım ki filtrelemeyi servise gönderebileyim.[cite: 38]
    return this.booksService.findAll(query);
  }

  @Get(':id') // Tek bir kitabı detaylı görüntülemek için rotayı tanımladım.[cite: 38]
  findOne(@Param('id', ParseIntPipe) id: number) { // Gelen ID'yi sayıya çevirerek (ParseIntPipe) güvenli şekilde yakaladım.[cite: 38]
    return this.booksService.findOne(id);
  }

  @ApiBearerAuth() // Yönetici işlemlerine Swagger üzerinde kilit ikonu ekledim.[cite: 38]
  @UseGuards(JwtAuthGuard, RolesGuard) // Hem token'ı (giriş yapmayı) hem de rolü kontrol edecek kalkanları koydum.[cite: 38]
  @Roles('ADMIN') // Yeni kitap eklemeyi sadece yöneticiler ('ADMIN') yapabilsin diye yetkiyi daralttım.[cite: 38]
  @Post()
  create(@Body() dto: CreateBookDto) { // Kitap verilerini DTO üzerinden güvenli şekilde alıp servise ilettim.[cite: 38]
    return this.booksService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Güncelleme işlemi de sadece 'ADMIN' rolüne açık olsun diye kısıtlama ekledim.[cite: 38]
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) { // Güncellenecek kitabın ID'si ile yeni verileri servise aktardım.[cite: 38]
    return this.booksService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Kitap silmeyi sadece yöneticilere yetkilendirdim.[cite: 38]
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { // Silinecek kitabın ID'sini servise yollayıp işlemi tamamladım.[cite: 38]
    return this.booksService.remove(id);
  }
}