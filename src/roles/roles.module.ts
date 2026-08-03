import { Module } from '@nestjs/common'; // NestJS modül dekoratörünü getirdim ki dosyaları mantıksal olarak paketleyebileyim.[cite: 80]
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM entegrasyonu için modülü dâhil ettim.[cite: 80]
import { Role } from './role.entity'; // Role tablomun şemasını içeri aktardım.[cite: 80]
import { RolesService } from './roles.service'; // Rol iş mantığını yürütecek servisi projeye dâhil ettim.[cite: 80]

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // Role entity'sini TypeORM'a kaydettim ki serviste bu deponun (repository) sorgularını atabileyim.[cite: 80]
  providers: [RolesService], // Roller üzerinde çalışacak servisi sağlayıcı olarak ekledim.[cite: 80]
})
export class RolesModule {} // Uygulamanın geri kalanında kullanabilmek için modülü dışa aktardım.[cite: 80]