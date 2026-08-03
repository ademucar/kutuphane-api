import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'; // Hata fırlatma ve dependency injection sınıflarını getirdim ki iş mantığını güvenle yazıp gerekli uyarıları dönebileyim.[cite: 55]
import { InjectRepository } from '@nestjs/typeorm'; // Repository'leri constructor'da enjekte edebilmek için bu dekoratörü çağırdım.[cite: 55]
import { Repository } from 'typeorm'; // Veritabanı sorguları atabilmek için Repository tipini ekledim.[cite: 55]
import { Category } from './category.entity'; // Hangi tablo üzerinde çalışacağımı bilmek için Category entity'sini dâhil ettim.[cite: 55]
import { CreateCategoryDto } from './dto/create-category.dto'; // Kategori oluşturma DTO'sunu içeri aktardım.[cite: 55]
import { UpdateCategoryDto } from './dto/update-category.dto'; // Kategori güncelleme DTO'sunu içeri aktardım.[cite: 55]

@Injectable() // Bu sınıfın bir sağlayıcı (provider) olduğunu belirttim ki framework onu otomatik olarak oluşturabilsin.[cite: 55]
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoriesRepo: Repository<Category>, // Kategori tablosu için sorgu atabileceğim repository'i enjekte ettim.[cite: 55]
  ) {}

  findAll() { // Tüm kategorileri getirecek fonksiyonu tanımladım.[cite: 55]
    return this.categoriesRepo.find({ order: { name: 'ASC' } }); // Kategorileri isimlerine göre alfabetik sırayla (ASC) veritabanından çekip döndürdüm.[cite: 55]
  }

  async findOne(id: number) { // Tek bir kategoriyi ID ile bulmak için bu asenkron metodu yazdım.[cite: 55]
    const category = await this.categoriesRepo.findOne({ where: { id } }); // Gönderilen ID'yi veritabanında aradım.[cite: 55]
    if (!category) { // Kategori bulunamazsa hata mekanizmasını çalıştırdım.[cite: 55]
      throw new NotFoundException(`${id} numaralı kategori bulunamadı`); // İstemciye 404 hatası fırlattım ki neyin yanlış olduğunu bilsin.[cite: 55]
    }
    return category; // Eğer varsa kategoriyi geri döndürdüm.[cite: 55]
  }

  async create(dto: CreateCategoryDto) { // Yeni kategori eklemek için metot oluşturdum.[cite: 55]
    const existing = await this.categoriesRepo.findOne({ where: { name: dto.name } }); // Aynı isimde başka bir kategori olup olmadığını kontrol ettim.[cite: 55]
    if (existing) { // Eğer sistemde varsa işlemi durdurdum.[cite: 55]
      throw new ConflictException('Bu kategori zaten mevcut'); // Aynı kategorinin iki kez eklenmesini önlemek için 409 Çakışma (Conflict) hatası verdim.[cite: 55]
    }
    const category = this.categoriesRepo.create(dto); // Gelen veriyi bellekte yeni bir kategori nesnesine çevirdim.[cite: 55]
    return this.categoriesRepo.save(category); // Nesneyi veritabanına kaydettim ve sonucu döndürdüm.[cite: 55]
  }

  async update(id: number, dto: UpdateCategoryDto) { // Kategori bilgilerini güncellemek için metodumu yazdım.[cite: 55]
    const category = await this.findOne(id); // Güncellenmek istenen kategoriyi buldum.[cite: 55]
    Object.assign(category, dto); // DTO'dan gelen yeni değerleri bulduğum kategori nesnesinin üzerine yazdım.[cite: 55]
    return this.categoriesRepo.save(category); // Güncellenmiş nesneyi veritabanına kaydettim.[cite: 55]
  }

  async remove(id: number) { // Kategori silme metodunu tanımladım.[cite: 55]
    const category = await this.findOne(id); // Önce silinmek istenen kategoriyi veritabanından arayıp doğruladım.[cite: 55]
    await this.categoriesRepo.remove(category); // Bulunan kaydı veritabanından tamamen sildim.[cite: 55]
    return { message: 'Kategori silindi' }; // İstemciye işlemin başarılı olduğunu bildiren ufak bir mesaj yolladım.[cite: 55]
  }
}