import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Book } from '../books/book.entity';
import { Reservation } from '../reservations/reservation.entity';
import { User } from '../users/user.entity';
import { Borrowing } from './borrowing.entity';

const MAX_BOOKS = 2; // Bir kullanıcının aynı anda elinde tutabileceği maksimum kitap sayısını kodun tepesinde sabit olarak belirledim ki ileride değiştirmesi kolay olsun.[cite: 48]
const BORROW_DAYS = 5; // Kitabın ödünç verilme süresini (gün) belirledim.[cite: 48]
const PENALTY_PER_LATE_DAY = 3; // İade gecikmelerinde gün başına uygulanacak ceza süresini çarpan olarak atadım.[cite: 48]

@Injectable()
export class BorrowingsService {
  private readonly logger = new Logger(BorrowingsService.name);

  constructor(
    @InjectRepository(Borrowing) private borrowingsRepo: Repository<Borrowing>,
    private dataSource: DataSource, // Karmaşık işlemlerde veritabanı tutarlılığını sağlamak adına Transaction (işlem bütünlüğü) kullanabilmek için DataSource'u enjekte ettim.[cite: 48]
  ) {}

  async borrow(userId: number, bookId: number) { // Ödünç alma metodunu tanımladım.[cite: 48]
    return this.dataSource.transaction(async (manager) => { // İşlemi bir transaction bloğuna aldım ki süreç içinde bir hata olursa tüm değişiklikler (kitap adedinin düşmesi vb.) otomatik geri alınsın (rollback) ve veritabanı bozulmasın.[cite: 48]
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı'); // Kullanıcı yoksa işlemi kestim.[cite: 48]
      }

      if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) { // Eğer kullanıcının daha önceki gecikmelerden kalma ve henüz süresi dolmamış bir cezası (bannedUntil) varsa kontrol ettim.[cite: 48]
        throw new BadRequestException(
          `Cezalısınız. ${user.bannedUntil} tarihine kadar ödünç alamazsınız`,
        ); // Cezalı kullanıcıya uyarı verip kitap almasını engelledim.[cite: 48]
      }

      const activeCount = await manager.count(Borrowing, { // Kullanıcının elinde henüz iade etmediği (returnedAt: IsNull) kaç kitap olduğunu saydım.[cite: 48]
        where: { user: { id: userId }, returnedAt: IsNull() },
      });
      if (activeCount >= MAX_BOOKS) { // Sınıra ulaşmışsa işlemi engelledim.[cite: 48]
        throw new BadRequestException(`En fazla ${MAX_BOOKS} kitap ödünç alabilirsiniz`);
      }

      const alreadyBorrowed = await manager.findOne(Borrowing, { // Belki aynı kitaptan iki tane almak istiyordur diye kontrol ettim.[cite: 48]
        where: { user: { id: userId }, book: { id: bookId }, returnedAt: IsNull() },
      });
      if (alreadyBorrowed) { // Aynı kitabı iade etmeden tekrar almasını mantıken engelledim.[cite: 48]
        throw new BadRequestException('Bu kitabı zaten ödünç aldınız');
      }

      const book = await manager.findOne(Book, { // Kitabın durumunu çektim.[cite: 48]
        where: { id: bookId },
        lock: { mode: 'pessimistic_write' }, // Eşzamanlılık (concurrency) sorunlarını önlemek için kitabı 'pessimistic_write' moduyla kilitledim ki aynı anda iki kişi son kalan kopyayı alamayıp sistemi eksiye düşürmesin.[cite: 48]
      });
      if (!book) {
        throw new NotFoundException('Kitap bulunamadı');
      }

      if (book.availableCopies < 1) { // Kitabın kopyası kalmamışsa engelledim.[cite: 48]
        throw new BadRequestException('Bu kitap şu an mevcut değil');
      }

      book.availableCopies -= 1; // Kitabı vereceğim için sistemdeki erişilebilir kopya sayısını bir azalttım.[cite: 48]
      await manager.save(book); // Kitabın güncel halini transaction içine kaydettim.[cite: 48]

      const now = new Date();
      const dueDate = new Date();
      dueDate.setDate(now.getDate() + BORROW_DAYS); // Şimdiki tarihin üzerine sabit ödünç gün sayısını ekleyerek iade edilmesi gereken tarihi (dueDate) hesapladım.[cite: 48]

      const borrowing = manager.create(Borrowing, { // Yeni bir ödünç alma kaydı oluşturdum.[cite: 48]
        user: { id: userId } as User,
        book: { id: bookId } as Book,
        borrowedAt: now,
        dueDate,
      });
      await manager.save(borrowing); // Kaydı veritabanına yazdım.[cite: 48]

      this.logger.log(`Ödünç alındı: user ${userId} → book ${bookId}`); // Sunucu konsoluna başarılı işlemi logladım.[cite: 48]

      return { // İstemciye kitabın ne zamana kadar iade edilmesi gerektiğini de içeren bir başarı yanıtı döndüm.[cite: 48]
        message: 'Kitap ödünç alındı',
        dueDate,
        remainingCopies: book.availableCopies,
      };
    });
  }

  async returnBook(userId: number, borrowingId: number) { // Kitabı iade etme metodumu yazdım.[cite: 48]
    return this.dataSource.transaction(async (manager) => { // İade işlemlerinde de (kitabı artırma, ceza yazma, rezervasyon tetikleme) bütünlük için transaction başlattım.[cite: 48]
      const borrowing = await manager.findOne(Borrowing, { // İlgili ödünç alma kaydını ilişkileriyle birlikte çektim.[cite: 48]
        where: { id: borrowingId },
        relations: { user: true, book: true },
      });

      if (!borrowing) {
        throw new NotFoundException('Ödünç kaydı bulunamadı');
      }
      if (borrowing.user.id !== userId) { // Başkasının kitabını yanlışlıkla iade etmesini veya manipülasyonu engelledim.[cite: 48]
        throw new BadRequestException('Bu kayıt size ait değil');
      }
      if (borrowing.returnedAt) { // Kitap zaten iade edilmişse çift işlemi engelledim.[cite: 48]
        throw new BadRequestException('Bu kitap zaten iade edilmiş');
      }

      const now = new Date();
      borrowing.returnedAt = now; // İade tarihini o anki zamana sabitledim.[cite: 48]

      const due = new Date(borrowing.dueDate);
      if (now > due) { // Eğer bugünün tarihi, iade tarihini geçmişse ceza mantığını devreye soktum.[cite: 48]
        const msPerDay = 1000 * 60 * 60 * 24;
        const lateDays = Math.ceil((now.getTime() - due.getTime()) / msPerDay); // Milisaniyeleri gün cinsine çevirip yukarı yuvarlayarak gecikme gününü hesapladım.[cite: 48]
        borrowing.lateDays = lateDays; // Gecikme gününü kayda işledim.[cite: 48]

        const banDays = lateDays * PENALTY_PER_LATE_DAY; // Geciken günü çarpanla çarparak yasaklı kalınacak toplam gün sayısını buldum.[cite: 48]
        const bannedUntil = new Date();
        bannedUntil.setDate(now.getDate() + banDays); // Bugünden ileriye doğru yasaklama tarihini hesapladım.[cite: 48]

        const user = await manager.findOne(User, { where: { id: userId } });
        if (user) {
          user.bannedUntil = bannedUntil; // Kullanıcının profiline ceza bitiş tarihini yazarak sistemi güncelledim.[cite: 48]
          await manager.save(user);
        }
      }

      await manager.save(borrowing); // Ödünç kaydını kapatılmış (iade edilmiş) haliyle kaydettim.[cite: 48]

      const book = await manager.findOne(Book, { // İade edilen kitabı buldum.[cite: 48]
        where: { id: borrowing.book.id },
        lock: { mode: 'pessimistic_write' }, // Kopya sayısını artırırken oluşabilecek eşzamanlı okuma/yazma hatalarını engellemek için tekrar kilitledim.[cite: 48]
      });
      if (book) {
        book.availableCopies += 1; // Rafıma kitabın bir kopyasını geri koydum.[cite: 48]
        await manager.save(book);
      }

      const nextReservation = await manager.findOne(Reservation, { // Biri kitabı bekliyor mu diye rezervasyon tablosuna baktım.[cite: 48]
        where: { book: { id: borrowing.book.id }, status: 'ACTIVE' },
        order: { queuePosition: 'ASC' }, // Kuyruktaki ilk kişiyi (en küçük queuePosition) bulmak için artan şekilde sıraladım.[cite: 48]
      });
      if (nextReservation) { // Eğer sırada bekleyen birisi varsa...[cite: 48]
        nextReservation.status = 'READY'; // O kişinin rezervasyon durumunu 'READY' (hazır) yaparak kitabı alabileceğini işaretledim.[cite: 48]
        await manager.save(nextReservation);
        this.logger.log(
          `Rezervasyon hazır: reservation ${nextReservation.id}, book ${borrowing.book.id}`,
        ); // Konsola rezervasyonun tetiklendiği bilgisini logladım.[cite: 48]
      }

      this.logger.log(
        `İade edildi: user ${userId}, borrowing ${borrowingId}, gecikme ${borrowing.lateDays} gün`,
      );

      return { // İstemciye iadenin yapıldığını ve (varsa) aldığı cezayı belirten açık bir JSON mesajı döndüm.[cite: 48]
        message: 'Kitap iade edildi',
        lateDays: borrowing.lateDays,
        penalty: borrowing.lateDays > 0
          ? `${borrowing.lateDays * PENALTY_PER_LATE_DAY} gün ödünç alma yasağı`
          : 'Ceza yok',
      };
    });
  }

  async myBorrowings(userId: number) { // Kullanıcının sadece kendi kitaplarını görebileceği metodu yazdım.[cite: 48]
    return this.borrowingsRepo.find({
      where: { user: { id: userId } },
      relations: { book: true }, // Kitap bilgisini de yanına ekledim ki sadece anlamsız ID'ler dönmesin.[cite: 48]
      order: { borrowedAt: 'DESC' }, // En son aldığı kitap en başta görünsün diye azalan (DESC) sıralama yaptım.[cite: 48]
    });
  }

  async mostBorrowedBooks() { // Kütüphane yönetimi için istatistik çıkaracak metodu hazırladım.[cite: 48]
    return this.borrowingsRepo
      .createQueryBuilder('borrowing') // Daha karmaşık bir SQL sorgusu (GROUP BY) yazabilmek için QueryBuilder'ı kullandım.[cite: 48]
      .leftJoin('borrowing.book', 'book')
      .select('book.id', 'bookId')
      .addSelect('book.title', 'title') // Kitap ID'sini ve ismini seçtim.[cite: 48]
      .addSelect('COUNT(borrowing.id)', 'borrowCount') // O kitabın kaç kere kiralandığını bulmak için satırları saydım (COUNT).[cite: 48]
      .groupBy('book.id') // SQL kuralı gereği ID'ye göre grupladım.[cite: 48]
      .addGroupBy('book.title') // İsim üzerinden de gruplamayı tamamladım.[cite: 48]
      .orderBy('"borrowCount"', 'DESC') // En çok alınan en tepede olsun diye COUNT sonucuna göre azalan sıralama yaptım.[cite: 48]
      .limit(10) // Yalnızca Top 10 listesini getirmesi için sınırlama koydum.[cite: 48]
      .getRawMany(); // Oluşan çiğ (raw) SQL sonucunu doğrudan dizi olarak döndüm.[cite: 48]
  }

  async mostActiveUsers() { // En çok kitap okuyan kullanıcıları bulacak metodu yazdım.[cite: 48]
    return this.borrowingsRepo
      .createQueryBuilder('borrowing')
      .leftJoin('borrowing.user', 'user')
      .select('user.id', 'userId')
      .addSelect('user.fullName', 'fullName')
      .addSelect('COUNT(borrowing.id)', 'borrowCount') // Kullanıcının kaç defa kiralama yaptığını saydım.[cite: 48]
      .groupBy('user.id')
      .addGroupBy('user.fullName')
      .orderBy('"borrowCount"', 'DESC') // Sayıya göre azalan şekilde dizdim.[cite: 48]
      .limit(10) // Top 10 okur listesini aldım.[cite: 48]
      .getRawMany();
  }
}