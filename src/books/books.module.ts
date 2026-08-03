import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../authors/author.entity'; // Kitap eklerken yazarların varlığını kontrol etmek için author entity'sini bağladım.[cite: 39]
import { Category } from '../categories/category.entity'; // Kategori doğrulaması için category entity'sini bağladım.[cite: 39]
import { Publisher } from '../publishers/publisher.entity'; // Yayınevi doğrulaması için publisher entity'sini bağladım.[cite: 39]
import { Book } from './book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author, Category, Publisher])], // BooksService içerisinde diğer tablolara (Author, Category, Publisher) sorgu atabilmek için hepsini forFeature ile bu modüle kaydettim.[cite: 39]
  controllers: [BooksController], // Rotalarımı çalışması için modüle ekledim.[cite: 39]
  providers: [BooksService], // Controller'ın kullanması için servisi sağlayıcı olarak tanıttım.[cite: 39]
})
export class BooksModule {}