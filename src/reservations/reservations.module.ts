import { Module } from '@nestjs/common'; // Modül tanımlamak için gerekli dekoratörü getirdim.[cite: 69]
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM entegrasyonu için gerekli modülü dahil ettim.[cite: 69]
import { Book } from '../books/book.entity'; // Kitap tablosunu işlemlerde kullanabilmek için getirdim.[cite: 69]
import { Reservation } from './reservation.entity'; // Rezervasyon tablosunu (entity) dahil ettim.[cite: 69]
import { ReservationsController } from './reservations.controller'; // API rotalarını dinleyecek controller'ı ekledim.[cite: 69]
import { ReservationsService } from './reservations.service'; // İş mantığını yönetecek servisi dahil ettim.[cite: 69]

@Module({ // Bu dosyanın bir NestJS modülü olduğunu framework'e bildirdim.[cite: 69]
  imports: [TypeOrmModule.forFeature([Reservation, Book])], // Reservation ve Book entity'lerini TypeORM'a kaydettim ki serviste bunların repository'lerine ulaşabileyim.[cite: 69]
  controllers: [ReservationsController], // API isteklerini karşılayacak controller'ı tanıttım.[cite: 69]
  providers: [ReservationsService], // İşlemleri yapacak servisi sağlayıcı olarak ekledim.[cite: 69]
})
export class ReservationsModule {} // Diğer yerlerde kullanılabilmesi için modülü dışa aktardım.[cite: 69]