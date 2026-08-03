import { Test, TestingModule } from '@nestjs/testing'; // Servisi test etmek üzere sahte bir modül oluşturmak için Test kütüphanelerini içeri aktardım.[cite: 29]
import { AuthorsService } from './authors.service'; // Test edeceğim hedef olan AuthorsService'i projeye dahil ettim.[cite: 29]

describe('AuthorsService', () => { // Servis için test bloklarımı grupladım ki sonuçlarda başlık altında düzenli okuyabileyim.[cite: 29]
  let service: AuthorsService; // Servis örneğimi tutacak değişkeni tanımladım ki it bloklarında kullanabileyim.[cite: 29]

  beforeEach(async () => { // Her testten önce ortamı sıfırlayacak fonksiyonu hazırladım.[cite: 29]
    const module: TestingModule = await Test.createTestingModule({ // Bağımlılıkları çözmek için sahte bir test modülü yarattım.[cite: 29]
      providers: [AuthorsService], // Servisi sağlayıcı olarak ekledim ki test için yaratılsın.[cite: 29]
    }).compile(); // Modülü derleyip kullanıma hazır ettim.[cite: 29]

    service = module.get<AuthorsService>(AuthorsService); // Derlenen modülden servisin bir örneğini alıp değişkenime bağladım.[cite: 29]
  });

  it('should be defined', () => { // Servisin hatasız yaratıldığını kontrol edecek temel testi yazdım.[cite: 29]
    expect(service).toBeDefined(); // Servis objemin undefined olmamasını şart koşarak başarılı oluşturulduğunu teyit ettim.[cite: 29]
  });
});