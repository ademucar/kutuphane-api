import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'; // Rotaları, HTTP metotlarını ve koruma kalkanlarını bağlamak için NestJS core paketini kullandım.[cite: 61]
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Swagger dokümantasyonunu düzenlemek için etiket ve kilit ikonu dekoratörlerini getirdim.[cite: 61]
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Sadece giriş yapmış yetkili kullanıcıların işlem yapmasını sağlamak için JWT kalkanını getirdim.[cite: 61]
import { Roles } from '../auth/roles.decorator'; // Rol bazlı yetkilendirme dekoratörümü dahil ettim.[cite: 61]
import { RolesGuard } from '../auth/roles.guard'; // Rol kontrolünü yapacak koruyucuyu getirdim.[cite: 61]
import { PublishersService } from './publishers.service'; // Yayınevi işlemlerini halledecek servisi projeye bağladım.[cite: 61]
import { CreatePublisherDto } from './dto/create-publisher.dto'; // Yayınevi oluşturma DTO'sunu içeri aktardım.[cite: 61]
import { UpdatePublisherDto } from './dto/update-publisher.dto'; // Yayınevi güncelleme DTO'sunu içeri aktardım.[cite: 61]

@ApiTags('publishers') // Swagger dokümanında bu controller'ın rotalarını 'publishers' başlığında grupladım.[cite: 61]
@Controller('publishers') // Tüm uç noktaların '/publishers' ön eki ile başlamasını sağladım.[cite: 61]
export class PublishersController {
  constructor(private publishersService: PublishersService) {} // İş mantığını yürütecek servisi bağımlılık enjeksiyonu ile sınıfıma aldım.[cite: 61]

  @Get() // Herkesin yayınevlerini listeleyebilmesi için bir GET rotası tanımladım.[cite: 61]
  findAll() {
    return this.publishersService.findAll(); // Listeleme işlemini doğrudan servise devrettim.[cite: 61]
  }

  @Get(':id') // Sadece tek bir yayınevini id'ye göre getirecek rotayı yazdım.[cite: 61]
  findOne(@Param('id', ParseIntPipe) id: number) { // Gelen ID'yi sayıya çevirerek güvenli şekilde yakaladım.[cite: 61]
    return this.publishersService.findOne(id); // Bulma işini servise yolladım.[cite: 61]
  }

  @ApiBearerAuth() // Yönetici işlemlerine Swagger üzerinde kilit ikonu ekledim ki şifreli olduğu anlaşılsın.[cite: 61]
  @UseGuards(JwtAuthGuard, RolesGuard) // Rota için JWT ve rol kontrol kalkanlarını aktif ettim.[cite: 61]
  @Roles('ADMIN') // Yayınevi ekleme işlemini sadece 'ADMIN' rolüne sahip olanların yapabileceğini belirttim.[cite: 61]
  @Post() // Yeni yayınevi eklemek için POST rotasını tanımladım.[cite: 61]
  create(@Body() dto: CreatePublisherDto) { // İsteğin gövdesindeki veriyi DTO ile doğrulayarak aldım.[cite: 61]
    return this.publishersService.create(dto); // Veriyi kaydedilmesi için servise ilettim.[cite: 61]
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Güncelleme işleminin sadece yöneticilere özel olmasını sağladım.[cite: 61]
  @Patch(':id') // Yayınevini güncellemek için PATCH rotasını ekledim.[cite: 61]
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePublisherDto) { // ID'yi sayısal olarak ve güncellenecek alanları DTO ile yakaladım.[cite: 61]
    return this.publishersService.update(id, dto); // Güncelleme işlemi için servisi çağırdım.[cite: 61]
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Yayınevi silme işlemini yalnızca yöneticiler yapabilsin diye sınırlandırdım.[cite: 61]
  @Delete(':id') // Silme işlemi için DELETE rotasını tanımladım.[cite: 61]
  remove(@Param('id', ParseIntPipe) id: number) { // Silinecek yayınevinin ID'sini alıp doğruladım.[cite: 61]
    return this.publishersService.remove(id); // Silme işlemini servise devrettim.[cite: 61]
  }
}