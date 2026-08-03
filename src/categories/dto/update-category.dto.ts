import { PartialType } from '@nestjs/swagger'; // PartialType metodunu içeri aktardım ki var olan CreateCategoryDto kurallarını opsiyonel olarak kullanabileyim.[cite: 50]
import { CreateCategoryDto } from './create-category.dto'; // Güncelleme işlemi yaratma işleminin bir türevi olduğu için asıl DTO'yu projeye dahil ettim.[cite: 50]

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {} // Kategori güncellenirken hiçbir alanın zorunlu olmamasını sağlamak için PartialType kullanarak sınıfımı oluşturdum ki sadece değişecek olan veriler gönderilebilsin.[cite: 50]