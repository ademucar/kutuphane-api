import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'; // NestJS'ten HTTP hata sınıflarını (Conflict 409, Unauthorized 401), sınıfı enjekte edilebilir yapan @Injectable dekoratörünü ve konsola log basmak için Logger sınıfını içeri aktardım ki iş mantığını (business logic) güvenle yazabileyim.[cite: 20]
import { JwtService } from '@nestjs/jwt'; // Token üretmek için JWT servisini projeye dahil ettim ki başarılı girişlerde kullanıcıya bilet (token) kesebileyim.[cite: 20]
import { InjectRepository } from '@nestjs/typeorm'; // TypeORM tablolarını servise bağlamak için InjectRepository dekoratörünü getirdim ki veritabanı işlemlerini gerçekleştirebileyim.[cite: 20]
import * as bcrypt from 'bcrypt'; // Şifreleri düz metin (plain-text) olarak kaydetmemek için bcrypt kütüphanesini dahil ettim ki veritabanı sızsa bile şifreler güvende kalsın.[cite: 20]
import { Repository } from 'typeorm'; // TypeORM'un Repository tipini getirdim ki editörümde (IDE) tablolara (entity) sorgu atarken otomatik tamamlama (intellisense) yardımı alayım.[cite: 20]
import { Role } from '../roles/role.entity'; // Veritabanındaki rol tablomun şemasını (entity) içeri aktardım ki kullanıcılara yetki atayabileyim.[cite: 20]
import { User } from '../users/user.entity'; // Veritabanındaki kullanıcı tablomun şemasını getirdim ki yeni kayıt açıp arama yapabileyim.[cite: 20]
import { LoginDto } from './dto/login.dto'; // Giriş verilerinin tipini getirdim ki login metodumda parametre olarak kullanabileyim.[cite: 20]
import { RegisterDto } from './dto/register.dto'; // Kayıt verilerinin tipini getirdim ki register metodumda DTO (Data Transfer Object) üzerinden işlem yapabileyim.[cite: 20]

@Injectable() // Bu sınıfın NestJS tarafından yönetilebilen (Dependency Injection) bir "sağlayıcı (provider)" olduğunu belirttim ki controller'larda bunu constructor üzerinden çağırabileyim.[cite: 20]
export class AuthService { // Tüm kimlik doğrulama süreçlerini yürüteceğim AuthService sınıfını dışa aktarılabilir şekilde tanımladım.[cite: 20]
  private readonly logger = new Logger(AuthService.name); // Sınıfıma özel bir Logger objesi oluşturdum ki konsola bilgi basarken logların "AuthService" adıyla etiketlenmesini sağlayıp takibini kolaylaştırayım.[cite: 20]

  constructor( // Sınıf başlatılırken ihtiyaç duyduğu bağımlılıkları (Dependency Injection) NestJS'ten talep ettim ki veritabanına bağlanabileyim.[cite: 20]
    @InjectRepository(User) private usersRepo: Repository<User>, // User tablosu için işlem yapmamı sağlayacak repository'yi "usersRepo" adıyla enjekte ettim ki kullanıcı arama ve kaydetme sorgularını atabileyim.[cite: 20]
    @InjectRepository(Role) private rolesRepo: Repository<Role>, // Role tablosu için repository'yi "rolesRepo" adıyla enjekte ettim ki yeni kullanıcılara "USER" rolünü veritabanından çekip atayabileyim.[cite: 20]
    private jwtService: JwtService, // Token üretmek için kullanacağım JWT servisini enjekte ettim ki login sonunda jwtService.signAsync metodunu çağırabileyim.[cite: 20]
  ) {}

