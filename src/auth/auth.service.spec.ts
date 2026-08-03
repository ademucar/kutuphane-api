import { UnauthorizedException } from '@nestjs/common'; // Testlerde, başarısız girişlerde dönmesi gereken "Yetkisiz" (HTTP 401) hata sınıfını getirdim ki doğru hatanın fırlatıldığını test edebileyim.[cite: 19]
import { JwtService } from '@nestjs/jwt'; // JwtService'i içeri aktardım ki token üretme servisini test ortamında sahtesiyle (mock) değiştirebileyim.[cite: 19]
import { Test } from '@nestjs/testing'; // Test ortamını hazırlamak için gereken Test sınıfını NestJS kütüphanesinden çektim ki izole bir modül oluşturabileyim.[cite: 19]
import { getRepositoryToken } from '@nestjs/typeorm'; // TypeORM repository'lerinin eşsiz injection anahtarlarını bulabilmek için bu metodu getirdim ki testlerde veritabanı yerine geçecek sahte (mock) objeleri bağlayabileyim.[cite: 19]
import * as bcrypt from 'bcrypt'; // Şifre hash'leme işlemlerini yapan kütüphaneyi içeri aldım ki testlerde doğrulama yapmak için sahte hash'lenmiş şifreler üretebileyim.[cite: 19]
import { Role } from '../roles/role.entity'; // Rol tablosu yapısını getirdim ki mock repository oluştururken token'ını (getRepositoryToken) bulabileyim.[cite: 19]
import { User } from '../users/user.entity'; // Kullanıcı tablosu yapısını getirdim ki testlerdeki veritabanı simülasyonum doğru adrese bağlansın.[cite: 19]
import { AuthService } from './auth.service'; // Test edeceğim ana hedef olan AuthService'i projeye dahil ettim ki senaryoları onun üzerinde yürüteyim.[cite: 19]

