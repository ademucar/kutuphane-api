import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'; // İstemciden gelen değerlendirme (review) verilerini doğrulamak için gerekli sayı, metin ve aralık (Min/Max) dekoratörlerini içeri aktardım.[cite: 72]

export class CreateReviewDto { // Yeni bir kitap değerlendirmesi oluşturulurken beklediğim veri formatını tanımladım.[cite: 72]
  @IsInt() // Kitap ID'sinin kesinlikle tam sayı olmasını istedim.[cite: 72]
  @IsNotEmpty({ message: 'Kitap ID zorunludur' }) // Kitap ID'sinin boş bırakılmasını engelledim ve kullanıcıya Türkçe uyarı döndüm.[cite: 72]
  bookId!: number;

  @IsInt() // Verilen puanın tam sayı olması gerektiğini belirttim.[cite: 72]
  @Min(1, { message: 'Puan en az 1 olmalıdır' }) // Puanın alt sınırını 1 olarak belirledim ki 0 veya negatif puan verilemesin.[cite: 72]
  @Max(5, { message: 'Puan en fazla 5 olmalıdır' }) // Puanın üst sınırını 5 olarak kısıtladım ki mantıksız derecelendirmeler (örneğin 10 veya 100) yapılmasın.[cite: 72]
  rating!: number; // Kullanıcının verdiği puanı tutacak değişkenimi tanımladım.[cite: 72]

  @IsOptional() // Kullanıcının yorum yazmasını mecburi tutmadım, sadece puan da verebilmesi için bu alanı opsiyonel yaptım.[cite: 72]
  @IsString() // Eğer yorum gönderilirse bunun mutlaka metin formatında olmasını şart koştum.[cite: 72]
  comment?: string;
}