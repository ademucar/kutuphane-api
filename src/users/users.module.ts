import { Module } from '@nestjs/common'; // NestJS modül dekoratörünü getirdim.[cite: 84]
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM entegrasyonunu getirdim.[cite: 84]
import { User } from './user.entity'; // User tablosunun şemasını dâhil ettim.[cite: 84]

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User entity'sini bu modüle özel olarak TypeORM'a kaydettim ki ilgili repository'ye erişilebilsin.[cite: 84]
})
export class UsersModule {} // Diğer modüllerin (özellikle kayıt ve giriş işlemleri için AuthModule'un) veritabanı katmanında kullanıcı tablosunu kullanabilmesi adına UsersModule'ü dışa aktardım.[cite: 84]