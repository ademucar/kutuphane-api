import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; // TypeORM'den veritabanı ve tablo işlemlerini yapacak dekoratörleri getirdim.[cite: 59]

@Entity('publishers') // Veritabanımda 'publishers' isminde bir tablo oluşmasını sağladım.[cite: 59]
export class Publisher { // Publisher şemasını (entity) dışa aktarılabilir şekilde tanımladım.[cite: 59]
  @PrimaryGeneratedColumn() // Tablonun birincil anahtarı (primary key) olacak ve otomatik artacak ID sütununu oluşturdum.[cite: 59]
  id!: number;

  @Column({ unique: true }) // Yayınevi isminin veritabanında eşsiz (unique) olmasını sağladım ki aynı isimle birden fazla yayınevi açılarak karışıklık yaratılmasın.[cite: 59]
  name!: string;
}