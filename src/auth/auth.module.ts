import { Module } from '@nestjs/common'; // NestJS modülü tanımlayabilmek için @Module dekoratörünü içeri aktardım ki bu dosyayı bir modül bağlayıcısı yapabileyim.[cite: 18]
import { ConfigService } from '@nestjs/config'; // .env dosyamdaki çevresel değişkenlere erişmek için ConfigService'i getirdim ki şifreli bilgilerimi (JWT_SECRET) koda direkt yazmak zorunda kalmayayım.[cite: 18]
import { JwtModule } from '@nestjs/jwt'; // JWT token üretimi ve doğrulaması için NestJS'in JwtModule'ünü dahil ettim ki kendi tekerleğimi yeniden icat etmeyeyim.[cite: 18]
import { PassportModule } from '@nestjs/passport'; // Kimlik doğrulama stratejilerini yöneten PassportJS entegrasyonunu getirdim ki güvenliği standartlara uygun sağlayayım.[cite: 18]
import { TypeOrmModule } from '@nestjs/typeorm'; // Veritabanı işlemleri için TypeORM kütüphanesini import ettim ki tablolarıma nesne yönelimli (ORM) erişim sağlayabileyim.[cite: 18]
import { Role } from '../roles/role.entity'; // Role tablosu (entity) tanımını içeri aldım ki bu modül Role veritabanı tablosuyla konuşabilsin.[cite: 18]
import { User } from '../users/user.entity'; // User tablosu tanımını dahil ettim ki kullanıcı kayıt ve giriş işlemlerinde bu tabloya erişebileyim.[cite: 18]
import { AuthController } from './auth.controller'; // Yazdığım AuthController'ı ekledim ki bu modül gelen HTTP isteklerini yönlendirebilsin.[cite: 18]
import { AuthService } from './auth.service'; // Yazdığım AuthService'i ekledim ki modülün iş mantığını barındıran servisi hazır olsun.[cite: 18]
import { JwtStrategy } from './jwt.strategy'; // JWT doğrulama kurallarımı yazdığım stratejiyi içeri aldım ki token okuma işlemini sisteme öğreteyim.[cite: 18]

@Module({ // Bu sınıfın bir modül olduğunu NestJS'e bildirdim ki tüm bu bağımlılıkları tek bir çatı altında gruplayabilsin.[cite: 18]
  imports: [ // Bu modülün çalışması için gereken diğer dış modülleri listeledim ki NestJS onları önceden yüklesin.[cite: 18]
    PassportModule, // Passport'u dahil ettim ki JWT doğrulama stratejim (JwtStrategy) hatasız çalışabilsin.[cite: 18]
    TypeOrmModule.forFeature([User, Role]), // User ve Role entity'lerini bu modüle özel olarak (forFeature) TypeORM'a kaydettim ki AuthService içerisinde Repository<User> diyerek veritabanı işlemlerine başlayabileyim.[cite: 18]
    JwtModule.registerAsync({ // JWT modülünü asenkron olarak kaydettim ki ConfigService yüklenene kadar bekleyip, token imzalama şifremi .env dosyasından güvenle çekebileyim.[cite: 18]
      inject: [ConfigService], // JwtModule oluşturulurken ConfigService'e ihtiyacım olduğunu belirttim ki NestJS onu parametre olarak bana göndersin.[cite: 18]
      useFactory: (config: ConfigService) => ({ // ConfigService elime ulaştığında çalışacak fonksiyonu yazdım ki modülün ayarlarını dinamik olarak oluşturayım.[cite: 18]
        secret: config.get('JWT_SECRET'), // Token'ları imzalayacağım gizli anahtarımı .env dosyasından ('JWT_SECRET') okudum ki güvenliği sağlamış olayım.[cite: 18]
        signOptions: { expiresIn: '1d' }, // Token'ın geçerlilik süresini 1 gün ('1d') olarak belirledim ki kullanıcı her gün yeniden giriş yapmak zorunda kalmadan oturumunu sürdürebilsin.[cite: 18]
      }),
    }),
  ],
  controllers: [AuthController], // AuthController'ı modüle kaydettim ki framework bu rotaları dinlemeye başlasın.[cite: 18]
  providers: [AuthService, JwtStrategy], // AuthService ve JwtStrategy'i "sağlayıcı (provider)" olarak ekledim ki NestJS bunları gerektiğinde (dependency injection) oluşturup dağıtabilsin.[cite: 18]
})
export class AuthModule {} // Modül sınıfını dışa aktardım ki ana AppModule bu Auth modülünü projenin içine import edebilsin.[cite: 18]