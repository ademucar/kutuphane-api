import { Exclude } from 'class-transformer'; // Hassas verileri API cevaplarından (JSON) gizlemek için class-transformer'dan Exclude dekoratörünü getirdim.[cite: 83]
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'; // Tablo ve veritabanı ilişkileri oluşturmak için TypeORM dekoratörlerini içeri aktardım.[cite: 83]
import { Role } from '../roles/role.entity'; // Kullanıcıya yetki (rol) atayabilmek için Role tablosunu dâhil ettim.[cite: 83]

@Entity('users') // Veritabanında 'users' adında bir tablo oluşmasını sağladım.[cite: 83]
export class User { // User şemasını dışa aktarılabilir şekilde tanımladım.[cite: 83]
  @PrimaryGeneratedColumn() // Her kullanıcı için otomatik artan birincil anahtar (ID) oluşturdum.[cite: 83]
  id!: number;

  @Column({ unique: true }) // E-posta adresinin veritabanında eşsiz (unique) olmasını sağladım ki aynı e-posta ile sisteme birden çok kez üye olunamasın.[cite: 83]
  email!: string;

  @Exclude() // Şifre hash'ini güvenlik amacıyla dış dünyadan gizledim ki bir kullanıcı verisini (user objesini) direkt geri döndüğümde (return ettiğimde) şifresi API'de gözükmesin.[cite: 83]
  @Column() // Şifre verisini tutacak normal bir sütun tanımladım.[cite: 83]
  passwordHash!: string;

  @Column() // Kullanıcının tam adını (ad soyad) tutacak metin sütununu ekledim.[cite: 83]
  fullName!: string;

  @Column({ type: 'date', nullable: true }) // Kullanıcının kütüphaneden ceza aldığı tarihi (yasaklı olduğu süreyi) tutacak alanı ekledim ve cezası yoksa boş kalabilmesine (nullable) izin verdim.[cite: 83]
  bannedUntil!: Date | null;

  @CreateDateColumn() // Kullanıcının sisteme kayıt olduğu tarihi veritabanının otomatik ataması için CreateDateColumn dekoratörünü kullandım.[cite: 83]
  createdAt!: Date;

  @ManyToMany(() => Role, { eager: true }) // Bir kullanıcının birden fazla rolü olabileceği ve bir rolün de birden çok kullanıcısı olabileceği için Çoğa-Çok ilişkisini kurdum; 'eager: true' diyerek her kullanıcı sorgusunda rollerinin de otomatik olarak getirilmesini sağladım ki fazladan SQL sorgusu atıp uğraşmayayım.[cite: 83]
  @JoinTable({ name: 'user_roles' }) // Bu Çoğa-Çok ilişkiyi sağlıklı tutabilmek için veritabanında 'user_roles' isimli bir ara birleştirici tablo (junction table) oluşturmasını emrettim.[cite: 83]
  roles!: Role[];
}