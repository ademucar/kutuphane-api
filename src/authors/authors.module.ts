import { Module } from '@nestjs/common'; // NestJS modülü tanımlamak için @Module dekoratörünü getirdim ki dosyaları mantıksal olarak paketleyebileyim.[cite: 28]
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM'i modüle entegre etmek için getirdim ki veritabanı tablomu burada tanıtabileyim.[cite: 28]
import { Author } from './author.entity'; // Author tablosunun şemasını (entity) içeri aktardım ki modül bu tabloyu bilsin.[cite: 28]
import { AuthorsController } from './authors.controller'; // Yazdığım controller'ı getirdim ki HTTP istekleri bu modül tarafından dinlensin.[cite: 28]
import { AuthorsService } from './authors.service'; // Yazdığım servisi getirdim ki controller'a sağlayıcı (provider) olarak sunabileyim.[cite: 28]

@Module({ // Bu sınıfı NestJS modülü olarak işaretledim ki bağımlılıkları tek çatı altında toplayabileyim.[cite: 28]
  imports: [TypeOrmModule.forFeature([Author])], // Author entity'sini bu modüle özel olarak TypeORM'a kaydettim ki AuthorsService içinde yazar repository'sine doğrudan erişebileyim.[cite: 28]
  controllers: [AuthorsController], // Controller'ımı modüle ekledim ki framework API rotalarını aktif etsin.[cite: 28]
  providers: [AuthorsService], // Servisimi sağlayıcı olarak ekledim ki dependency injection ile controller'a otomatik gönderilsin.[cite: 28]
})
export class AuthorsModule {} // Diğer modüllerin (özellikle AppModule) projeye dahil edebilmesi için AuthorsModule sınıfını dışa aktardım.[cite: 28]