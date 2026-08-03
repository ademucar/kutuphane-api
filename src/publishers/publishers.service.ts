import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'; // Hata fırlatma ve dependency injection sınıflarını getirdim ki iş mantığını güvenle yazıp gerekli HTTP uyarılarını dönebileyim.[cite: 64]
import { InjectRepository } from '@nestjs/typeorm'; // Repository'leri constructor'da enjekte edebilmek için bu dekoratörü çağırdım.[cite: 64]
import { Repository } from 'typeorm'; // Veritabanı sorguları atabilmek için Repository tipini ekledim.[cite: 64]
import { Publisher } from './publisher.entity'; // Hangi tablo üzerinde çalışacağımı bilmek için Publisher entity'sini dâhil ettim.[cite: 64]
import { CreatePublisherDto } from './dto/create-publisher.dto'; // Yayınevi oluşturma DTO'sunu içeri aktardım.[cite: 64]
import { UpdatePublisherDto } from './dto/update-publisher.dto'; // Yayınevi güncelleme DTO'sunu içeri aktardım.[cite: 64]

@Injectable() // Bu sınıfın bir sağlayıcı (provider) olduğunu belirttim ki framework onu otomatik olarak oluşturabilsin.[cite: 64]
export class PublishersService {
  constructor(
    @InjectRepository(Publisher) private publishersRepo: Repository<Publisher>, // Yayınevi tablosu için sorgu atabileceğim repository'i enjekte ettim.[cite: 64]
  ) {}

  findAll() { // Tüm yayınevlerini getirecek fonksiyonu tanımladım.[cite: 64]
    return this.publishersRepo.find({ order: { name: 'ASC' } }); // Yayınevlerini isimlerine göre alfabetik sırayla (ASC) veritabanından çekip döndürdüm.[cite: 64]
  }

  async findOne(id: number) { // Tek bir yayınevini ID ile bulmak için bu asenkron metodu yazdım.[cite: 64]
    const publisher = await this.publishersRepo.findOne({ where: { id } }); // Gönderilen ID'yi veritabanında aradım.[cite: 64]
    if (!publisher) { // Yayınevi bulunamazsa hata mekanizmasını çalıştırdım.[cite: 64]
      throw new NotFoundException(`${id} numaralı yayınevi bulunamadı`); // İstemciye 404 hatası fırlattım ki kaydın olmadığını bilsin.[cite: 64]
    }
    return publisher; // Eğer varsa yayınevini geri döndürdüm.[cite: 64]
  }

  async create(dto: CreatePublisherDto) { // Yeni yayınevi eklemek için metot oluşturdum.[cite: 64]
    const existing = await this.publishersRepo.findOne({ where: { name: dto.name } }); // Aynı isimde başka bir yayınevi olup olmadığını kontrol ettim.[cite: 64]
    if (existing) { // Eğer sistemde varsa işlemi durdurdum.[cite: 64]
      throw new ConflictException('Bu yayınevi zaten mevcut'); // Aynı yayınevinin iki kez eklenmesini önlemek için 409 Çakışma (Conflict) hatası verdim.[cite: 64]
    }
    const publisher = this.publishersRepo.create(dto); // Gelen veriyi bellekte yeni bir yayınevi nesnesine çevirdim.[cite: 64]
    return this.publishersRepo.save(publisher); // Nesneyi veritabanına kaydettim ve sonucu döndürdüm.[cite: 64]
  }

  async update(id: number, dto: UpdatePublisherDto) { // Yayınevi bilgilerini güncellemek için metodumu yazdım.[cite: 64]
    const publisher = await this.findOne(id); // Güncellenmek istenen yayınevini buldum.[cite: 64]
    Object.assign(publisher, dto); // DTO'dan gelen yeni değerleri bulduğum yayınevi nesnesinin üzerine yazdım.[cite: 64]
    return this.publishersRepo.save(publisher); // Güncellenmiş nesneyi veritabanına kaydettim.[cite: 64]
  }

  async remove(id: number) { // Yayınevi silme metodunu tanımladım.[cite: 64]
    const publisher = await this.findOne(id); // Önce silinmek istenen yayınevini veritabanından arayıp doğruladım.[cite: 64]
    await this.publishersRepo.remove(publisher); // Bulunan kaydı veritabanından tamamen sildim.[cite: 64]
    return { message: 'Yayınevi silindi' }; // İstemciye işlemin başarılı olduğunu bildiren ufak bir mesaj yolladım.[cite: 64]
  }
}