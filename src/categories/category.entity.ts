import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; // TypeORM'den veritabanı ve tablo işlemlerini yapacak dekoratörleri getirdim.[cite: 56]

@Entity('categories') // Veritabanımda 'categories' isminde bir tablo oluşmasını sağladım.[cite: 56]
export class Category { // Category şemasını (entity) dışa aktarılabilir şekilde tanımladım.[cite: 56]
  @PrimaryGeneratedColumn() // Tablonun birincil anahtarı (primary key) olacak ve otomatik artacak ID sütununu oluşturdum.[cite: 56]
  id!: number;

  @Column({ unique: true }) // Kategori isminin veritabanında eşsiz (unique) olmasını sağladım ki aynı isimle birden fazla kayıt açılarak karışıklık yaratılmasın.[cite: 56]
  name!: string;
}