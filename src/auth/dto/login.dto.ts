import { IsEmail, IsNotEmpty } from 'class-validator'; // DTO'mda (Data Transfer Object) verileri doğrulamak için 'class-validator' kütüphanesinden e-posta ve boş olmama kontrollerini sağlayan dekoratörleri içeri aktardım ki dışarıdan gelen hatalı veya eksik giriş isteklerini filtreleyebileyim.[cite: 14]

export class LoginDto { // Kullanıcının giriş yaparken göndereceği verilerin şablonunu belirlemek için LoginDto adında bir sınıf oluşturdum ve dışa aktardım ki controller'da bunu tip olarak kullanabileyim.[cite: 14]
  @IsEmail() // Gelen 'email' verisinin gerçekten bir e-posta formatında olup olmadığını kontrol etmesi için bu dekoratörü ekledim ki hatalı formattaki girişleri daha controller'a ulaşmadan reddedebileyim.[cite: 14]
  email!: string; // Kullanıcının e-posta adresini tutacak değişkeni kesin olarak string (metin) tipinde tanımladım ('!' ile de undefined olmayacağını belirttim) ki tip güvenliğini sağlayayım.[cite: 14]

  @IsNotEmpty() // Şifre alanının kesinlikle boş bırakılmamasını şart koştum ki eksik veriyle sunucu tarafında gereksiz işlem yapılmasının önüne geçeyim.[cite: 14]
  password!: string; // Şifre verisini tutacak alanı string olarak tanımladım ki doğrulama işleminden geçtikten sonra bu veriyi güvenle kullanabileyim.[cite: 14]
}