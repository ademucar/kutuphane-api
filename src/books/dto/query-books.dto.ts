import { Type } from 'class-transformer'; // URL üzerinden string olarak gelen sorgu parametrelerini sayıya çevirebilmek için class-transformer kütüphanesini dahil ettim.[cite: 34]
import { IsInt, IsOptional, IsString, Min } from 'class-validator'; // Sayfalama ve filtreleme verilerini doğrulamak için validator'ları getirdim.[cite: 34]

export class QueryBooksDto { // Kullanıcıların kitapları listelerken kullanabileceği arama, filtreleme ve sayfalama parametrelerini belirlemek için bu DTO'yu yazdım.[cite: 34]
  @IsOptional() // Sayfa numarasının gönderilmesi zorunlu değil.[cite: 34]
  @Type(() => Number) // URL'deki '?page=2' değeri aslında string (metin) olduğu için bunu otomatik olarak sayısal (Number) bir değere dönüştürmesini sağladım ki matematiksel işlemler yapabileyim.[cite: 34]
  @IsInt()
  @Min(1) // Sayfa numarasının en az 1 olmasını sağladım ki negatif veya 0. sayfa aranmasın.[cite: 34]
  page?: number = 1; // Değer gönderilmezse varsayılan olarak 1. sayfanın getirilmesini atadım.[cite: 34]

  @IsOptional()
  @Type(() => Number) // Limit parametresini de sayıya çevirdim.[cite: 34]
  @IsInt()
  @Min(1)
  limit?: number = 10; // Bir sayfada varsayılan olarak maksimum 10 kitap gösterilmesini ayarladım.[cite: 34]

  @IsOptional()
  @IsString()
  search?: string; // Kitap başlıklarında metin araması yapabilmek için opsiyonel bir 'search' alanı ekledim.[cite: 34]

  @IsOptional()
  @IsString()
  category?: string; // Sadece belli bir kategori adında arama yapabilmek için kategori filtresi ekledim.[cite: 34]

  @IsOptional()
  @IsString()
  author?: string; // Yazar ismine göre filtreleme yapabilmek için yazar arama alanı tanımladım.[cite: 34]

  @IsOptional()
  @IsString()
  publisher?: string; // Yayınevine göre filtre yapabilmek için bu alanı ekledim.[cite: 34]

  @IsOptional()
  @IsString()
  sortBy?: string = 'title'; // Sonuçların neye göre sıralanacağını (varsayılan olarak 'title' yani isme göre) belirlemek için opsiyonel bir sıralama alanı koydum.[cite: 34]
}