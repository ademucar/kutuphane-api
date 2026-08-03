import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'; // TypeORM'den ilişkisel veritabanı tabloları kurmak için gereken tüm dekoratörleri dahil ettim.[cite: 36]
import { Author } from '../authors/author.entity'; // Kitap ile ilişkilendireceğim yazar tablosunu dahil ettim.[cite: 36]
import { Category } from '../categories/category.entity'; // Kategori tablosunu dahil ettim.[cite: 36]
import { Publisher } from '../publishers/publisher.entity'; // Yayınevi tablosunu dahil ettim.[cite: 36]

@Entity('books') // Veritabanımda 'books' adında bir tablo oluşmasını sağladım.[cite: 36]
export class Book {
  @PrimaryGeneratedColumn()
  id!: number; // Otomatik artan birincil anahtar oluşturdum.[cite: 36]

  @Index() // Kitap başlıklarında çok sık arama yapılacağı için performansı artırmak adına bu sütunu indeksledim.[cite: 36]
  @Column()
  title!: string;

  @Column({ unique: true }) // ISBN numarasının kütüphanede eşsiz (unique) olmasını sağladım ki aynı kitap sisteme iki kez farklıymış gibi girilemesin.[cite: 36]
  isbn!: string;

  @Column({ nullable: true }) // Yayın yılının boş (null) bırakılabilmesine izin verdim.[cite: 36]
  publishedYear!: number;

  @Column({ default: 1 }) // Bir kitap eklendiğinde varsayılan (default) kopya sayısını 1 olarak atadım.[cite: 36]
  totalCopies!: number;

  @Column({ default: 1 }) // Ödünç verilebilir kopya sayısını da varsayılan olarak 1 yaptım ki mantıksal bir bütünlük olsun.[cite: 36]
  availableCopies!: number;

  @ManyToOne(() => Publisher, { nullable: true }) // Bir yayınevinin birden çok kitabı olabileceğini (Çoğa-Bir ilişkisi) belirttim ve bir kitabın yayınevi olmayabileceğine (nullable) izin verdim.[cite: 36]
  publisher!: Publisher;

  @ManyToMany(() => Author) // Bir kitabın birden çok yazarı olabileceği gibi, bir yazarın da birden çok kitabı olabileceğini (Çoğa-Çok ilişkisi) kurdum.[cite: 36]
  @JoinTable({ name: 'book_authors' }) // Bu Çoğa-Çok ilişkiyi tutmak için veritabanında 'book_authors' adında bir ara tablo (junction table) oluşmasını sağladım.[cite: 36]
  authors!: Author[];

  @ManyToMany(() => Category) // Kitap ve kategoriler arasında da Çoğa-Çok ilişkisi tanımladım.[cite: 36]
  @JoinTable({ name: 'book_categories' }) // Kategorileri tutmak için 'book_categories' adında bir ara tablo yarattım.[cite: 36]
  categories!: Category[];
}