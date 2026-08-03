import { Module } from '@nestjs/common'; // NestJS modülü tanımlamak için @Module dekoratörünü getirdim.[cite: 53]
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM entegrasyonu için modülü içeri aktardım.[cite: 53]
import { Category } from './category.entity'; // Kategori veritabanı şemasını (entity) projeye dâhil ettim.[cite: 53]
import { CategoriesController } from './categories.controller'; // HTTP isteklerini dinleyecek controller'ımı bağladım.[cite: 53]
import { CategoriesService } from './categories.service'; // İş mantığını çözecek servisi içeri aldım.[cite: 53]

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Category entity'sini TypeORM'a kaydettim ki servisimden bu veritabanı repository'sine erişebileyim.[cite: 53]
  controllers: [CategoriesController], // Modülümün API rotalarını dinleyecek controller'ını tanıttım.[cite: 53]
  providers: [CategoriesService], // Servisimi sağlayıcı olarak modüle ekledim ki controller'a otomatik enjekte edilebilsin.[cite: 53]
})
export class CategoriesModule {} // Modülü dışa aktardım ki ana modülde (AppModule) kullanabileyim.[cite: 53]