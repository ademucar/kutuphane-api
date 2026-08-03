import { PartialType } from '@nestjs/swagger'; // PartialType metodunu içeri aktardım ki CreateBookDto'daki tüm alanları tekrar yazmak zorunda kalmayayım.[cite: 35]
import { CreateBookDto } from './create-book.dto'; // Güncelleme işlemi kitabın orijinal oluşturulma kurallarını baz alacağı için bunu dahil ettim.[cite: 35]

export class UpdateBookDto extends PartialType(CreateBookDto) {} // Kitap güncellenirken hiçbir verinin zorunlu olmadığını (kullanıcının sadece değiştirmek istediği alanları gönderebileceğini) belirtmek için PartialType ile sardım.[cite: 35]