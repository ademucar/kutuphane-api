import { Module } from '@nestjs/common'; // Modül tanımlamak için gerekli dekoratörü getirdim.[cite: 76]
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM entegrasyonu için gerekli modülü dâhil ettim.[cite: 76]
import { Book } from '../books/book.entity'; // Kitabın varlığını kontrol etmek için Kitap tablosunu getirdim.[cite: 76]
import { Borrowing } from '../borrowings/borrowing.entity'; // Kullanıcının o kitabı gerçekten okuyup okumadığını (ödünç alıp almadığını) teyit etmek için Ödünç Alma tablosunu getirdim.[cite: 76]
import { Review } from './review.entity'; // Yorum tablosunu içeri aktardım.[cite: 76]
import { ReviewsController } from './reviews.controller'; // API rotalarını dinleyecek controller'ı ekledim.[cite: 76]
import { ReviewsService } from './reviews.service'; // Yorum iş mantığını çözecek servisi ekledim.[cite: 76]

@Module({
  imports: [TypeOrmModule.forFeature([Review, Book, Borrowing])], // ReviewsService içinde gerekli tüm tablolara sorgu atabilmek için Review, Book ve Borrowing entity'lerini bu modüle kaydettim.[cite: 76]
  controllers: [ReviewsController], // API isteklerini karşılayacak controller'ı tanıttım.[cite: 76]
  providers: [ReviewsService], // İşlemleri yürütecek servisi sağlayıcı olarak ekledim.[cite: 76]
})
export class ReviewsModule {} // Modülü projede kullanılmak üzere dışa aktardım.[cite: 76]