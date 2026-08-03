import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; // TypeORM'den veritabanı tablolarını ve sütunlarını oluşturacak dekoratörleri içeri aktardım.[cite: 79]

@Entity('roles') // Veritabanımda 'roles' adında bir tablo oluşmasını sağladım.[cite: 79]
export class Role { // Rolleri tutacak şemamı (entity) dışa aktarılabilir şekilde tanımladım.[cite: 79]
  @PrimaryGeneratedColumn() // Her role otomatik artan birincil bir ID (primary key) atadım.[cite: 79]
  id!: number;

  @Column({ unique: true }) // Rol adının veritabanında eşsiz (unique) olmasını sağladım ki aynı isimde birden fazla rol (örneğin iki tane ADMIN) oluşturulamasın.[cite: 79]
  name!: string;
}