  async register(dto: RegisterDto) { // Yeni kullanıcı kaydı oluşturmak için asenkron register metodunu yazdım ve parametre olarak DTO (RegisterDto) istedim ki gelen verinin yapısı belli olsun.[cite: 20]
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } }); // DTO'dan gelen e-postanın veritabanında önceden kayıtlı olup olmadığını aradım ki aynı e-postayla iki kez hesap açılmasını engelleyeyim.[cite: 20]
    if (existing) { // Eğer böyle bir kullanıcı zaten veritabanında varsa ("existing" doluysa) içeri girmesini sağlayan "if" kontrolünü yazdım.[cite: 20]
      throw new ConflictException('Bu e-posta zaten kayıtlı'); // İşlemi kesip HTTP 409 (Conflict - Çakışma) hatası fırlattım ki istemci (client) aynı e-postayı kullandığı için uyarılsın.[cite: 20]
    }

    const passwordHash = await bcrypt.hash(dto.password, 10); // DTO'dan gelen düz metin şifreyi bcrypt ile 10 tur (saltRounds) karma işleminden geçirip hash'ledim ki veritabanında şifreler şifrelenmiş halde güvenli tutulsun.[cite: 20]

    let userRole = await this.rolesRepo.findOne({ where: { name: 'USER' } }); // Veritabanından varsayılan rol olan 'USER' rolünü aradım ki yeni kaydolan kullanıcıya standart yetkileri verebileyim.[cite: 20]
    if (!userRole) { // Eğer veritabanı boşsa ve 'USER' rolü henüz tabloda yoksa içeri girecek "if" kontrolünü yazdım ki uygulamanın ilk kurulumunda çökme yaşamayayım.[cite: 20]
      userRole = await this.rolesRepo.save({ name: 'USER' }); // Hemen veritabanına 'USER' adında yeni bir rol kaydettim ki hem bu işlemi kurtarayım hem de sonraki kayıtlar için tabloyu hazırlamış olayım.[cite: 20]
    }

    const user = this.usersRepo.create({ // Repository'nin 'create' metoduyla bellekte yeni bir kullanıcı objesi (entity instance) yarattım ki kaydetmeden önce verileri ORM nesnesine çevirebileyim.[cite: 20]
      email: dto.email, // E-postayı atadım.[cite: 20]
      passwordHash, // Şifre yerine ürettiğim güvenli hash'i atadım.[cite: 20]
      fullName: dto.fullName, // Ad ve soyadı atadım.[cite: 20]
      roles: [userRole], // Bulduğum veya yeni oluşturduğum 'USER' rolünü bu kullanıcıya dizi (array) formatında atadım ki yetki ilişkisi kurulsun.[cite: 20]
    });
    await this.usersRepo.save(user); // Bellekte oluşturduğum kullanıcı nesnesini veritabanına (save) kalıcı olarak kaydettim ki kayıt işlemi teknik olarak tamamlansın.[cite: 20]

    this.logger.log(`Yeni kullanıcı kaydı: ${user.email} (id: ${user.id})`); // İşlem bitince konsola yeşil renkli bir log (bilgi mesajı) bastım ki sunucuyu izlerken yeni kayıtları anlık takip edebileyim.[cite: 20]

    return { id: user.id, email: user.email, fullName: user.fullName }; // Güvenlik gereği, hash'lenmiş şifreyi KESİNLİKLE dışarı vermeden sadece ID, email ve ismi cevap olarak geri döndürdüm ki kayıt başarılı bilgisi istemciye ulaşsın.[cite: 20]
  }

  async login(dto: LoginDto) { // Kullanıcı girişi için login metodunu yazdım ve LoginDto'yu parametre olarak aldım ki sadece email ve şifre beklediğimi belirteyim.[cite: 20]
    const user = await this.usersRepo.findOne({ where: { email: dto.email } }); // İstemciden gelen e-postayı veritabanında aradım ki böyle bir kullanıcının varlığını teyit edeyim.[cite: 20]
    if (!user) { // Eğer kullanıcı veritabanında bulunamazsa içeri girmesini sağlayan "if" şartını yazdım.[cite: 20]
      throw new UnauthorizedException('E-posta veya şifre hatalı'); // İşlemi durdurup 401 (Unauthorized) hatası fırlattım. Bilerek sadece "E-posta hatalı" demedim (ikisini de yazdım) ki kötü niyetli kişiler hangi bilginin yanlış olduğunu anlayıp sistemdeki e-postaları tahmin etmeye çalışmasın.[cite: 20]
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash); // DTO'dan gelen düz şifre ile veritabanından çektiğim şifrelenmiş hash'i bcrypt ile karşılaştırdım (compare) ki kullanıcının doğru parolayı girip girmediğini güvenle kontrol edeyim.[cite: 20]
    if (!isMatch) { // Eğer bcrypt eşleşme sağlamazsa (şifre yanlışsa) içeri girecek şartı yazdım.[cite: 20]
      throw new UnauthorizedException('E-posta veya şifre hatalı'); // Yine aynı güvenli mesajla 401 hatası fırlattım ki şifre denemelerini reddedeyim.[cite: 20]
    }

    const payload = { // Her iki bilgi de (email ve şifre) doğruysa, JWT token'ın içine gömeceğim bilgileri (payload) içeren bir obje hazırladım ki token'ı çözen sistem kullanıcıyı tanıyabilsin.[cite: 20]
      sub: user.id, // 'sub' (subject) alanına kullanıcının ID'sini koydum ki standartlara (RFC 7519) uygun bir JWT token oluşturayım.[cite: 20]
      email: user.email, // Kullanıcının e-postasını da token'a gömdüm ki basit okumalarda direkt erişilebilir olsun.[cite: 20]
      roles: user.roles.map((r) => r.name), // Kullanıcının bağlı olduğu tüm rollerin sadece isimlerini (['ADMIN', 'USER'] gibi) dizi halinde token'a ekledim ki her istekte yetki kontrolü yaparken tekrar veritabanına gitmek zorunda kalmayayım.[cite: 20]
    };

    this.logger.log(`Giriş yapıldı: ${user.email} (id: ${user.id})`); // Başarılı girişi konsola log'ladım ki sunucu aktivitesini izlerken girişleri takip edebileyim.[cite: 20]

    return { accessToken: await this.jwtService.signAsync(payload) }; // Hazırladığım payload objesini JWT servisi aracılığıyla asenkron (signAsync) olarak gizli anahtarımla imzalayıp 'accessToken' anahtarıyla (key) geri döndürdüm ki kullanıcı bu anahtarı alıp diğer korumalı rotalara erişebilsin.[cite: 20]
  }
}