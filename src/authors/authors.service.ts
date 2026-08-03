import { Injectable, NotFoundException } from '@nestjs/common'; // Sınıfı sağlayıcı yapmak için @Injectable ve bulunamayan verilerde HTTP 404 dönmek için NotFoundException sınıflarını dahil ettim.[cite: 30]
import { InjectRepository } from '@nestjs/typeorm'; // TypeORM repository'lerini constructor'a çekebilmek için bu dekoratörü içeri aktardım.[cite: 30]
import { Repository } from 'typeorm'; // Editörün veritabanı komutlarını önermesi için Repository tipini getirdim.[cite: 30]
import { Author } from './author.entity'; // Hangi tablo üzerinde işlem yapacağımı belirtmek için Author entity'sini dahil ettim.[cite: 30]
import { CreateAuthorDto } from './dto/create-author.dto'; // Yazar oluştururken gelecek verinin tipini getirdim.[cite: 30]
import { UpdateAuthorDto } from './dto/update-author.dto'; // Yazar güncellerken gelecek verinin tipini getirdim.[cite: 30]

@Injectable() // Bu sınıfın NestJS dependency injection konteyneri tarafından yönetileceğini belirttim ki controller'a otomatik aktarılabilsin.[cite: 30]
export class AuthorsService { // Veritabanı iş mantığını yürütecek AuthorsService sınıfını dışa aktardım.[cite: 30]
  constructor( // Sınıf başlatılırken veritabanına erişmek için kurucu metodu (constructor) yazdım.[cite: 30]
    @InjectRepository(Author) private authorsRepo: Repository<Author>, // TypeORM'un Author tablosu için oluşturduğu repository'yi 'authorsRepo' adıyla enjekte ettim ki sorgular atabileyim.[cite: 30]
  ) {}

  findAll() { // Tüm yazarları getirecek metodumu yazdım.[cite: 30]
    return this.authorsRepo.find({ order: { name: 'ASC' } }); // Veritabanından tüm yazarları bulup isimlerine (name) göre A'dan Z'ye (ASC) alfabetik sıralayarak döndürdüm ki liste düzenli olsun.[cite: 30]
  }

  async findOne(id: number) { // ID ile spesifik bir yazar aramak için asenkron metodumu yazdım.[cite: 30]
    const author = await this.authorsRepo.findOne({ where: { id } }); // Gönderilen ID'yi veritabanında aradım.[cite: 30]
    if (!author) { // Eğer aranan ID'de bir yazar yoksa içeri giren bir kontrol yazdım.[cite: 30]
      throw new NotFoundException(`${id} numaralı yazar bulunamadı`); // İşlemi kesip HTTP 404 (Not Found) hatası fırlattım ki istemci olmayan bir kaydı aradığını bilsin.[cite: 30]
    }
    return author; // Kayıt bulunduysa yazarı olduğu gibi geri döndürdüm.[cite: 30]
  }

  create(dto: CreateAuthorDto) { // Yeni bir yazar ekleme metodunu yazdım.[cite: 30]
    const author = this.authorsRepo.create(dto); // Repository'nin 'create' metoduyla DTO'dan gelen veriyi bellekte bir Author nesnesine çevirdim.[cite: 30]
    return this.authorsRepo.save(author); // Bellekteki nesneyi veritabanına kaydettim (save) ve oluşan yeni yazar bilgisini doğrudan geriye döndüm.[cite: 30]
  }

  async update(id: number, dto: UpdateAuthorDto) { // Bir yazarı güncelleme metodumu hazırladım.[cite: 30]
    const author = await this.findOne(id); // Güncellenecek yazarı yukarıda yazdığım findOne metoduyla buldum.[cite: 30]
    Object.assign(author, dto); // DTO'dan gelen yeni verileri, bulduğum orijinal yazar nesnesinin üzerine kopyaladım ki değerler güncellensin.[cite: 30]
    return this.authorsRepo.save(author); // Güncellenmiş nesneyi tekrar veritabanına kaydedip yeni halini geriye döndüm.[cite: 30]
  }

  async remove(id: number) { // Bir yazarı silme metodumu tanımladım.[cite: 30]
    const author = await this.findOne(id); // Silinmek istenen yazarın var olup olmadığını kontrol edip kaydı çektim.[cite: 30]
    await this.authorsRepo.remove(author); // Bulduğum yazar nesnesini repository üzerinden tamamen sildim.[cite: 30]
    return { message: 'Yazar silindi' }; // Başarılı silme işlemi sonrası istemciye işlem sonucu hakkında ufak bir JSON mesajı döndürdüm.[cite: 30]
  }
}