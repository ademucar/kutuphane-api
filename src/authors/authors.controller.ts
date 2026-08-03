import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'; // NestJS'ten HTTP metotlarını, parametre yakalayıcıları, veri doğrulama (ParseIntPipe) ve koruma kalkanlarını (UseGuards) içeri aktardım ki rotalarımı güvenle oluşturabileyim.[cite: 27]
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Swagger dokümantasyonunu düzenlemek için etiket ve kilit ikonu (Bearer Auth) dekoratörlerini getirdim ki API arayüzüm anlaşılır olsun.[cite: 27]
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Yazdığım JWT koruma kalkanını içeri aktardım ki yetkisiz kişilerin işlem yapmasını engelleyeyim.[cite: 27]
import { Roles } from '../auth/roles.decorator'; // Kendi yazdığım rol atama dekoratörünü getirdim ki hangi rotanın kime ait olduğunu belirtebileyim.[cite: 27]
import { RolesGuard } from '../auth/roles.guard'; // Rol kontrolünü yapacak koruyucuyu getirdim ki yetki aşımını durdurabileyim.[cite: 27]
import { AuthorsService } from './authors.service'; // İş mantığını yürütecek yazar servisini içeri aktardım ki veritabanı işlemlerini oraya devredeyim.[cite: 27]
import { CreateAuthorDto } from './dto/create-author.dto'; // Yazar ekleme verilerinin şablonunu (DTO) getirdim ki gelen istekleri tip güvenli olarak karşılayabileyim.[cite: 27]
import { UpdateAuthorDto } from './dto/update-author.dto'; // Yazar güncelleme verilerinin şablonunu getirdim ki sadece değişecek alanları güvenle alabileyim.[cite: 27]

@ApiTags('authors') // Swagger dokümanında bu controller altındaki rotaları 'authors' başlığında grupladım ki arayüz düzenli ve kategorize edilmiş görünsün.[cite: 27]
@Controller('authors') // Bu sınıfın tüm URL yollarının '/authors' ile başlayacağını belirttim ki standart bir REST API yapım olsun.[cite: 27]
export class AuthorsController { // Controller sınıfımı dışa aktarılabilir şekilde tanımladım ki modül bunu kaydedebilsin.[cite: 27]
  constructor(private authorsService: AuthorsService) {} // AuthorsService'i constructor'da private olarak enjekte ettim ki sınıf içindeki tüm metotlarda bu servise ulaşabileyim.[cite: 27]

  @Get() // GET '/authors' rotasını tanımladım ki tüm yazarları listeleme isteğini burada karşılayabileyim.[cite: 27]
  findAll() { // Tüm yazarları getirecek metodumu yazdım.[cite: 27]
    return this.authorsService.findAll(); // İşlemi doğrudan servisin findAll metoduna devrettim ki dönen sonucu istemciye ulaştırayım.[cite: 27]
  }

  @Get(':id') // GET '/authors/:id' rotasını tanımladım ki spesifik bir yazarı ID'sine göre getirebileyim.[cite: 27]
  findOne(@Param('id', ParseIntPipe) id: number) { // URL'deki 'id' parametresini yakalayıp ParseIntPipe ile otomatik sayıya dönüştürdüm ki buraya metin gönderilirse daha servise inmeden 400 hatası versin.[cite: 27]
    return this.authorsService.findOne(id); // Dönüşen ID'yi servisin findOne metoduna verdim ki o yazarın bilgilerini dönebileyim.[cite: 27]
  }

  @ApiBearerAuth() // Swagger'da bu rotanın şifreli (token gerektiren) olduğunu kilit simgesiyle belirttim ki API'yi kullanacaklar bilsin.[cite: 27]
  @UseGuards(JwtAuthGuard, RolesGuard) // Hem giriş yapmış olmayı (JWT) hem de yetkisi olmayı (RolesGuard) şart koştum ki rotada çifte güvenlik sağlayayım.[cite: 27]
  @Roles('ADMIN') // Sadece 'ADMIN' rolündekilerin bu işlemi yapabileceğini belirttim ki normal kullanıcılar yazar ekleyemesin.[cite: 27]
  @Post() // POST '/authors' rotasını tanımladım ki yeni yazar ekleme isteği buraya gelsin.[cite: 27]
  create(@Body() dto: CreateAuthorDto) { // İsteğin gövdesinden (body) gelen veriyi CreateAuthorDto kalıbına soktum ki doğru veri formatı ile çalışayım.[cite: 27]
    return this.authorsService.create(dto); // Veriyi servise gönderip yeni yazar yaratılmasını sağladım.[cite: 27]
  }

  @ApiBearerAuth() // Swagger'a yine token zorunluluğunu bildirdim.[cite: 27]
  @UseGuards(JwtAuthGuard, RolesGuard) // Güvenlik kalkanlarımı güncelleyen rota için de aktifleştirdim.[cite: 27]
  @Roles('ADMIN') // Sadece 'ADMIN' rolünü zorunlu tuttum.[cite: 27]
  @Patch(':id') // PATCH '/authors/:id' rotasını tanımladım ki bir yazarın belli başlı bilgilerini (kısmi güncelleme) değiştirebileyim.[cite: 27]
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAuthorDto) { // Güncellenecek ID'yi sayıya çevirip, gönderilen yeni verileri UpdateAuthorDto ile yakaladım.[cite: 27]
    return this.authorsService.update(id, dto); // ID ve yeni verileri servise iletip güncellemeyi yaptırdım.[cite: 27]
  }

  @ApiBearerAuth() // Swagger'a token zorunluluğunu ekledim.[cite: 27]
  @UseGuards(JwtAuthGuard, RolesGuard) // Silme işleminde de güvenlik duvarlarını aktif ettim.[cite: 27]
  @Roles('ADMIN') // Silme işlemi çok kritik olduğu için sadece 'ADMIN' izni verdim.[cite: 27]
  @Delete(':id') // DELETE '/authors/:id' rotasını tanımladım ki yazar silebileyim.[cite: 27]
  remove(@Param('id', ParseIntPipe) id: number) { // Silinecek yazarın ID'sini güvenli bir şekilde sayı olarak yakaladım.[cite: 27]
    return this.authorsService.remove(id); // ID'yi servisin remove metoduna vererek silme işlemini tamamladım.[cite: 27]
  }
}