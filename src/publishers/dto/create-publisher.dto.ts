import { IsNotEmpty, IsString } from 'class-validator'; // Yayınevi oluşturulurken gelen veriyi doğrulamak için metin ve boş olmama kurallarını içeri aktardım ki veritabanına hatalı kayıt gitmesin.[cite: 57]

export class CreatePublisherDto { // Yeni yayınevi oluştururken beklediğim veri şablonunu tanımladım.[cite: 57]
  @IsString() // Yayınevi adının mutlaka metin formatında olmasını şart koştum.[cite: 57]
  @IsNotEmpty({ message: 'Yayınevi adı zorunludur' }) // Yayınevi adının boş geçilmesini engelledim ve kullanıcıya Türkçe bir hata mesajı dönmesini sağladım ki isimsiz kayıtlar oluşmasın.[cite: 57]
  name!: string; // Yayınevi adını tutacak değişkeni belirledim.[cite: 57]
}