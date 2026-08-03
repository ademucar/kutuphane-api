import { IsNotEmpty, IsString } from 'class-validator'; // Yazar verilerini doğrularken kullanacağım metin (string) ve boş olmama kuralı dekoratörlerini içeri aktardım ki hatalı istekleri filtreleyebileyim.[cite: 31]

export class CreateAuthorDto { // Yeni yazar eklenirken istemciden (client) beklediğim veri yapısını tanımlamak için CreateAuthorDto sınıfını oluşturdum ve dışa aktardım.[cite: 31]
  @IsString() // Gelecek olan 'name' verisinin kesinlikle metin (string) formatında olmasını şart koştum ki sayı veya obje gibi yanlış tiplerin veritabanına gitmesini engelleyeyim.[cite: 31]
  @IsNotEmpty({ message: 'Yazar adı zorunludur' }) // Yazar adının boş gönderilmesini engelledim ve kurala uyulmazsa kullanıcıya Türkçe bir uyarı dönmesini sağladım ki isimsiz, boş yazar kayıtları oluşmasın.[cite: 31]
  name!: string; // Yazar adını tutacak değişkenimi tanımladım ve '!' işareti ile tanımsız (undefined) kalmayacağını baştan garanti ettim.[cite: 31]
}