import { Module } from '@nestjs/common'; // NestJS modülü tanımlamak için @Module dekoratörünü getirdim.[cite: 62]
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM entegrasyonu için modülü içeri aktardım.[cite: 62]
import { Publisher } from './publisher.entity'; // Yayınevi veritabanı şemasını (entity) projeye dâhil ettim.[cite: 62]
import { PublishersController } from './publishers.controller'; // HTTP isteklerini dinleyecek controller'ımı bağladım.[cite: 62]
import { PublishersService } from './publishers.service'; // İş mantığını çözecek servisi içeri aldım.[cite: 62]

@Module({
  imports: [TypeOrmModule.forFeature([Publisher])], // Publisher entity'sini TypeORM'a kaydettim ki servisimden bu veritabanı repository'sine erişebileyim.[cite: 62]
  controllers: [PublishersController], // Modülümün API rotalarını dinleyecek controller'ını tanıttım.[cite: 62]
  providers: [PublishersService], // Servisimi sağlayıcı olarak modüle ekledim ki controller'a otomatik enjekte edilebilsin.[cite: 62]
})
export class PublishersModule {} // Modülü dışa aktardım ki ana modülde (AppModule) kullanabileyim.[cite: 62]