import { Module } from '@nestjs/common'; // NestJS modülü tanımlamak için @Module dekoratörünü getirdim.[cite: 87]
import { ConfigModule, ConfigService } from '@nestjs/config'; // Çevresel değişkenlerimi (.env) projeme entegre edebilmek için ConfigModule ve ConfigService'i içeri aktardım.[cite: 87]
import { TypeOrmModule } from '@nestjs/typeorm'; // PostgreSQL veritabanı bağlantımı kurmak için TypeORM modülünü dâhil ettim.[cite: 87]
import { AppController } from './app.controller'; // Uygulamanın ana denetleyicisini import ettim.[cite: 87]
import { AppService } from './app.service'; // Uygulamanın ana servisini import ettim.[cite: 87]
import { UsersModule } from './users/users.module'; // Yazdığım tüm özel modülleri sırasıyla içeri aktardım (Kullanıcılar).[cite: 87]
import { RolesModule } from './roles/roles.module'; // Roller modülünü dâhil ettim.[cite: 87]
import { AuthorsModule } from './authors/authors.module'; // Yazarlar modülünü dâhil ettim.[cite: 87]
import { CategoriesModule } from './categories/categories.module'; // Kategoriler modülünü dâhil ettim.[cite: 87]
import { PublishersModule } from './publishers/publishers.module'; // Yayınevleri modülünü dâhil ettim.[cite: 87]
import { BooksModule } from './books/books.module'; // Kitaplar modülünü dâhil ettim.[cite: 87]
import { BorrowingsModule } from './borrowings/borrowings.module'; // Ödünç alma modülünü dâhil ettim.[cite: 87]
import { ReservationsModule } from './reservations/reservations.module'; // Rezervasyon modülünü dâhil ettim.[cite: 87]
import { ReviewsModule } from './reviews/reviews.module'; // Yorumlar modülünü dâhil ettim.[cite: 87]
import { AuthModule } from './auth/auth.module'; // Kimlik doğrulama (Auth) modülünü dâhil ettim.[cite: 87]

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ConfigModule'ü 'isGlobal: true' ayarıyla başlattım ki .env dosyamdaki değişkenlere projenin her yerinden tekrar import etmeye gerek kalmadan ulaşabileyim.[cite: 87]

    TypeOrmModule.forRootAsync({ // Veritabanı bağlantısını asenkron olarak başlattım ki çevre değişkenlerim (env) tamamen yüklendikten sonra bağlantı süreci başlasın.[cite: 87]
      inject: [ConfigService], // Veritabanı ayarlarını çekerken ConfigService'e ihtiyacım olduğunu framework'e bildirdim.[cite: 87]
      useFactory: (config: ConfigService) => ({ // ConfigService elime ulaştığında veritabanı ayarlarımı dinamik olarak oluşturdum.[cite: 87]
        type: 'postgres', // Veritabanı sunucusu olarak PostgreSQL kullanacağımı belirttim.[cite: 87]
        host: config.get('DB_HOST'), // Sunucu adresini .env dosyamdan çektim.[cite: 87]
        port: Number(config.get('DB_PORT')), // Port numarasını string (metin) formatından Number'a (sayı) çevirerek aldım.[cite: 87]
        username: config.get('DB_USER'), // Veritabanı kullanıcı adımı bağladım.[cite: 87]
        password: config.get('DB_PASSWORD'), // Veritabanı şifremi bağladım.[cite: 87]
        database: config.get('DB_NAME'), // Bağlanılacak veritabanı adını belirttim.[cite: 87]
        autoLoadEntities: true, // Projedeki entity'lerin (tablo şemalarının) otomatik yüklenmesini sağladım ki modüle her yeni tablo eklediğimde buraya dönüp manuel olarak listeye eklemek zorunda kalmayayım.[cite: 87]
        synchronize: true, // Geliştirme aşamasında olduğum için synchronize: true yaptım ki entity'lerimde yaptığım bir değişiklik anında PostgreSQL tablolarına yansısın (Bunu Production'da kapalı tutmalıyım).[cite: 87]
      }),
    }),

    UsersModule, // Geliştirdiğim tüm iş modüllerini imports dizisine ekleyerek ana uygulamama entegre ettim.[cite: 87]
    RolesModule,
    AuthorsModule,
    CategoriesModule,
    PublishersModule,
    BooksModule,
    BorrowingsModule,
    ReservationsModule,
    ReviewsModule,
    AuthModule,
  ],
  controllers: [AppController], // Ana controller'ımı kök modüle tanıttım.[cite: 87]
  providers: [AppService], // Ana servisimi kök modüle tanıttım.[cite: 87]
})
export class AppModule {} // Uygulamanın beyni olan bu kök modülü dışa aktardım.[cite: 87]