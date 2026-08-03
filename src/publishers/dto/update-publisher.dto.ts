import { PartialType } from '@nestjs/swagger'; // PartialType metodunu içeri aktardım ki var olan CreatePublisherDto kurallarını opsiyonel olarak kullanabileyim.[cite: 58]
import { CreatePublisherDto } from './create-publisher.dto'; // Güncelleme işlemi yaratma işleminin bir türevi olduğu için temel DTO'yu projeye dahil ettim.[cite: 58]

export class UpdatePublisherDto extends PartialType(CreatePublisherDto) {} // Yayınevi güncellenirken hiçbir alanın zorunlu olmamasını sağlamak için PartialType kullanarak sınıfımı oluşturdum ki sadece değişecek olan veriler esnekçe gönderilebilsin.[cite: 58]