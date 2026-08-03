# Kütüphane Yönetim Sistemi (Backend API)

Kitap ödünç alma, rezervasyon, yorum ve yönetim işlemlerini yöneten bir kütüphane arka uç (backend) servisi. Kimlik doğrulamadan iş kurallarına, testten API dokümantasyonuna kadar uçtan uca geliştirilmiştir.

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Framework | NestJS (Node.js + TypeScript) |
| ORM | TypeORM |
| Veritabanı | PostgreSQL |
| Kimlik doğrulama | JWT + bcrypt |
| Altyapı | Docker Compose |
| API Dokümantasyonu | Swagger (OpenAPI) |
| Test | Jest (unit + e2e) |

## Özellikler

- **Kimlik & Yetki:** Kayıt, giriş, JWT ile korumalı erişim, USER / ADMIN rol bazlı yetkilendirme
- **Katalog:** Kitap, yazar, kategori, yayınevi için tam CRUD; bir kitaba birden çok yazar ve kategori atanabilir
- **Arama & Listeleme:** Sayfalama, arama, filtreleme (kategori/yazar/yayınevi), alfabetik ve yıla göre sıralama
- **Ödünç & Rezervasyon:** Stok kontrolü, transaction ile veri bütünlüğü, aynı anda en fazla 2 kitap, gecikme cezası (orantılı ödünç alma yasağı), rezervasyon sırası
- **Yorum & İstatistik:** Ödünç alınan kitaba 1–5 puan; en çok ödünç alınan kitaplar ve en aktif kullanıcı istatistikleri
- **Test & Dokümantasyon:** Unit + integration testleri, işlem logları, Swagger arayüzü

## Kurulum ve Çalıştırma

Proje Docker Compose ile tek komutla ayağa kalkar. Bilgisayarınızda **Docker Desktop** kurulu ve açık olması yeterlidir; ayrıca PostgreSQL veya Node.js kurmanıza gerek yoktur.

```bash
# Projeyi başlat (ilk seferde imajları kurar)
docker compose up --build
```

Bu komut iki konteyneri birlikte başlatır:
- **postgres** — PostgreSQL veritabanı (5432 portu)
- **backend** — NestJS API (3000 portu)

Uygulama ayağa kalktıktan sonra:

- **API:** http://localhost:3000
- **Swagger (API dokümantasyonu / test arayüzü):** http://localhost:3000/api

Veritabanını sıfırdan başlatmak için (tüm tabloları siler, USER/ADMIN rolleri yeniden oluşur):

```bash
docker compose down -v
docker compose up --build
```

## Kod Yapısı

Kaynak kodun tamamı **Türkçe açıklama satırları (comment)** ile belgelenmiştir; her modülün, servis fonksiyonunun ve iş kuralının ne yaptığı kod içinde açıklanmıştır.

```
kutuphane-api/
├── docker-compose.yml      # postgres + backend konteyner tanımı
├── Dockerfile              # backend imajının kurulumu
├── .env                    # veritabanı ve JWT ayarları
└── src/
    ├── main.ts             # uygulama başlangıcı, Swagger, ValidationPipe
    ├── app.module.ts       # kök modül, veritabanı bağlantısı
    ├── auth/               # kayıt, giriş, JWT, guard'lar
    ├── users/ roles/       # kullanıcı ve rol tanımları
    ├── books/ authors/     # katalog: kitap, yazar,
    ├── categories/ publishers/ #         kategori, yayınevi
    ├── borrowings/         # ödünç alma, iade, gecikme cezası, istatistik
    ├── reservations/       # rezervasyon ve sıra yönetimi
    └── reviews/            # yorum ve puanlama
```

Her modül; **entity** (tablo tanımı), **DTO** (gelen veri doğrulama), **service** (iş mantığı) ve **controller** (endpoint) dosyalarından oluşur. Bu ayrım sayesinde iş mantığı bağımsız olarak test edilebilir.

## Başlıca Endpoint'ler

| Metod | Endpoint | Erişim | Açıklama |
|---|---|---|---|
| POST | `/auth/register` | Herkes | Yeni kullanıcı kaydı |
| POST | `/auth/login` | Herkes | Giriş, JWT token döner |
| GET | `/books` | Herkes | Kitap listesi (arama/filtre/sayfalama/sıralama) |
| POST | `/books` | ADMIN | Yeni kitap ekleme |
| POST | `/borrowings` | Kullanıcı | Kitap ödünç alma |
| PATCH | `/borrowings/:id/return` | Kullanıcı | Kitap iade etme |
| POST | `/reservations` | Kullanıcı | Rezervasyon oluşturma |
| POST | `/reviews` | Kullanıcı | Kitaba yorum ekleme |
| GET | `/borrowings/stats/popular-books` | ADMIN | En çok ödünç alınan kitaplar |

Tüm endpoint'lerin ayrıntısı Swagger arayüzünde (http://localhost:3000/api) görüntülenebilir ve test edilebilir.

## İş Kuralları

- Bir kullanıcı aynı anda en fazla **2 kitap** ödünç alabilir
- Ödünç süresi **5 gündür**
- Geç iade edilirse: her geciken gün için **3 gün ödünç alma yasağı** (orantılı ceza)
- Aktif cezası olan kullanıcı yeni kitap alamaz
- Aynı kitabı aynı anda iki kez ödünç alamaz
- Kitap stoğu negatife düşemez (transaction + kilit ile korunur)
- Aynı kullanıcı aynı kitaba yalnızca bir yorum yapabilir; puan 1–5 arasında olmalıdır

## Test

```bash
# Unit test (AuthService) — bilgisayarda çalışır
npm run test auth.service

# Integration / e2e test — konteyner içinde çalıştırılır
docker exec -it kutuphane-api npm run test:e2e
```

> Not: e2e testi gerçek veritabanına bağlandığı için konteyner içinden çalıştırılır. Doğrudan bilgisayardan çalıştırıldığında `postgres` sunucu adına erişemez (bu ad yalnızca Docker ağı içinde geçerlidir).

## Test Kullanıcısı

Kurulumdan sonra bir kullanıcı kaydedip (örn. `kullanici@test.com` / `123456`) ADMIN yetkisi verilebilir. Ayrıntılı test adımları için proje ile birlikte sunulan **Test Dokümanı**'na bakınız.


## 📫 İletişim

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adem-u%C3%A7ar-39501731a/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/ademucarr_/)