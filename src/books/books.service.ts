import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm'; // TypeORM'dan In operatörünü (birden fazla ID ile arama yapmak için) ve Repository tipini getirdim.[cite: 41]
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
import { Publisher } from '../publishers/publisher.entity';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor( // Kitap oluşturulurken yazarların ve kategorilerin id'lerini veritabanında kontrol etmem gerektiği için o tabloların repository'lerini de buraya enjekte ettim.[cite: 41]
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(Author) private authorsRepo: Repository<Author>,
    @InjectRepository(Category) private categoriesRepo: Repository<Category>,
    @InjectRepository(Publisher) private publishersRepo: Repository<Publisher>,
  ) {}

  async findAll(query: QueryBooksDto) { // Dinamik arama, filtreleme ve sayfalama işlemlerini yapacak karmaşık fonksiyonumu yazdım.[cite: 41]
    const { page = 1, limit = 10, search, category, author, publisher, sortBy = 'title' } = query; // Query DTO'dan gelen tüm değerleri kolay kullanmak için destructuring (parçalama) yöntemiyle çıkardım.[cite: 41]

    const qb = this.booksRepo // Karmaşık ilişkisel sorgular atabilmek için TypeORM'un QueryBuilder (Sorgu Oluşturucu) yapısını başlattım.[cite: 41]
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author') // Kitapları çekerken yazarlarını da (eğer varsa) yanına eklemesini söyledim.[cite: 41]
      .leftJoinAndSelect('book.categories', 'category') // Kitaplarla birlikte kategorileri de getirmesini sağladım.[cite: 41]
      .leftJoinAndSelect('book.publisher', 'publisher'); // Yayınevi verisini de sorguya dâhil ettim ki kitap tam donanımlı listelensin.[cite: 41]

    if (search) { // Eğer kullanıcıdan 'search' (arama) parametresi gelmişse SQL sorguma bir LIKE şartı ekledim ki kitabın başlığında (title) harf büyüklüğü önemsenmeden (ILIKE) bu kelime geçiyor mu diye bakabileyim.[cite: 41]
      qb.andWhere('book.title ILIKE :search', { search: `%${search}%` });
    }
    if (category) { // Kategorisine göre filtreleme yapılmışsa kategori adında arama yaptırdım.[cite: 41]
      qb.andWhere('category.name ILIKE :category', { category: `%${category}%` });
    }
    if (author) { // Yazar ismine göre spesifik bir filtre gönderilmişse yazar tablosu üzerinde arama şartı koştum.[cite: 41]
      qb.andWhere('author.name ILIKE :author', { author: `%${author}%` });
    }
    if (publisher) { // Yayınevine göre arama şartını ekledim.[cite: 41]
      qb.andWhere('publisher.name ILIKE :publisher', { publisher: `%${publisher}%` });
    }

    const allowedSort = ['title', 'publishedYear', 'id']; // Kötü niyetli kullanıcıların SQL Injection yapmasını engellemek için sadece izin verdiğim alanlar üzerinden sıralama yapılabileceğini belirttim.[cite: 41]
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'title'; // Eğer gönderilen sortBy parametresi izin listemde varsa onu kullandım, yoksa varsayılan olarak 'title' değerine eşitledim.[cite: 41]
    qb.orderBy(`book.${sortField}`, 'ASC'); // Sorgumu belirlenen bu alana göre artan (ASC) sırada dizmesini emrettim.[cite: 41]

    qb.skip((page - 1) * limit).take(limit); // Sayfalama mantığını (Pagination) kurdum. Örneğin 2. sayfa isteniyorsa ilk 10'u atla (skip) ve sonraki 10'u al (take) şeklinde matematiksel bir hesap yazdım.[cite: 41]

    const [data, total] = await qb.getManyAndCount(); // Oluşturduğum dev sorguyu çalıştırıp hem verileri (data) hem de toplam kayıt sayısını (total) aynı anda çektim.[cite: 41]

    return { // Sadece veriyi değil, kullanıcının sayfalama arayüzü çizebilmesi için toplam sayfa (totalPages) gibi ekstra meta bilgileri de döndürdüm.[cite: 41]
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // Toplam veriyi limit'e bölüp yukarı yuvarlayarak sistemde toplam kaç sayfa olduğunu hesapladım.[cite: 41]
    };
  }

  async findOne(id: number) { // Sadece bir kitabın detayını getirmek için bu fonksiyonu yazdım.[cite: 41]
    const book = await this.booksRepo.findOne({
      where: { id },
      relations: { authors: true, categories: true, publisher: true }, // Kitabın tüm bağlı (relation) tablolarındaki verileriyle birlikte gelmesini sağladım ki eksik bilgi dönmeyeyim.[cite: 41]
    });
    if (!book) { // Kitap yoksa 404 (Not Found) hatası fırlatarak sistemi korudum.[cite: 41]
      throw new NotFoundException(`${id} numaralı kitap bulunamadı`);
    }
    return book;
  }

  async create(dto: CreateBookDto) { // Yeni bir kitap yaratma metodu.[cite: 41]
    const authors = await this.authorsRepo.findBy({ id: In(dto.authorIds) }); // DTO'dan gelen yazar ID'lerini veritabanında tek bir sorguyla (In operatörü) arattım.[cite: 41]
    if (authors.length !== dto.authorIds.length) { // Bulduğum yazarların sayısı bana gönderilen sayıyla eşleşmiyorsa demek ki bazı ID'ler uydurma veya silinmiş; bunu yakalayıp 404 fırlattım.[cite: 41]
      throw new NotFoundException('Bazı yazarlar bulunamadı');
    }

    const categories = await this.categoriesRepo.findBy({ id: In(dto.categoryIds) }); // Aynı işlemi kategoriler için de yaptım ki olmayan bir kategori kitaba eklenemesin.[cite: 41]
    if (categories.length !== dto.categoryIds.length) {
      throw new NotFoundException('Bazı kategoriler bulunamadı');
    }

    let publisher: Publisher | null = null;
    if (dto.publisherId) { // Eğer yayınevi gönderilmişse varlığını kontrol ettim.[cite: 41]
      publisher = await this.publishersRepo.findOne({ where: { id: dto.publisherId } });
      if (!publisher) {
        throw new NotFoundException('Yayınevi bulunamadı');
      }
    }

    const book = this.booksRepo.create({ // Tüm id kontrollerim başarılıysa kitabın kendisini (ilişkileriyle birlikte) bellekte oluşturdum.[cite: 41]
      title: dto.title,
      isbn: dto.isbn,
      publishedYear: dto.publishedYear,
      totalCopies: dto.totalCopies ?? 1, // Eğer kopya sayısı gönderilmediyse varsayılan olarak 1 (?? nullish coalescing) verdim.[cite: 41]
      availableCopies: dto.totalCopies ?? 1, // Kitap ilk kez eklenirken henüz ödünç alınamayacağı için mevcut kopya sayısını direkt toplam kopya sayısına eşitledim.[cite: 41]
      authors, // Doğruladığım yazar nesnelerini atadım.[cite: 41]
      categories, // Doğruladığım kategori nesnelerini atadım.[cite: 41]
      publisher: publisher ?? undefined, // Yayınevi varsa atadım yoksa tanımsız bıraktım.[cite: 41]
    });

    return this.booksRepo.save(book); // Kitabı ilişkileriyle birlikte veritabanına kaydettim.[cite: 41]
  }

  async update(id: number, dto: UpdateBookDto) { // Bir kitabı güncelleme metodu.[cite: 41]
    const book = await this.findOne(id); // Güncellenecek kitabı ilişkileriyle birlikte veritabanından buldum.[cite: 41]

    if (dto.authorIds) { // Eğer yazarlar güncellenmek isteniyorsa, yeni yazar ID'lerini veritabanında sorgulayıp atamasını yaptım.[cite: 41]
      book.authors = await this.authorsRepo.findBy({ id: In(dto.authorIds) });
    }
    if (dto.categoryIds) { // Eğer kategoriler değişecekse veritabanından çekip eşitledim.[cite: 41]
      book.categories = await this.categoriesRepo.findBy({ id: In(dto.categoryIds) });
    }
    if (dto.publisherId) { // Eğer yayınevi değiştiriliyorsa, yeni yayınevinin varlığını doğrulayıp kitaba atadım.[cite: 41]
      const publisher = await this.publishersRepo.findOne({ where: { id: dto.publisherId } });
      if (!publisher) {
        throw new NotFoundException('Yayınevi bulunamadı');
      }
      book.publisher = publisher;
    }
    if (dto.title !== undefined) book.title = dto.title; // Kitabın düz metin bilgileri güncellendiyse (undefined değilse) onları orijinal objenin üzerine yazdım.[cite: 41]
    if (dto.isbn !== undefined) book.isbn = dto.isbn;
    if (dto.publishedYear !== undefined) book.publishedYear = dto.publishedYear;

    return this.booksRepo.save(book); // Kitabın son, güncellenmiş halini veritabanına kaydettim.[cite: 41]
  }

  async remove(id: number) { // Kitabı kütüphaneden silme metodum.[cite: 41]
    const book = await this.findOne(id); // Silinmek istenen kitabın varlığını kontrol ettim.[cite: 41]
    await this.booksRepo.remove(book); // Kitabı veritabanından tamamen uçurdum.[cite: 41]
    return { message: 'Kitap silindi' }; // Başarı durumunda istemciye mesaj yolladım.[cite: 41]
  }
}