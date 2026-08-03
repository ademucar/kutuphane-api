import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'; // Rotaları, HTTP metotlarını ve koruma kalkanlarını bağlamak için NestJS core paketini kullandım.[cite: 52]
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Swagger dokümantasyonunu düzenlemek için etiket ve kilit ikonu dekoratörlerini getirdim.[cite: 52]
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Sadece yetkili kullanıcıların işlem yapmasını sağlamak için JWT kalkanını getirdim.[cite: 52]
import { Roles } from '../auth/roles.decorator'; // Rol bazlı yetkilendirme dekoratörümü dahil ettim.[cite: 52]
import { RolesGuard } from '../auth/roles.guard'; // Rol kontrolünü yapacak koruyucuyu getirdim.[cite: 52]
import { CategoriesService } from './categories.service'; // Kategori işlemlerini halledecek servisi projeye bağladım.[cite: 52]
import { CreateCategoryDto } from './dto/create-category.dto'; // Kategori oluşturma DTO'sunu içeri aktardım.[cite: 52]
import { UpdateCategoryDto } from './dto/update-category.dto'; // Kategori güncelleme DTO'sunu içeri aktardım.[cite: 52]

@ApiTags('categories') // Swagger dokümanında bu controller'ın rotalarını 'categories' başlığında grupladım.[cite: 52]
@Controller('categories') // Tüm uç noktaların '/categories' ön eki ile başlamasını sağladım.[cite: 52]
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {} // İş mantığını yürütecek servisi bağımlılık enjeksiyonu ile sınıfıma aldım.[cite: 52]

  @Get() // Herkesin kategorileri listeleyebilmesi için bir GET rotası tanımladım.[cite: 52]
  findAll() {
    return this.categoriesService.findAll(); // Listeleme işlemini servise devrettim.[cite: 52]
  }

  @Get(':id') // Sadece tek bir kategoriyi id'ye göre getirecek rotayı yazdım.[cite: 52]
  findOne(@Param('id', ParseIntPipe) id: number) { // Gelen ID'yi sayıya çevirerek güvenli şekilde yakaladım.[cite: 52]
    return this.categoriesService.findOne(id); // Kategori bulma işini servise yolladım.[cite: 52]
  }

  @ApiBearerAuth() // Yönetici işlemlerine Swagger üzerinde kilit ikonu ekledim ki şifreli olduğu anlaşılsın.[cite: 52]
  @UseGuards(JwtAuthGuard, RolesGuard) // Rota için JWT ve rol kontrol kalkanlarını aktif ettim.[cite: 52]
  @Roles('ADMIN') // Kategori ekleme işlemini sadece 'ADMIN' rolüne sahip olanların yapabileceğini belirttim.[cite: 52]
  @Post() // Yeni kategori eklemek için POST rotasını tanımladım.[cite: 52]
  create(@Body() dto: CreateCategoryDto) { // İsteğin gövdesindeki veriyi DTO ile doğrulayarak aldım.[cite: 52]
    return this.categoriesService.create(dto); // Veriyi kaydedilmesi için servise ilettim.[cite: 52]
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Güncelleme işleminin sadece yöneticilere özel olmasını sağladım.[cite: 52]
  @Patch(':id') // Kategoriyi güncellemek için PATCH rotasını ekledim.[cite: 52]
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { // ID'yi sayısal olarak ve güncellenecek alanları DTO ile yakaladım.[cite: 52]
    return this.categoriesService.update(id, dto); // Güncelleme işlemi için servisi çağırdım.[cite: 52]
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Kategori silme işlemini yalnızca yöneticiler yapabilsin diye sınırlandırdım.[cite: 52]
  @Delete(':id') // Silme işlemi için DELETE rotasını tanımladım.[cite: 52]
  remove(@Param('id', ParseIntPipe) id: number) { // Silinecek kategorinin ID'sini alıp doğruladım.[cite: 52]
    return this.categoriesService.remove(id); // Silme işlemini servise devrettim.[cite: 52]
  }
}