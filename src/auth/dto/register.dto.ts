import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'; // Kayıt işlemi sırasında daha detaylı doğrulamalar yapabilmek için e-posta, boşluk kontrolü ve minimum uzunluk dekoratörlerini kütüphaneden projeme dahil ettim ki kurallarımı esnekçe yazabileyim.[cite: 15]

export class RegisterDto { // Yeni kullanıcı kayıt olurken sistemimin beklediği veri yapısını tanımlamak için RegisterDto sınıfını oluşturdum ki sadece bu kalıba tam uyan istekleri kabul edeyim.[cite: 15]
  @IsEmail({}, { message: 'Geçerli bir e-posta giriniz' }) // E-posta formatını kontrol ederken, eğer format yanlışsa kullanıcıya varsayılan İngilizce hata yerine kendi belirlediğim Türkçe 'Geçerli bir e-posta giriniz' mesajını dönmesini sağladım ki daha iyi ve anlaşılır bir kullanıcı deneyimi sunayım.[cite: 15]
  email!: string; // Kayıt olacak kullanıcının e-postasını tutacak alanı string olarak zorunlu kıldım ki veritabanına doğru tiple kayıt atabileyim.[cite: 15]

  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' }) // Güvenlik amacıyla şifrenin en az 6 karakter olmasını şart koştum ve kurala uyulmazsa kullanıcıya ne yapması gerektiğini anlatan Türkçe bir hata mesajı tanımladım ki zayıf şifreler oluşturulmasının önüne geçeyim.[cite: 15]
  password!: string; // Şifreyi string tipinde tutacak alanı belirledim ki hash'leme gibi işlemlere girmeden önce elimde doğru ve güvenli bir veri olsun.[cite: 15]

  @IsNotEmpty({ message: 'Ad soyad zorunludur' }) // Kayıt esnasında kullanıcının isminin eksik olmamasını zorunlu tuttum ve boş bırakıldığında dönecek uyarı mesajını Türkçeleştirdim ki veritabanında eksik veya isimsiz (anonim) profiller oluşmasın.[cite: 15]
  fullName!: string; // Kullanıcının tam adını (ad soyad) tutacak string değişkenimi ekledim ki sistemde bu kullanıcıyı kendi ismiyle karşılayıp profiline kaydedebileyim.[cite: 15]
}