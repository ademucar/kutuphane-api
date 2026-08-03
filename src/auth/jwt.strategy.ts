import { Injectable } from '@nestjs/common'; // Sınıfı bir NestJS sağlayıcısı (provider) yapmak için @Injectable dekoratörünü import ettim ki framework bu sınıfı yönetip gerekli yerlere enjekte edebilsin.[cite: 21]
import { ConfigService } from '@nestjs/config'; // .env dosyasından JWT için gerekli gizli anahtarımı (secret key) çekebilmek için ConfigService'i içeri aldım ki şifreyi kodun içine gömmek zorunda kalmayayım.[cite: 21]
import { PassportStrategy } from '@nestjs/passport'; // Bu sınıfın bir PassportJS stratejisi olduğunu belirtebilmek için gerekli yardımcı metodu getirdim ki NestJS ile Passport kütüphanesi köprüsünü kurabileyim.[cite: 21]
import { ExtractJwt, Strategy } from 'passport-jwt'; // Passport-jwt paketinden token çıkarma fonksiyonunu (ExtractJwt) ve JWT stratejisi sınıfını (Strategy) import ettim ki gelen HTTP isteklerindeki token'ları otomatik yakalayıp doğrulayabileyim.[cite: 21]

@Injectable() // Bu strateji sınıfının NestJS Dependency Injection (DI) sistemi tarafından oluşturulup kullanılacağını belirttim ki AuthModule içinde providers listesinde çalışabilsin.[cite: 21]
export class JwtStrategy extends PassportStrategy(Strategy) { // JWT kimlik doğrulaması yapacak sınıfımı, PassportStrategy'den 'jwt' stratejisini miras alarak oluşturdum ki standart Passport iş akışına kendi kurallarımı entegre edeyim.[cite: 21]
  constructor(config: ConfigService) { // Sınıf oluşturulurken ConfigService'in bana parametre olarak gelmesini istedim ki gizli anahtarımı alttaki süper sınıfa (super) iletebileyim.[cite: 21]
    super({ // Miras aldığım PassportStrategy'nin constructor'ına JWT doğrulama ayarlarımı gönderdim ki Passport kütüphanesi token'ı çözerken kurallarımı bilsin.[cite: 21]
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token'ın nerede aranması gerektiğini belirttim: "Gelen HTTP isteğinin Header kısmındaki Authorization alanında, Bearer formatında ara" dedim ki standartlara uygun token aktarımını destekleyeyim.[cite: 21]
      ignoreExpiration: false, // Token süresi dolmuşsa (expire olmuşsa) isteği reddetmesini sağladım (false) ki süresi biten yetkilerin kullanılmaya devam etmesini engelleyeyim.[cite: 21]
      secretOrKey: config.get<string>('JWT_SECRET')!, // Token'ın orijinal ve benim sunucumdan çıkıp çıkmadığını teyit etmek için imza doğrulama anahtarımı (secretOrKey) .env'deki 'JWT_SECRET' değerinden okuyup belirttim ki sahte token'ları yakalayabileyim (ünlem (!) ile de undefined dönmeyeceğini garanti ettim).[cite: 21]
    });
  }

  validate(payload: any) { // Eğer token başarıyla bulunursa, süresi geçmemişse ve gizli anahtarımla doğrulanırsa PassportJS bu "validate" metodunu otomatik olarak tetikler. Parametre olarak da token içindeki çözülmüş bilgiyi (payload) gönderir.[cite: 21]
    return { userId: payload.sub, email: payload.email, roles: payload.roles }; // Çözülen payload içindeki bilgileri yeni bir objeye çevirip geri döndürdüm. PassportJS bu döndürdüğüm objeyi alıp otomatik olarak "Request" (req.user) nesnesinin içine yerleştirecek ki controller'larımda (örneğin auth/me rotasında) doğrudan bu kullanıcı verilerine erişebileyim.[cite: 21]
  }
}