describe('AuthService', () => { // AuthService testlerimi kapsayacak ana bloğu açtım ki konsol çıktısında bu testleri gruplanmış halde göreyim.[cite: 19]
  let service: AuthService; // Test edeceğim servisi tutacak değişkeni oluşturdum ki 'it' bloklarında sürekli servise erişebileyim.[cite: 19]

  const mockUsersRepo = { // Gerçek veritabanına bağlanmamak için TypeORM User Repository'sinin yerine geçecek sahte bir obje tanımladım ki testlerim çok hızlı ve veritabanından bağımsız çalışsın.[cite: 19]
    findOne: jest.fn(), // Veritabanından kullanıcı arama işlemini taklit edecek boş bir Jest fonksiyonu (mock) atadım ki test senaryosuna göre bu fonksiyonun ne döneceğini dinamik değiştirebileyim.[cite: 19]
    create: jest.fn(), // Yeni kullanıcı oluşturma adımını taklit edecek mock metot ekledim ki kayıt işlemi testlerinde gerçek tablo etkilenmesin.[cite: 19]
    save: jest.fn(), // Kullanıcıyı kaydetme adımını taklit eden mock metot koydum ki kayıt senaryolarını veritabanına veri yazmadan tamamlayabileyim.[cite: 19]
  };
  const mockRolesRepo = { // Rol tablosu (Repository<Role>) yerine geçecek sahte objemi tanımladım ki roller veritabanına gitmeden bellekte çözülsün.[cite: 19]
    findOne: jest.fn(), // Rol arama metodunu mock'ladım ki test anında istediğim rolü bulmuş gibi yapabileyim.[cite: 19]
    save: jest.fn(), // Yeni rol kaydetme metodunu mock'ladım ki varsayılan rol atama işlemlerini simüle edebileyim.[cite: 19]
  };
  const mockJwtService = { // JWT token üreten gerçek servisin yerine geçecek sahte bir JWT servisi tanımladım ki test sırasında gerçekten şifreleme yapmakla vakit kaybetmeyeyim.[cite: 19]
    signAsync: jest.fn().mockResolvedValue('sahte-token'), // Token imzalama metodunu mock'layıp her çağrıldığında asenkron (Promise) olarak "sahte-token" dönmesini sağladım ki login testlerinde her zaman bu sabit değeri bekleyebileyim.[cite: 19]
  };

  beforeEach(async () => { // Her "it" testinden önce çalışacak hazırlık fonksiyonumu belirledim ki testler birbirinin verisinden etkilenmesin.[cite: 19]
    jest.clearAllMocks(); // Önceki testten kalan tüm mock çağrı sayılarını ve döndürdükleri değerleri sıfırladım ki her test temiz bir sayfa ile başlasın.[cite: 19]
    const module = await Test.createTestingModule({ // Sahte bir NestJS modülü yarattım ki dependency injection sistemi çalışsın ve AuthService'i oluşturabilsin.[cite: 19]
      providers: [ // Test modülümün içine çalışması için gereken sağlayıcıları (provider) ekledim ki bağımlılıklar çözülsün.[cite: 19]
        AuthService, // Test edeceğim ana servisi (AuthService) listeye ekledim ki sistem onu bana yaratsın.[cite: 19]
        { provide: getRepositoryToken(User), useValue: mockUsersRepo }, // Uygulama Repository<User> istediğinde, benim yukarıda yazdığım sahte veritabanı objesini (mockUsersRepo) kullanmasını emrettim ki gerçek veritabanı izolasyonu sağlansın.[cite: 19]
        { provide: getRepositoryToken(Role), useValue: mockRolesRepo }, // Uygulama Repository<Role> istediğinde de sahte rol objemi bağladım ki rol aramaları gerçek veritabanına düşmesin.[cite: 19]
        { provide: JwtService, useValue: mockJwtService }, // JwtService yerine kendi hazırladığım mockJwtService'i enjekte ettim ki token işlemleri anında "sahte-token" dönsün.[cite: 19]
      ],
    }).compile(); // Modülü derleyip hazır hale getirdim ki bağımlılık ağacı (DI container) kurulsun.[cite: 19]

    service = module.get<AuthService>(AuthService); // Derlenen test modülünden AuthService'in çalışan ve mock'larla donatılmış halini alıp değişkene atadım ki testleri bu servis üzerinden koşturayım.[cite: 19]
  });

  it('tanımlı olmalı', () => { // Servisin başarıyla oluşturulup oluşturulmadığını kontrol edeceğim temel bir test yazdım ki konfigürasyon hatası yapmadığımı bileyim.[cite: 19]
    expect(service).toBeDefined(); // Servis değişkenimin "undefined" olmamasını bekledim ki NestJS'in servisi sorunsuz bir şekilde instantiate (örnekleme) ettiğini doğrulayayım.[cite: 19]
  });

  it('kullanıcı yoksa login UnauthorizedException fırlatmalı', async () => { // Veritabanında (sahte veritabanımda) bulunmayan bir e-posta ile giriş yapılmaya çalışıldığında ne olacağını test ettim ki yetkisiz girişlerin reddedildiğinden emin olayım.[cite: 19]
    mockUsersRepo.findOne.mockResolvedValue(null); // Sahte veritabanımın "findOne" metoduna komut verdim: "Biri seni çağırırsa sonuç olarak 'null' (kullanıcı yok) dön" dedim ki olmayan kullanıcı senaryosunu simüle edeyim.[cite: 19]

    await expect( // Test kodunu asenkron olarak bekletip (await expect) servisten dönecek sonucu incelemeye aldım ki fırlatılan hatayı yakalayabileyim.[cite: 19]
      service.login({ email: 'yok@test.com', password: '123456' }), // Olmayan e-posta ile login işlemini tetikledim ki yazdığım "kullanıcı yoksa hata ver" mantığı devreye girsin.[cite: 19]
    ).rejects.toThrow(UnauthorizedException); // Bu işlemin bir noktada reddedilmesini (rejects) ve hata olarak UnauthorizedException (Yetkisiz erişim) fırlatmasını beklediğimi belirttim ki güvenlik kuralımın çalıştığını ispatlayayım.[cite: 19]
  });

  it('şifre yanlışsa login UnauthorizedException fırlatmalı', async () => { // E-posta veritabanında var olsa bile şifre yanlış girilirse yine yetkisiz hatası dönmesi gerektiğini test ettim ki brute-force (deneme-yanılma) saldırılarının engellendiğini göreyim.[cite: 19]
    const hash = await bcrypt.hash('dogruSifre', 10); // Veritabanından dönecek kullanıcı için gerçek bir hash üretip "dogruSifre"yi şifreledim ki bcrypt'in "compare" metodunu test sırasında kandırabileyim.[cite: 19]
    mockUsersRepo.findOne.mockResolvedValue({ // Sahte veritabanıma komut verdim: "Biri arama yaparsa bu sahte kullanıcı objesini döndür" dedim ki kullanıcı varmış gibi davransın.[cite: 19]
      id: 1, // Sahte bir ID atadım.[cite: 19]
      email: 'adem@test.com', // Senaryomdaki e-postayı atadım.[cite: 19]
      passwordHash: hash, // Yukarıda şifrelediğim "dogruSifre" hash'ini atadım ki sistem şifre kontrolünü bununla yapsın.[cite: 19]
      roles: [{ name: 'USER' }], // Kullanıcının rolünü de atadım ki hata çıkmasın.[cite: 19]
    });

    await expect( // Yine asenkron bekleyişle sonucu incelemeye aldım ki fırlatılan hatayı yakalayabileyim.[cite: 19]
      service.login({ email: 'adem@test.com', password: 'yanlisSifre' }), // Bu defa doğru e-posta ama kasıtlı olarak "yanlisSifre" gönderdim ki bcrypt kontrolünden geçemesin.[cite: 19]
    ).rejects.toThrow(UnauthorizedException); // İşlemin reddedilmesini ve UnauthorizedException fırlatmasını bekledim ki şifresi yanlış olanın içeri alınmadığını test ile kanıtlayayım.[cite: 19]
  });

  it('şifre doğruysa token dönmeli', async () => { // Tüm bilgiler doğruysa sistemin sorunsuzca JWT token üretip geri döndürdüğünü kanıtlayacak "mutlu yol (happy path)" testimi yazdım.[cite: 19]
    const hash = await bcrypt.hash('123456', 10); // Bu senaryo için '123456' şifresinin geçerli hash'ini ürettim ki giriş anında şifreler eşleşebilsin.[cite: 19]
    mockUsersRepo.findOne.mockResolvedValue({ // Sahte veritabanımın, geçerli kullanıcımı bulup döndürmesini sağladım ki giriş işlemi için zemin hazırlayayım.[cite: 19]
      id: 1, // Sahte kullanıcı ID'si.[cite: 19]
      email: 'adem@test.com', // Doğru test e-postası.[cite: 19]
      passwordHash: hash, // "123456" şifresinin hash'lenmiş hali.[cite: 19]
      roles: [{ name: 'USER' }], // Kullanıcı rolü.[cite: 19]
    });

    const result = await service.login({ email: 'adem@test.com', password: '123456' }); // Doğru e-posta ve doğru şifre (123456) ile login fonksiyonunu çağırdım ki sorunsuz bir giriş simüle edeyim.[cite: 19]
    expect(result).toHaveProperty('accessToken', 'sahte-token'); // Dönen sonuç objesinde "accessToken" adında bir özellik olmasını ve değerinin "sahte-token" (mockJwtService'te ayarladığım sabit değer) olmasını bekledim ki başarılı girişte token dağıtıldığını kesin olarak doğrulayayım.[cite: 19]
  });
});