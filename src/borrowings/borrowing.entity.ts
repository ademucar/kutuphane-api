import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'; // TypeORM'den ilişkisel tablolar kurmak ve sütunlar oluşturmak için gereken dekoratörleri getirdim.[cite: 43]
import { Book } from '../books/book.entity'; // İlişki kuracağım Kitap tablosunu içeri aktardım.[cite: 43]
import { User } from '../users/user.entity'; // İlişki kuracağım Kullanıcı tablosunu içeri aktardım.[cite: 43]

@Entity('borrowings') // Veritabanında bu sınıfı temsil edecek tablonun adını 'borrowings' olarak ayarladım ki işlemlerimi bu tablo üzerinden yürütebileyim.[cite: 43]
export class Borrowing {
  @PrimaryGeneratedColumn() // Her bir ödünç alma kaydı için benzersiz ve otomatik artan bir ID sütunu tanımladım.[cite: 43]
  id!: number;

  @ManyToOne(() => User) // Bir kullanıcının birden fazla ödünç alma işlemi olabileceği için Çoktan-Bire (ManyToOne) ilişkisi kurdum ki bu kaydın kime ait olduğunu tutabileyim.[cite: 43]
  user!: User;

  @ManyToOne(() => Book) // Aynı kitabın (farklı kopyalarının veya farklı zamanlarda) birden çok ödünç alma kaydı olabileceği için kitap tablosuyla da Çoktan-Bire ilişki kurdum.[cite: 43]
  book!: Book;

  @Column({ type: 'date' }) // Kitabın ödünç alındığı tarihi veritabanında 'date' (sadece tarih) tipinde tutmak için bu sütunu ekledim.[cite: 43]
  borrowedAt!: Date;

  @Column({ type: 'date' }) // Kitabın son iade tarihini belirlemek için bu sütunu tanımladım.[cite: 43]
  dueDate!: Date;

  @Column({ type: 'date', nullable: true }) // Kitap henüz iade edilmemiş olabileceği için iade tarihi alanını boş bırakılabilir (nullable) olarak ayarladım.[cite: 43]
  returnedAt!: Date | null;

  @Column({ default: 0 }) // Kitabın kaç gün geciktiğini tutmak için bir sayı alanı açtım ve varsayılan değerini 0 olarak belirledim ki ilk kayıtta gecikme olmasın.[cite: 43]
  lateDays!: number;
}