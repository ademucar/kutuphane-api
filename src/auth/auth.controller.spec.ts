import { Test, TestingModule } from '@nestjs/testing'; // NestJS test ortamında modül yaratmak için Test ve TestingModule kütüphanelerini içeri aktardım ki gerçek uygulama ayağa kalkmadan controller'ımı izole bir şekilde test edebileyim.[cite: 16]
import { AuthController } from './auth.controller'; // Test edeceğim hedefin AuthController olduğunu belirttim ki test kapsamım sadece bu dosya ile sınırlı kalsın.[cite: 16]

describe('AuthController', () => { // Jest test bloğumu başlattım ki AuthController ile ilgili tüm test senaryolarını bu yapı altında toplayabileyim.[cite: 16]
  let controller: AuthController; // AuthController nesnemi tutacak değişkeni tanımladım ki aşağıdaki "it" blokları içerisinde sürekli bu değişkene erişebileyim.[cite: 16]

  beforeEach(async () => { // Her "it" testinden önce sıfırdan çalışacak hazırlık fonksiyonumu yazdım ki her test yepyeni, temiz bir controller örneği ile başlasın.[cite: 16]
    const module: TestingModule = await Test.createTestingModule({ // Sahte bir NestJS modülü oluşturdum ki sanki gerçek uygulama çalışıyormuş gibi NestJS'in dependency injection mekanizmasını kullanabileyim.[cite: 16]
      controllers: [AuthController], // Sahte modülüme sadece AuthController'ı ekledim ki sadece bunun oluşturulmasını sağlayayım.[cite: 16]
    }).compile(); // Modülü derleyip kullanıma hazır hale getirdim ki içerisindeki bağımlılıklar çözümlensin.[cite: 16]

    controller = module.get<AuthController>(AuthController); // Derlediğim sahte modülden AuthController'ın çalışan bir örneğini çekip değişkenime atadım ki testlerde metodlarını çağırabileyim.[cite: 16]
  });

  it('should be defined', () => { // Controller'ın başarılı bir şekilde bellekte oluşturulup oluşturulmadığını kontrol edeceğim ilk basit test senaryomu yazdım ki sistemin çalıştığını teyit edeyim.[cite: 16]
    expect(controller).toBeDefined(); // Controller değişkenimin 'undefined' olmadığını beklediğimi belirttim ki bağımlılık çözme işleminin (dependency injection) çökmediğini doğrulayayım.[cite: 16]
  });
});