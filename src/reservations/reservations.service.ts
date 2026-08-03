import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'; // Hata durumlarında fırlatacağım istisnaları, loglama ve dependency injection araçlarını içeri aktardım ki güvenli ve izlenebilir bir iş mantığı kurabileyim.[cite: 71]
import { InjectRepository } from '@nestjs/typeorm'; // Veritabanı tablolarına (repository) erişebilmek için bu dekoratörü getirdim.[cite: 71]
import { Repository } from 'typeorm'; // Sorgu atarken tip desteği (intellisense) almak için Repository arayüzünü ekledim.[cite: 71]
import { Book } from '../books/book.entity'; // Kitapların durumunu kontrol edebilmek için Kitap entity'sini dahil ettim.[cite: 71]
import { Reservation } from './reservation.entity'; // Rezervasyon tablosu işlemlerini yapabilmek için kendi entity'sini getirdim.[cite: 71]

@Injectable() // Servisin NestJS tarafından yönetilebilir bir sağlayıcı (provider) olmasını sağladım.[cite: 71]
export class ReservationsService { // İş mantığımı yürüteceğim servisi dışa aktardım.[cite: 71]
  private readonly logger = new Logger(ReservationsService.name); // Sunucu konsolunda bu servise ait logların adıyla görünmesi için özel bir Logger nesnesi tanımladım.[cite: 71]

  constructor(
    @InjectRepository(Reservation) private reservationsRepo: Repository<Reservation>, // Rezervasyon veritabanı işlemlerini yapmak için repository'i enjekte ettim.[cite: 71]
    @InjectRepository(Book) private booksRepo: Repository<Book>, // Kitapların mevcudiyetini kontrol etmek için kitap repository'sini enjekte ettim.[cite: 71]
  ) {}

  async reserve(userId: number, bookId: number) { // Yeni rezervasyon ekleme metodumu tanımladım.[cite: 71]
    const book = await this.booksRepo.findOne({ where: { id: bookId } }); // Kullanıcının rezervasyon yapmak istediği kitabın veritabanında olup olmadığını aradım.[cite: 71]
    if (!book) { // Kitap yoksa işlemi kestim.[cite: 71]
      throw new NotFoundException('Kitap bulunamadı'); // İstemciye 404 hatası döndüm.[cite: 71]
    }

    if (book.availableCopies > 0) { // Kitabın rafta bekleyen kopyası varsa rezervasyon yapılmasını anlamsız bulduğum için bu kontrolü ekledim.[cite: 71]
      throw new BadRequestException('Kitap şu an mevcut, doğrudan ödünç alabilirsiniz'); // Rafta olan bir kitaba rezervasyon yapılamayacağını bildiren HTTP 400 hatası fırlattım.[cite: 71]
    }

    const existing = await this.reservationsRepo.findOne({ // Aynı kullanıcının, aynı kitaba daha önceden açılmış ve hala aktif olan bir rezervasyonu var mı diye kontrol ettim.[cite: 71]
      where: { user: { id: userId }, book: { id: bookId }, status: 'ACTIVE' },
    });
    if (existing) { // Eğer halihazırda sıradaysa tekrar sıraya girmesini engelledim.[cite: 71]
      throw new ConflictException('Bu kitap için zaten rezervasyonunuz var'); // 409 Çakışma hatasıyla işlemi durdurdum.[cite: 71]
    }

    const activeCount = await this.reservationsRepo.count({ // Bu kitap için sırada bekleyen kaç aktif rezervasyon olduğunu saydım.[cite: 71]
      where: { book: { id: bookId }, status: 'ACTIVE' },
    });

    const reservation = this.reservationsRepo.create({ // Yukarıdaki tüm şartlar sağlandıysa yeni bir rezervasyon nesnesini bellekte yarattım.[cite: 71]
      user: { id: userId } as any, // Kullanıcı ID'sini ilişkisel olarak ekledim.[cite: 71]
      book: { id: bookId } as any, // Kitap ID'sini ilişkisel olarak ekledim.[cite: 71]
      queuePosition: activeCount + 1, // Kuyruktaki aktif kişi sayısının 1 fazlasını alarak bu kullanıcıya bir sıra numarası atadım.[cite: 71]
      status: 'ACTIVE', // Rezervasyonu 'Aktif' durumuna getirdim.[cite: 71]
    });
    await this.reservationsRepo.save(reservation); // Yeni rezervasyonu veritabanına kaydettim.[cite: 71]

    this.logger.log(`Rezervasyon: user ${userId} → book ${bookId}, sıra ${reservation.queuePosition}`); // İşlemin başarıyla tamamlandığını sunucu konsoluna logladım.[cite: 71]

    return { // İstemciye rezervasyonun onaylandığını ve kuyrukta kaçıncı sırada olduğunu belirten bir JSON mesajı döndüm.[cite: 71]
      message: 'Rezervasyon oluşturuldu',
      queuePosition: reservation.queuePosition,
    };
  }

  async cancel(userId: number, reservationId: number) { // Rezervasyon iptal etme metodunu yazdım.[cite: 71]
    const reservation = await this.reservationsRepo.findOne({ // İptal edilmek istenen rezervasyonu veritabanından kullanıcı bilgisiyle (relations) birlikte çektim.[cite: 71]
      where: { id: reservationId },
      relations: { user: true },
    });
    if (!reservation) { // Rezervasyon bulunamazsa işlemi kestim.[cite: 71]
      throw new NotFoundException('Rezervasyon bulunamadı'); // 404 hatası fırlattım.[cite: 71]
    }
    if (reservation.user.id !== userId) { // Güvenlik amacıyla, iptal işlemini yapan kişinin rezervasyon sahibi olup olmadığını teyit ettim.[cite: 71]
      throw new BadRequestException('Bu rezervasyon size ait değil'); // Başkasının rezervasyonunu iptal etmeye çalışıyorsa işlemi durdurup hata döndüm.[cite: 71]
    }

    reservation.status = 'CANCELLED'; // Rezervasyonun durumunu silmek yerine 'İPTAL EDİLDİ' olarak güncelledim ki geçmiş veri kaybolmasın.[cite: 71]
    await this.reservationsRepo.save(reservation); // Güncel durumu veritabanına kaydettim.[cite: 71]
    return { message: 'Rezervasyon iptal edildi' }; // İstemciye başarı mesajı döndüm.[cite: 71]
  }

  async myReservations(userId: number) { // Kullanıcının kendi rezervasyonlarını görebileceği metodu tanımladım.[cite: 71]
    return this.reservationsRepo.find({ // Veritabanından o kullanıcıya ait rezervasyonları buldum.[cite: 71]
      where: { user: { id: userId } },
      relations: { book: true }, // Kullanıcıya kitabın detaylarını da dönebilmek için kitap tablosunu (relations) ekledim.[cite: 71]
      order: { createdAt: 'DESC' }, // En son yaptığı rezervasyon en başta çıksın diye tarihe göre azalan (DESC) şekilde sıraladım.[cite: 71]
    });
  }
}