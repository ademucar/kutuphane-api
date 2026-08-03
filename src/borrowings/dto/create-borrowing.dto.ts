import { IsInt, IsNotEmpty } from 'class-validator'; // İstemciden gelen isteği doğrulamak için tam sayı ve boş olmama kontrollerini içeri aktardım ki geçersiz tiplerde veri gelmesini engelleyebileyim.[cite: 42]

export class CreateBorrowingDto { // Bir kitap ödünç alınırken beklediğim verinin şablonunu oluşturup dışa aktardım.[cite: 42]
  @IsInt() // Gönderilecek kitap ID'sinin kesinlikle tam sayı olmasını şart koştum.[cite: 42]
  @IsNotEmpty({ message: 'Kitap ID zorunludur' }) // Kitap ID'sinin boş geçilmesini engelledim ve hataya özel Türkçe mesaj ekledim ki istemci eksik gönderdiğinde neyin eksik olduğunu net anlasın.[cite: 42]
  bookId!: number;
}