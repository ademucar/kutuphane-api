import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'; // Kitap eklenirken gelecek verileri doğrulamak için gerekli dekoratörleri içeri aktardım ki hatalı veya eksik veri girişini engelleyebileyim.[cite: 33]

export class CreateBookDto { // Yeni kitap yaratılırken beklediğim veri şablonunu belirlemek için bu DTO sınıfını oluşturdum.[cite: 33]
  @IsString() // Kitap başlığının metin (string) formatında olmasını zorunlu kıldım.[cite: 33]
  @IsNotEmpty({ message: 'Kitap başlığı zorunludur' }) // Başlığın boş bırakılmamasını sağladım ve hata anında dönecek Türkçe mesajı belirledim ki kullanıcı neyi eksik yaptığını anlasın.[cite: 33]
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'ISBN zorunludur' }) // ISBN numarasının da zorunlu ve metin formatında olmasını sağladım ki kitapların benzersiz numaraları eksik kalmasın.[cite: 33]
  isbn!: string;

  @IsOptional() // Yayın yılının zorunlu olmadığını (opsiyonel) belirttim ki eski veya yılı tam bilinmeyen kitaplar da eklenebilsin.[cite: 33]
  @IsInt() // Gönderilirse kesinlikle tam sayı (integer) olmasını şart koştum.[cite: 33]
  publishedYear?: number;

  @IsOptional() // Kitap sayısının zorunlu olmadığını belirttim (eğer gönderilmezse serviste varsayılan olarak 1 atayacağım).[cite: 33]
  @IsInt() // Kopya sayısının tam sayı olmasını sağladım.[cite: 33]
  @Min(1, { message: 'Kopya sayısı en az 1 olmalıdır' }) // Eğer bir değer girilirse bunun en az 1 olmasını zorunlu kıldım ki kütüphaneye 0 veya eksi sayıda kitap eklenemesin.[cite: 33]
  totalCopies?: number;

  @IsOptional() // Yayınevi bilgisinin her kitapta olmayabileceğini düşünerek opsiyonel yaptım.[cite: 33]
  @IsInt() // İlişkisel veritabanı bağlaması (foreign key) yapacağım için yayınevi ID'sinin tam sayı olmasını istedim.[cite: 33]
  publisherId?: number;

  @IsArray() // Bir kitabın birden fazla yazarı olabileceği için bu alanın bir dizi (array) olmasını şart koştum.[cite: 33]
  @IsInt({ each: true }) // Dizinin içindeki her bir elemanın (each: true) bir yazar ID'sini temsil eden tam sayı olmasını sağladım ki ilişkiler doğru kurulsun.[cite: 33]
  authorIds!: number[];

  @IsArray() // Bir kitabın birden fazla kategorisi olabileceği için yine dizi formatını zorunlu tuttum.[cite: 33]
  @IsInt({ each: true }) // Kategori ID'lerinin de birer tam sayı olmasını güvence altına aldım.[cite: 33]
  categoryIds!: number[];
}