import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/book.entity';
import { Reservation } from '../reservations/reservation.entity';
import { User } from '../users/user.entity';
import { Borrowing } from './borrowing.entity';
import { BorrowingsController } from './borrowings.controller';
import { BorrowingsService } from './borrowings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Borrowing, Book, User, Reservation])], // BorrowingsService içinde doğrudan sorgu atabilmek için Borrowing, Book, User ve Reservation entity'lerini bu modüle kaydettim.[cite: 46]
  controllers: [BorrowingsController], // API rotalarını dinleyecek controller'ı tanıttım.[cite: 46]
  providers: [BorrowingsService], // İş mantığını çözecek servisi sağlayıcı olarak ekledim.[cite: 46]
})
export class BorrowingsModule {}