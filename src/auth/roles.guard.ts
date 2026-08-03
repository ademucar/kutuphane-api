import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'; // NestJS'in kalkan arayüzünü (CanActivate), isteğin bağlamını yakalayan sınıfını (ExecutionContext) ve yetkisizlik durumunda fırlatacağım HTTP 403 (Forbidden) hatasını içeri aktardım ki kendi özel rol kalkanımı (RBAC) inşa edebileyim.[cite: 24]
import { Reflector } from '@nestjs/core'; // Rotalara (metotlara) az önce Roles dekoratörüyle sakladığım o gizli bilgileri (metadata) okuyup çıkarabilmek için Reflector sınıfını dahil ettim ki guard o bilgilere ulaşabilsin.[cite: 24]

@Injectable() // Rol kontrolü yapacak bu kalkanın (guard) NestJS tarafından örneklenip yönetileceğini belirttim ki rotalarda kullanabileyim.[cite: 24]
export class RolesGuard implements CanActivate { // Bir koruma kalkanı olması için CanActivate arayüzünü uygulayan (implements) RolesGuard sınıfımı oluşturdum ki NestJS bu sınıfı bir güvenlik kontrolörü olarak tanısın.[cite: 24]
  constructor(private reflector: Reflector) {} // Gizli rolleri (metadata) okuyabilmek için Reflector sınıfını dependency injection ile sınıfıma özel olarak enjekte ettim ki canActivate metodunda kullanabileyim.[cite: 24]

  canActivate(context: ExecutionContext): boolean { // Kullanıcının o rotaya (metoda) ulaşıp ulaşamayacağını "true" (evet) veya "false/Exception" (hayır) dönerek belirleyecek zorunlu canActivate fonksiyonumu yazdım.[cite: 24]
    const required = this.reflector.get<string[]>('roles', context.getHandler()); // İstek yapılan metoda (context.getHandler()) bakarak, oraya @Roles() dekoratörü ile saklanmış olan ('roles' anahtarlı) zorunlu rol listesini okuyup 'required' değişkenine atadım.[cite: 24]
    if (!required) return true; // Eğer o metodun üzerinde hiçbir rol gereksinimi belirtilmemişse (yani @Roles dekoratörü yoksa), herkese açık demektir; doğrudan erişime izin ver (return true) ki boş yere hata almayayım.[cite: 24]

    const { user } = context.switchToHttp().getRequest(); // İstek (Request) objesine erişerek içinden 'user' nesnesini çıkardım. (Bu 'user' objesi, bir önceki aşamada çalışan JwtAuthGuard ve JwtStrategy tarafından token çözülerek başarıyla bu isteğin içine yerleştirilmişti).[cite: 24]
    const hasRole = user?.roles?.some((r: string) => required.includes(r)); // Kullanıcının sahip olduğu roller dizisindeki (user.roles) herhangi bir rolün (some), metoda giriş için zorunlu olan (required) roller listesinde bulunup bulunmadığını kontrol ettim (includes). Varsa 'hasRole' true, yoksa false olacak.[cite: 24]

    if (!hasRole) { // Eğer kullanıcının rolü, rotanın istediği rolle eşleşmiyorsa ('hasRole' false ise) içeri giren "if" şartını yazdım.[cite: 24]
      throw new ForbiddenException('Bu işlem için yetkiniz yok'); // Kullanıcının token'ı geçerli (login olmuş) olsa bile, yetkisi yetmediği için işlemi engelleyip HTTP 403 (Forbidden) hatası fırlattım ki güvenlik ihlalini durdurayım.[cite: 24]
    }
    return true; // Eğer yukardaki hataya takılmamışsa (rolü yeterliyse) geçişe izin veren "return true" ifadesini döndürdüm ki kullanıcı hedef rotasına ulaşıp işlemini yapabilsin.[cite: 24]
  }
}