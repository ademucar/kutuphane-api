import { IsInt, IsNotEmpty } from 'class-validator'; // İstemciden gelen verileri doğrulamak için tam sayı ve boş olmama kurallarını içeri aktardım ki geçersiz tiplerde veri gelmesini engelleyebileyim.[cite: 65]

export class CreateReservationDto { // Yeni bir rezervasyon oluştururken beklediğim verinin şablonunu belirlemek için bu DTO'yu tanımladım.[cite: 65]
  @IsInt() // Kitap ID'sinin mutlaka bir tam sayı olmasını şart koştum.[cite: 65]
  @IsNotEmpty({ message: 'Kitap ID zorunludur' }) // Kitap ID'sinin boş bırakılmasını engelledim ve istemciye özel Türkçe bir hata mesajı döndüm ki hata anında sorunun ne olduğunu anlasın.[cite: 65]
  bookId!: number; // Rezervasyon yapılacak kitabın ID'sini tutacak değişkenimi tanımladım.[cite: 65]
}