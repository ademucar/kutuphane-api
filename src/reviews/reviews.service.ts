import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'; // Farklı hata senaryoları için fırlatacağım özel HTTP kural istisnalarını içeri aktardım.[cite: 78]
import { InjectRepository } from '@nestjs/typeorm'; // Veritabanı tablolarına (repository) erişebilmek için bu dekoratörü getirdim.[cite: 78]
import { IsNull, Not, Repository } from 'typeorm'; // TypeORM'den sorgularım için Repository tipini getirdim.[cite: 78]
import { Book } from '../books/book.entity'; // Kitap kontrolü yapabilmek için Kitap entity'sini dâhil ettim.[cite: 78]
import { Borrowing } from '../borrowings/borrowing.entity'; // Kullanıcının kütüphane geçmişini kontrol edebilmek için Ödünç Alma entity'sini getirdim.[cite: 78]
import { Review } from './review.entity'; // Yorum nesnesi oluşturabilmek için Yorum entity'sini getirdim.[cite: 78]
import { CreateReviewDto } from './dto/create-review.dto'; // Kayıt esnasında gelecek verinin tipini (DTO) içeri aktardım.[cite: 78]

@Injectable() // Servisin dependency injection ile controller'a gönderilebilmesini sağladım.[cite: 78]
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepo: Repository<Review>, // Yorum veritabanı işlemleri için repository'i enjekte ettim.[cite: 78]
    @InjectRepository(Book) private booksRepo: Repository<Book>, // Kitap mevcudiyeti işlemleri için repository'i enjekte ettim.[cite: 78]
    @InjectRepository(Borrowing) private borrowingsRepo: Repository<Borrowing>, // Kullanıcının o kitabı daha önce alıp almadığını sorgulamak için repository'i enjekte ettim.[cite: 78]
  ) {}

  async create(userId: number, dto: CreateReviewDto) { // Yeni bir değerlendirme oluşturma metodunu tanımladım.[cite: 78]
    const book = await this.booksRepo.findOne({ where: { id: dto.bookId } }); // Yorum yapılmak istenen kitabın veritabanında olup olmadığını aradım.[cite: 78]
    if (!book) { // Eğer sistemde böyle bir kitap yoksa işlemi durdurdum.[cite: 78]
      throw new NotFoundException('Kitap bulunamadı'); // İstemciye 404 hatası döndüm.[cite: 78]
    }

    // Sadece kitabı ödünç almış kullanıcı yorum yapabilir
    const hasBorrowed = await this.borrowingsRepo.findOne({ // Sahte veya okumadan yorum yapılmasını önlemek için kullanıcının geçmiş ödünç alma kayıtlarına baktım.[cite: 78]
      where: { user: { id: userId }, book: { id: dto.bookId } },
    });
    if (!hasBorrowed) { // Eğer bu kitabı daha önce kiraladığına dair bir kayıt bulamazsam içeri giren şartı yazdım.[cite: 78]
      throw new BadRequestException('Sadece ödünç aldığınız kitaplara yorum yapabilirsiniz'); // Güvenilir kütüphane verisi oluşturmak adına okumadığı kitaba yorum yapmasını HTTP 400 hatasıyla engelledim.[cite: 78]
    }

    // Aynı kitaba tek yorum
    const existing = await this.reviewsRepo.findOne({ // Kullanıcının bu kitaba daha önceden bir inceleme bırakıp bırakmadığını kontrol ettim.[cite: 78]
      where: { user: { id: userId }, book: { id: dto.bookId } },
    });
    if (existing) { // Eğer daha önceden değerlendirme yapmışsa işlemi kestim.[cite: 78]
      throw new ConflictException('Bu kitaba zaten yorum yaptınız'); // Aynı kitabın puanını manipüle etmesini önlemek için 409 Çakışma hatası fırlattım.[cite: 78]
    }

    const review = this.reviewsRepo.create({ // Yukarıdaki güvenlik kontrollerinden geçerse bellekte yeni bir yorum objesi oluşturdum.[cite: 78]
      user: { id: userId } as any, // İşlemi yapan kullanıcıyı ilişkisel olarak bağladım.[cite: 78]
      book: { id: dto.bookId } as any, // İlgili kitabı ilişkisel olarak bağladım.[cite: 78]
      rating: dto.rating, // Kullanıcının verdiği puanı kayda ekledim.[cite: 78]
      comment: dto.comment ?? null, // Eğer yorum yazmışsa yorumu ekledim, yazmamışsa veritabanına null olarak gönderdim.[cite: 78]
    });
    await this.reviewsRepo.save(review); // Hazırlanan yorum objesini veritabanına kalıcı olarak kaydettim.[cite: 78]
    return { message: 'Yorum eklendi' }; // İşlemin başarılı olduğunu bildiren bir sonuç döndüm.[cite: 78]
  }

  async findByBook(bookId: number) { // Herhangi bir kitabın detay sayfasında o kitaba ait yorumları listelemek için bu metodu yazdım.[cite: 78]
    return this.reviewsRepo.find({ // İlgili ID'ye sahip kitaba atılmış tüm yorumları veritabanında aradım.[cite: 78]
      where: { book: { id: bookId } },
      relations: { user: true }, // Yorumu getiren kişinin ismini veya detaylarını da önyüzde (frontend) gösterebilmek için user bilgisini (ilişkisini) sorguya dâhil ettim.[cite: 78]
      order: { createdAt: 'DESC' }, // En yeni yapılan yorumun en üstte görünmesi için tarihe göre azalan (DESC) şekilde sıralama yaptım.[cite: 78]
    });
  }
}