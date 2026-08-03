import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'; // NestJS'ten HTTP metotlarını, parametre dekoratörlerini ve koruma (guard) yapılarını içeri aktardım ki API uç noktalarımı (endpoint) ve güvenlik kurallarımı belirleyebileyim.[cite: 17]
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; // Swagger dokümantasyonu için gerekli dekoratörleri dahil ettim ki API arayüzünde bu controller'ı kategorize edip, şifreli rotalara kilit ikonu ekleyebileyim.[cite: 17]
import { AuthService } from './auth.service'; // İş mantığını (business logic) tutan AuthService'i projeye dahil ettim ki kayıt ve giriş gibi işlemleri oraya devredeleyim.[cite: 17]
import { LoginDto } from './dto/login.dto'; // Giriş için yazdığım DTO'yu getirdim ki gelen isteklerin gövdesini (body) tip güvenli olarak karşılayabileyim.[cite: 17]
import { RegisterDto } from './dto/register.dto'; // Kayıt işlemi için DTO'mu içeri aktardım ki yeni kayıt verilerini validasyon kurallarıma göre alayım.[cite: 17]
import { JwtAuthGuard } from './jwt-auth.guard'; // Sadece giriş yapmış kullanıcıların görebileceği rotalar için JWT güvenlik kalkanımı getirdim ki yetkisiz erişimleri engelleyebileyim.[cite: 17]
import { Roles } from './roles.decorator'; // Kendi yazdığım Roles dekoratörünü dahil ettim ki hangi rotanın hangi rollere özel olduğunu belirtebileyim.[cite: 17]
import { RolesGuard } from './roles.guard'; // Rol kontrolünü yapacak koruyucu kalkanı (guard) getirdim ki sadece izinli rollerin o metoda ulaşmasını sağlayayım.[cite: 17]

@ApiTags('auth') // Swagger arayüzünde bu altındaki tüm rotaları "auth" başlığı altında toplaması için etiketledim ki dokümantasyonum düzenli görünsün.[cite: 17]
@Controller('auth') // Bu sınıfın tüm rotalarının "/auth" prefix'i (ön eki) ile başlayacağını belirttim ki URL yapım "/auth/login" gibi mantıklı olsun.[cite: 17]
export class AuthController { // AuthController sınıfını dışa aktarılabilir şekilde tanımladım ki uygulamaya kaydedilebilsin.[cite: 17]
  constructor(private authService: AuthService) {} // AuthService'i constructor'da private olarak enjekte ettim ki sınıfın her yerinden (this.authService) veritabanı veya token işlemlerine erişebileyim.[cite: 17]

  @Post('register') // "/auth/register" adresine gelecek HTTP POST isteklerini bu metodun karşılayacağını belirttim ki kullanıcı kayıt işlemini başlatabileyim.[cite: 17]
  register(@Body() dto: RegisterDto) { // İsteğin gövdesinden (body) gelen veriyi yakalayıp RegisterDto tipine dönüştürdüm ki class-validator ile veri doğrulaması otomatik olarak gerçekleşsin.[cite: 17]
    return this.authService.register(dto); // Doğrulanmış veriyi AuthService'in register metoduna gönderdim ki veritabanına kayıt işlemi orada yapılsın ve sonucu istemciye (client) dönebileyim.[cite: 17]
  }

  @Post('login') // "/auth/login" rotasına gelecek POST isteklerini karşılamak için bu dekoratörü ekledim ki kullanıcı giriş yapabilsin.[cite: 17]
  login(@Body() dto: LoginDto) { // İstemciden gelen giriş verilerini LoginDto ile yakalayıp doğruladım ki eksik şifre veya hatalı email formatları daha servise inmeden engellensin.[cite: 17]
    return this.authService.login(dto); // E-posta ve şifre verilerini servise ilettim ki şifre eşleşmesi yapılıp sonucunda JWT token üretilsin.[cite: 17]
  }

  @ApiBearerAuth() // Swagger arayüzünde bu rotanın bir "Bearer Token" gerektirdiğini belirten kilit ikonunu çıkardım ki diğer geliştiriciler dokümanı okurken bu rotanın korumalı olduğunu bilsin.[cite: 17]
  @UseGuards(JwtAuthGuard) // Bu metoda JWT kalkanını (guard) ekledim ki sadece geçerli bir token gönderen kullanıcılar bu rotaya erişebilsin, aksi halde 401 hatası alsın.[cite: 17]
  @Get('me') // Korumalı olan "/auth/me" GET rotasını tanımladım ki kullanıcı kendi profil bilgilerini görebilsin.[cite: 17]
  me(@Request() req: any) { // NestJS'in Request objesinden gelen isteği yakaladım ki JwtStrategy tarafından çözülüp Request objesine eklenen kullanıcı (user) verisine erişebileyim.[cite: 17]
    return req.user; // Token içinden çıkarılıp req.user içine yerleştirilmiş olan ID, email ve rol gibi bilgileri direkt geri döndürdüm ki kullanıcı kendi detaylarını alsın.[cite: 17]
  }

  @ApiBearerAuth() // Yine Swagger dokümanı için bu metodun da bir token gerektirdiğini etiketledim ki test ederken yetkilendirme (authorize) yapılabilsin.[cite: 17]
  @UseGuards(JwtAuthGuard, RolesGuard) // Hem kullanıcının giriş yapmış olmasını (JwtAuthGuard) hem de yetkisinin yetip yetmediğini (RolesGuard) sırayla kontrol eden kalkanları ekledim ki güvenlik katmanlarım tam olsun.[cite: 17]
  @Roles('ADMIN') // Sadece 'ADMIN' rolüne sahip olanların bu rotaya girebileceğini metadata olarak kaydettim ki RolesGuard bu bilgiyi okuyup karar verebilsin.[cite: 17]
  @Get('admin-test') // "/auth/admin-test" adında sadece yöneticilerin (admin) görebileceği bir GET rotası oluşturdum ki rol tabanlı yetkilendirme (RBAC) sistemimin çalıştığını test edebileyim.[cite: 17]
  adminOnly() { // Sadece adminlerin çalıştırabileceği metodumu tanımladım ki yetkisiz kişilerin erişimini simüle edeyim.[cite: 17]
    return { message: 'Buraya sadece ADMIN girebilir' }; // Başarılı girişte basit bir JSON objesi döndürdüm ki yetkisi olan kişinin doğru cevabı aldığını göreyim.[cite: 17]
  }
}