import { Injectable, OnModuleInit } from '@nestjs/common'; // Servisimi oluşturmak için Injectable ve uygulama ayağa kalkarken çalışacak bir arayüz olan OnModuleInit'i getirdim.[cite: 82]
import { InjectRepository } from '@nestjs/typeorm'; // Repository'yi constructor üzerinden enjekte edebilmek için dâhil ettim.[cite: 82]
import { Repository } from 'typeorm'; // Veritabanı sorguları için TypeORM Repository tipini getirdim.[cite: 82]
import { Role } from './role.entity'; // Hangi tablo üzerinde işlem yapacağımı belirtmek için Role entity'sini getirdim.[cite: 82]

@Injectable() // Servisin NestJS dependency injection sistemi tarafından yönetilmesini sağladım.[cite: 82]
export class RolesService implements OnModuleInit { // Sınıfıma OnModuleInit arayüzünü uyguladım ki (implements) modül yüklendiğinde otomatik olarak bir döngü tetikleyebileyim.[cite: 82]
  constructor(
    @InjectRepository(Role) private rolesRepo: Repository<Role>, // Role veritabanı işlemlerini yapmak için repository'yi enjekte ettim.[cite: 82]
  ) {}

  async onModuleInit() { // Uygulama başlarken otomatik olarak çalışacak hazırlık metodumu yazdım.[cite: 82]
    const roleNames = ['USER', 'ADMIN']; // Sistemimde eksiksiz olarak bulunmasını istediğim varsayılan rolleri bir dizide tanımladım ki her seferinde elle eklemekle uğraşmayayım.[cite: 82]

    for (const name of roleNames) { // Belirlediğim rollerin üzerinde döngü başlattım.[cite: 82]
      const existing = await this.rolesRepo.findOne({ where: { name } }); // Her bir rol veritabanında daha önceden açılmış mı diye kontrol ettim.[cite: 82]
      if (!existing) { // Eğer rol henüz veritabanına eklenmemişse içeri giren bir kontrol yazdım.[cite: 82]
        await this.rolesRepo.save({ name }); // Eksik olan rolü veritabanına otomatik olarak kaydettim.[cite: 82]
        console.log(`Rol oluşturuldu: ${name}`); // Başarıyla eklenen yeni rolü sunucu konsoluna yazdırdım ki sürecin perde arkasında işlediğini göreyim.[cite: 82]
      }
    }
  }
}