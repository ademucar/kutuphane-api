import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'; // TypeORM'den veritabanı tablolarını ve ilişkileri kurmak için gerekli dekoratörleri getirdim.[cite: 66]
import { Book } from '../books/book.entity'; // İlişki kuracağım Kitap tablosunu içeri aktardım.[cite: 66]
import { User } from '../users/user.entity'; // İlişki kuracağım Kullanıcı tablosunu içeri aktardım.[cite: 66]

@Entity('reservations') // Veritabanımda bu entity'i temsil edecek tablonun adını 'reservations' olarak ayarladım.[cite: 66]
@Unique(['user', 'book']) // Bir kullanıcının aynı kitaba birden fazla aktif rezervasyon yapmasını engellemek için kullanıcı ve kitap kombinasyonunu eşsiz (unique) kıldım.[cite: 66]
export class Reservation { // Rezervasyon şemasını dışa aktarılabilir şekilde tanımladım.[cite: 66]
  @PrimaryGeneratedColumn() // Her rezervasyon kaydına otomatik artan benzersiz bir ID verdim.[cite: 66]
  id!: number;

  @ManyToOne(() => User) // Bir kullanıcının birden fazla rezervasyonu olabileceği için Çoktan-Bire (ManyToOne) ilişkisi kurdum.[cite: 66]
  user!: User;

  @ManyToOne(() => Book) // Bir kitabın birden fazla rezervasyonu (bekleyen kişiler) olabileceği için kitap tablosuyla da Çoktan-Bire ilişki kurdum.[cite: 66]
  book!: Book;

  @Column({ default: 'ACTIVE' }) // Rezervasyonun durumunu takip etmek için bir sütun ekledim ve oluşturulduğunda varsayılan olarak 'ACTIVE' (aktif) olmasını sağladım.[cite: 66]
  status!: string;

  @Column() // Rezervasyon yapan kullanıcının kuyrukta kaçıncı sırada olduğunu tutmak için bu sayısal alanı ekledim.[cite: 66]
  queuePosition!: number;

  @CreateDateColumn() // Rezervasyonun yapıldığı tarihi veritabanının otomatik olarak ataması için CreateDateColumn dekoratörünü kullandım.[cite: 66]
  createdAt!: Date;
}