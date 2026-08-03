import { INestApplication, ValidationPipe } from '@nestjs/common'; // NestJS'in çekirdek yapılarını ve doğrulama borusunu (ValidationPipe) içeri aktardım ki uygulamayı sanal olarak ayağa kaldırıp gelen verileri test esnasında da gerçeğe uygun şekilde doğrulayabileyim.[cite: 12]
import { Test } from '@nestjs/testing'; // NestJS'in test modülünü projeye dahil ettim ki test koşumu sırasında sahte (mock) bir uygulama modülü yaratabileyim.[cite: 12]
import request from 'supertest'; // Supertest kütüphanesini import ettim ki HTTP isteklerini (GET, POST vb.) sanal olarak dışarıdan bir istemci (client) gibi uygulamama atabileyim.[cite: 12]
import { AppModule } from '../src/app.module'; // Uygulamamın ana modülünü (AppModule) çağırdım ki testleri gerçek uygulamanın orijinal yapılandırmasıyla birebir aynı ortamda gerçekleştirebileyim.[cite: 12]

describe('Auth (e2e)', () => { // Test grubumu 'Auth (e2e)' olarak isimlendirdim ki konsolda test sonuçlarını okurken bunların uçtan uca kimlik doğrulama testleri olduğunu hemen anlayabileyim.[cite: 12]
  let app: INestApplication; // Uygulama örneğimi tutacak değişkeni (app) tanımladım ki testlerin her aşamasında bu sanal sunucuya erişip istek atabileyim.[cite: 12]
  const testEmail = `test${Date.now()}@test.com`; // Her test çalıştığında şimdiki zamana (Date.now) dayalı benzersiz bir e-posta adresi ürettim ki veritabanındaki "bu e-posta zaten var" hatasına takılmadan testlerimi her defasında izole ve sorunsuz çalıştırabileyim.[cite: 12]

  beforeAll(async () => { // Tüm testler başlamadan önce sadece bir kez çalışacak olan hazırlık bloğunu tanımladım ki uygulama ortamını testlere başlamadan önce tam olarak kurabileyim.[cite: 12]
    const moduleRef = await Test.createTestingModule({ // Test için özel bir modül referansı oluşturdum ki uygulamanın tüm bağımlılıklarını derleyebileyim.[cite: 12]
      imports: [AppModule], // Ana AppModule'ü test modülüne dahil ettim ki tüm controller ve servislerim test ortamında da tam entegre çalışsın.[cite: 12]
    }).compile(); // Modülü derledim ki NestJS arka planda tüm bağımlılıkları (dependency injection) kendi kendine çözümlesin ve bağlasın.[cite: 12]

    app = moduleRef.createNestApplication(); // Derlenen modülden sanal bir NestJS uygulaması yarattım ki HTTP isteklerini karşılayacak çalışan bir sunucum olsun.[cite: 12]
    app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Uygulamaya global ValidationPipe ekledim ki DTO'da olmayan ekstra alanlar (whitelist: true) atılsın ve gelen veriler gerçekteki kurallarım neyse ona göre doğrulansın.[cite: 12]
    await app.init(); // Uygulamayı başlattım ki arka plandaki servisler hazır hale gelsin ve sunucu istekleri dinlemeye resmi olarak başlasın.[cite: 12]
  });

  afterAll(async () => { // Bütün test senaryolarım bittikten sonra çalışacak bloğu yazdım ki test sonrası temizlik işlemlerini yapabileyim.[cite: 12]
    await app.close(); // Uygulamayı ve bağlantıları kapattım ki test bitiminde bellek sızıntısı (memory leak) olmasın ve süreç asılı kalmadan sonlansın.[cite: 12]
  });

  it('POST /auth/register — yeni kullanıcı oluşturmalı', () => { // Register işlemi için ilk test senaryomu tanımladım ki geçerli verilerle kayıt işleminin sorunsuz çalıştığını doğrulayabileyim.[cite: 12]
    return request(app.getHttpServer()) // Supertest ile Nest uygulamasının altındaki HTTP sunucusuna bağlandım ki gerçek bir Postman veya tarayıcı gibi istek yapabileyim.[cite: 12]
      .post('/auth/register') // Test isteğimi POST metoduyla '/auth/register' rotasına yönlendirdim ki yazdığım AuthController'daki kayıt rotasını tetikleyebileyim.[cite: 12]
      .send({ email: testEmail, password: '123456', fullName: 'Test User' }) // İsteğin gövdesine (body) geçerli kullanıcı verilerini JSON olarak ekledim ki kayıt işlemi başarıyla gerçekleşebilsin.[cite: 12]
      .expect(201) // Sunucudan 201 (Created) durum kodu dönmesini beklediğimi belirttim ki kaydın başarılı bir şekilde tamamlandığından teknik olarak emin olayım.[cite: 12]
      .expect((res) => { // Sunucudan dönen cevabın (response) detaylarını incelemek için bir callback fonksiyonu açtım ki verinin yapısını manuel kontrol edebileyim.[cite: 12]
        expect(res.body).toHaveProperty('email', testEmail); // Dönen cevapta gönderdiğim eşsiz e-postanın yer aldığını kontrol ettim ki doğru kullanıcının oluştuğunu ve verinin bana geri döndüğünü teyit edeyim.[cite: 12]
        expect(res.body).not.toHaveProperty('passwordHash'); // Dönen cevapta güvenlik gereği şifre veya şifre hash'inin KESİNLİKLE olmamasını (not) şart koştum ki API'min şifre sızıntısı yapmadığından emin olayım.[cite: 12]
      });
  });

  it('POST /auth/register — geçersiz email 400 dönmeli', () => { // Kayıt işlemi için kasten bir hata senaryosu yazdım ki doğrulama (validation) mekanizmasının düzgün çalıştığını göreyim.[cite: 12]
    return request(app.getHttpServer()) // Tekrar sanal sunucuma yeni bir istek başlattım ki hatalı veriyi sisteme göndereyim.[cite: 12]
      .post('/auth/register') // Yine kayıt rotasına istek attım ki hatalı veri girişinin bu rotada nasıl tepki vereceğini simüle edeyim.[cite: 12]
      .send({ email: 'gecersiz', password: '123', fullName: '' }) // Kasıtlı olarak e-posta formatına uymayan ('gecersiz') ve eksik veriler gönderdim ki sistemi zorlayıp hata vermeye zorlayayım.[cite: 12]
      .expect(400); // Sistemden 400 (Bad Request) dönmesini bekledim ki yukarıda eklediğim ValidationPipe'ın hatalı veriyi başarıyla engellediğini teyit edeyim.[cite: 12]
  });

  it('POST /auth/login — doğru bilgiyle token dönmeli', () => { // Giriş (login) işlemi için başarılı senaryo testimi yazdım ki kimlik doğrulama sürecinin yetkilendirme sağladığını göreyim.[cite: 12]
    return request(app.getHttpServer()) // Sunucuya yeni bir istek oluşturuyorum ki bu defa sisteme giriş yapmayı deneyeyim.[cite: 12]
      .post('/auth/login') // İsteği '/auth/login' rotasına POST olarak gönderdim ki login controller'ını devreye sokayım.[cite: 12]
      .send({ email: testEmail, password: '123456' }) // Yukarıdaki ilk testte başarıyla oluşturduğum benzersiz kullanıcının geçerli bilgilerini gönderdim ki giriş başarılı olabilsin.[cite: 12]
      .expect(201) // İşlemin başarılı olduğunu gösteren HTTP 201 kodunu bekledim ki girişin yapıldığını teyit edeyim (NestJS varsayılan POST cevabı 201 olduğu için).[cite: 12]
      .expect((res) => { // Dönen yanıtı incelemek için bloğu açtım ki bana geçerli bir token verilip verilmediğini kontrol edebileyim.[cite: 12]
        expect(res.body).toHaveProperty('accessToken'); // Dönen JSON gövdede 'accessToken' adında bir değerin muhakkak olmasını şart koştum ki yetkilendirme mekanizmamın bana bir JWT token ürettiğinden kesin emin olayım.[cite: 12]
      });
  });

  it('POST /auth/login — yanlış şifre 401 dönmeli', () => { // Giriş işlemi için hatalı şifre senaryosunu test ettim ki yetkisiz girişlerin güvenlik duvarına takıldığını doğrulayabileyim.[cite: 12]
    return request(app.getHttpServer()) // Hatalı giriş denemesi için sunucuya istek başlattım ki saldırı simülasyonunu yürütebileyim.[cite: 12]
      .post('/auth/login') // Login rotasına istek attım ki işlemi başlatayım.[cite: 12]
      .send({ email: testEmail, password: 'yanlis' }) // Doğru olan kayıtlı e-postayı ancak kasten hatalı bir şifreyi ('yanlis') gönderdim ki sistemi yetkilendirme için kandırmaya çalışayım.[cite: 12]
      .expect(401); // Sistemden 401 (Unauthorized) hatası dönmesini bekledim ki şifresi yanlış olan bir kullanıcının sisteme sızmasının başarıyla reddedildiğini göreyim.[cite: 12]
  });
});