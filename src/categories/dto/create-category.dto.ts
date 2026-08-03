import { IsNotEmpty, IsString } from 'class-validator'; // Kategori oluşturulurken gelen veriyi doğrulamak için metin ve boş olmama kurallarını içeri aktardım ki sistemime hatalı veri girmesin.[cite: 49]

export class CreateCategoryDto { // Yeni kategori oluştururken beklediğim veri şablonunu tanımladım.[cite: 49]
  @IsString() // Kategori adının mutlaka metin formatında olmasını şart koştum.[cite: 49]
  @IsNotEmpty({ message: 'Kategori adı zorunludur' }) // Kategori adının boş geçilmesini engelledim ve kullanıcıya Türkçe bir hata mesajı dönmesini sağladım ki boş kayıtlar oluşmasın.[cite: 49]
  name!: string; // Kategori adını tutacak değişkeni belirledim.[cite: 49]
}