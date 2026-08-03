import { Test, TestingModule } from '@nestjs/testing'; // NestJS test ortamı için gerekli modülleri getirdim ki izole bir test ortamı kurabileyim.[cite: 26]
import { AuthorsController } from './authors.controller'; // Test edeceğim hedefin AuthorsController olduğunu belirttim ki test sadece bu controller'ı kapsasın.[cite: 26]

describe('AuthorsController', () => { // AuthorsController için test grubunu başlattım ki test sonuçlarını gruplanmış şekilde görebileyim.[cite: 26]
  let controller: AuthorsController; // Controller'ı tutacak değişkenimi tanımladım ki aşağıdaki test metodlarında ('it') erişebileyim.[cite: 26]

  beforeEach(async () => { // Her bir test senaryosundan önce çalışacak hazırlık fonksiyonunu yazdım ki her test temiz, sıfırlanmış bir örnekle başlasın.[cite: 26]
    const module: TestingModule = await Test.createTestingModule({ // Sahte bir test modülü yarattım ki bağımlılıkları NestJS'e çözdürebileyim.[cite: 26]
      controllers: [AuthorsController], // Sadece AuthorsController'ı modüle ekledim ki fazladan yükleme yapmayayım.[cite: 26]
    }).compile(); // Modülü derleyip test için hazır hale getirdim.[cite: 26]

    controller = module.get<AuthorsController>(AuthorsController); // Derlenmiş modülden controller örneğini çekip değişkenime atadım ki testlerde bu örneği kullanabileyim.[cite: 26]
  });

  it('should be defined', () => { // Controller'ın başarıyla oluşturulduğunu doğrulayan ilk testimi yazdım ki modülün düzgün derlendiğini teyit edeyim.[cite: 26]
    expect(controller).toBeDefined(); // Controller değişkeninin tanımlı (undefined olmadığını) olmasını bekledim ki sistemin başarıyla çalıştığından emin olayım.[cite: 26]
  });
});