# Banking Management System - Web Frontend

Bu proje, modern bir bankacılık yönetim sisteminin web arayüzünü içermektedir. React ve Vite kullanılarak geliştirilmiş olup, kullanıcı dostu bir arayüz sunmaktadır.

## 🚀 Özellikler

- Müşteri yönetimi
- Hesap işlemleri
- Para yatırma işlemleri
- Modern ve responsive tasarım
- Animasyonlu kullanıcı arayüzü

## 🛠️ Teknolojiler

- React 19
- Vite 6
- Styled Components
- Framer Motion
- Bootstrap 5
- Axios
- ESLint

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone [repository-url]
cd web
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🏗️ Proje Yapısı

```
src/
├── assets/         # Statik dosyalar
├── components/     # React bileşenleri
│   ├── common/     # Ortak bileşenler
│   ├── Accounts.jsx
│   ├── Customers.jsx
│   ├── Deposits.jsx
│   └── ContinueButton.jsx
├── services/       # API servisleri
│   └── api/        # API entegrasyonları
├── App.jsx         # Ana uygulama bileşeni
├── main.jsx        # Uygulama giriş noktası
└── global-styles.css # Global stil tanımlamaları
```

## 📱 Komponentler

### Accounts.jsx
Hesap yönetimi için ana komponent. Şu özellikleri içerir:
- Hesap listesi görüntüleme
- Yeni hesap oluşturma
- Hesap güncelleme
- Hesap silme
- Hesap-müşteri ilişkilendirme
- Sayfalama desteği
- Hesap detayları görüntüleme

### Customers.jsx
Müşteri yönetimi için ana komponent. Şu özellikleri içerir:
- Müşteri listesi görüntüleme
- Yeni müşteri ekleme
- Müşteri bilgilerini güncelleme
- Müşteri silme
- Profil fotoğrafı yükleme ve görüntüleme
- Sayfalama desteği

### Deposits.jsx
Para transfer işlemleri için ana komponent. Şu özellikleri içerir:
- Transfer geçmişi görüntüleme
- Yeni para transferi yapma
- Hesaplar arası transfer
- İşlem raporu PDF indirme
- Sayfalama desteği

### ContinueButton.jsx
Özel tasarlanmış devam butonu komponenti. Şu özellikleri içerir:
- Animasyonlu geçişler
- İkon entegrasyonu
- Özelleştirilebilir tasarım
- Yükleme durumu gösterimi

## 🔌 Servisler

### accountService
Hesap işlemleri için API servisleri:
- `getAccounts`: Hesap listesini getirir
- `saveAccount`: Yeni hesap oluşturur
- `updateAccount`: Hesap bilgilerini günceller
- `deleteAccount`: Hesap siler
- `linkAccount`: Hesabı müşteri ile ilişkilendirir
- `unlinkAccount`: Hesap-müşteri ilişkisini kaldırır

### customerService
Müşteri işlemleri için API servisleri:
- `getCustomers`: Müşteri listesini getirir
- `saveCustomer`: Yeni müşteri oluşturur
- `updateCustomer`: Müşteri bilgilerini günceller
- `deleteCustomer`: Müşteri siler

### depositService
Para transfer işlemleri için API servisleri:
- `getDeposits`: Transfer geçmişini getirir
- `transferFunds`: Para transferi yapar
- `downloadTransactionsPdf`: İşlem raporunu PDF olarak indirir

## 🚀 Kullanılabilir Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Projeyi production için derler
- `npm run preview` - Derlenmiş projeyi önizler
- `npm run lint` - Kod kalitesi kontrolü yapar

## 🎨 UI/UX Özellikleri

- Modern ve temiz tasarım
- Responsive layout
- Animasyonlu geçişler
- Kullanıcı dostu form yapıları
- Bootstrap tabanlı grid sistemi

## 🔒 Güvenlik

- API istekleri için güvenli bağlantı
- Form validasyonları
- Hata yönetimi

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.
