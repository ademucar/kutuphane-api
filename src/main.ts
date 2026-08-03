import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'; // Nesneleri serileştiriciyi ve validasyon borusunu dâhil ettim ki gelen-giden verileri filtreleyip gereksiz/hassas bilgileri yönetebileyim.[cite: 89]
import { NestFactory, Reflector } from '@nestjs/core'; // NestJS uygulamasını ayağa kaldırmak için fabrika sınıfını ve metadata okuyucusunu (Reflector) getirdim.[cite: 89]
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // API dokümantasyonu (Swagger) oluşturabilmek için gerekli arayüz inşacılarını dâhil ettim.[cite: 89]
import { AppModule } from './app.module'; // Uygulamanın tüm konfigürasyonunu tutan kök modülü (AppModule) çağırdım.[cite: 89]

async function bootstrap() { // Uygulamayı asenkron olarak çalıştıracak ana başlatma (bootstrap) fonksiyonumu tanımladım.[cite: 89]
  const app = await NestFactory.create(AppModule); // Hazırladığım AppModule'ü kullanarak NestJS uygulama nesnesini yarattım.[cite: 89]
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Uygulamaya global bir ValidationPipe ekledim ve 'whitelist: true' parametresini geçtim ki DTO'larımda tanımlı olmayan ekstra ve bilinmeyen verilerin API'me sızmasını otomatik olarak engelleyeyim.[cite: 89]
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Sınıf serileştiriciyi (ClassSerializerInterceptor) global olarak uygulamaya entegre ettim ki `User` entity'sinde @Exclude() ile işaretlediğim `passwordHash` gibi gizli veriler JSON cevaplarında istemciye sızmasın.[cite: 89]

  const config = new DocumentBuilder() // Swagger dokümantasyonumun temel başlık ve açıklama ayarlarını yapmak için DocumentBuilder'ı başlattım.[cite: 89]
    .setTitle('Kütüphane Yönetim Sistemi API') // Swagger arayüzündeki ana başlığı belirledim.[cite: 89]
    .setDescription('Kitap ödünç alma, rezervasyon ve yorum sistemi') // API'min amacını kısaca açıkladım.[cite: 89]
    .setVersion('1.0') // Uygulama dokümantasyonuna versiyon numarası atadım.[cite: 89]
    .addBearerAuth() // API testleri yapılırken Swagger UI üzerinden JWT Token (Bearer) girilebilmesi için yetkilendirme girişini aktifleştirdim.[cite: 89]
    .build(); // Ayarlarımı tamamlayıp doküman ayar nesnesini derledim.[cite: 89]

  const document = SwaggerModule.createDocument(app, config); // Belirlediğim ayarlarla uygulamadaki controller'ları tarayarak tam bir Swagger dokümanı ürettim.[cite: 89]
  SwaggerModule.setup('api', app, document); // Ürettiğim dokümanı '/api' rotası üzerinden yayınlayarak Swagger arayüzünü (UI) uygulamaya bağladım.[cite: 89]

  await app.listen(3000); // Tüm konfigürasyonlar bittikten sonra uygulamanın 3000 portunu dinlemeye başlamasını söyledim.[cite: 89]
}
bootstrap(); // Yazdığım fonksiyonu çalıştırarak tüm arka plan sürecini tetikledim.[cite: 89]