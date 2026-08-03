import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'; // TypeORM'den veritabanı tablolarını ve kısıtlamalarını (Unique) oluşturacak araçları getirdim.[cite: 73]
import { Book } from '../books/book.entity'; // Yorumun bağlanacağı Kitap tablosunu dâhil ettim.[cite: 73]
import { User } from '../users/user.entity'; // Yorumu yapan Kullanıcı tablosunu dâhil ettim.[cite: 73]

@Entity('reviews') // Veritabanımda değerlendirmeleri tutacak tablonun adını 'reviews' olarak ayarladım.[cite: 73]
@Unique(['user', 'book']) // Bir kullanıcının aynı kitaba birden fazla yorum/puan girmesini veritabanı seviyesinde de engellemek için kullanıcı ve kitap eşleşmesini eşsiz (unique) kıldım.[cite: 73]
export class Review {
  @PrimaryGeneratedColumn() // Her bir yorum kaydına otomatik artan benzersiz bir ID atadım.[cite: 73]
  id!: number;

  @ManyToOne(() => User) // Bir kullanıcının farklı kitaplara birden çok yorumu olabileceği için Çoktan-Bire (ManyToOne) ilişkisini kurdum.[cite: 73]
  user!: User;

  @ManyToOne(() => Book) // Bir kitabın birden fazla yorumu olabileceği için kitap tablosuyla da Çoktan-Bire ilişkiyi tanımladım.[cite: 73]
  book!: Book;

  @Column({ type: 'smallint' }) // Puan verisi 1 ile 5 arasında küçük bir rakam olacağı için veritabanında yer kaplamaması adına tipini 'smallint' olarak belirledim.[cite: 73]
  rating!: number;

  @Column({ type: 'text', nullable: true }) // Yorum metni uzun olabileceği için 'text' tipini seçtim ve zorunlu olmadığı için boş (nullable) bırakılabilir olarak ayarladım.[cite: 73]
  comment!: string | null;

  @CreateDateColumn() // Yorumun yapıldığı tarihi sistemin otomatik ataması için CreateDateColumn kullandım.[cite: 73]
  createdAt!: Date;
}