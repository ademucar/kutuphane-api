import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'; // TypeORM'den veritabanı tablomu ve sütunlarımı tanımlamak için gerekli dekoratörleri içeri aktardım ki veritabanı şemamı kod üzerinden oluşturabileyim.[cite: 25]

@Entity('authors') // Bu sınıfın veritabanında 'authors' adında bir tabloya karşılık geldiğini belirttim ki ORM (TypeORM) bu tabloyu benim için yönetsin.[cite: 25]
export class Author { // Author adında dışa aktarılabilir bir sınıf oluşturdum ki diğer dosyalardan yazar verisi tipi olarak kullanabileyim.[cite: 25]
  @PrimaryGeneratedColumn() // 'id' sütununun birincil anahtar (primary key) olduğunu ve otomatik artan (auto-increment) bir sayı olacağını belirttim ki her yazarın eşsiz bir kimliği olsun.[cite: 25]
  id!: number; // Yazarın id bilgisini tutacak zorunlu sayısal alanı tanımladım.[cite: 25]

  @Index() // Yazar isimleri üzerinden çok arama yapılabileceği için bu sütuna indeks (index) ekledim ki veritabanı sorgularım (özellikle arama ve sıralama işlemleri) daha hızlı çalışsın.[cite: 25]
  @Column() // Bu alanın veritabanı tablosunda standart bir sütun olacağını belirttim ki isim verisi tabloya yazılabilsin.[cite: 25]
  name!: string; // Yazarın adını tutacak zorunlu metin alanını tanımladım.[cite: 25]
}