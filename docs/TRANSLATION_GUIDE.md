# Panduan Menambahkan Terjemahan Baru

## Cara Menambahkan Data Terjemahan Baru

### 1. Buka File Terjemahan

Buka kedua file terjemahan:

- `locales/id.json` (Bahasa Indonesia)
- `locales/en.json` (Bahasa Inggris)

### 2. Tambahkan Key Baru

Tambahkan key terjemahan baru dengan struktur nested object. Contoh:

**di `locales/id.json`:**

```json
{
  "products": {
    "title": "Produk",
    "description": "Deskripsi Produk"
  }
}
```

**di `locales/en.json`:**

```json
{
  "products": {
    "title": "Products",
    "description": "Product Description"
  }
}
```

### 3. Gunakan di Komponen

Import hook `useTranslation` dan gunakan fungsi `t()`:

```tsx
"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("products.title")}</h1>
      <p>{t("products.description")}</p>
    </div>
  );
}
```

## Contoh Struktur Key

### Key Sederhana

```json
{
  "welcome": "Selamat Datang"
}
```

Penggunaan: `t("welcome")`

### Key Nested (Bertingkat)

```json
{
  "products": {
    "list": {
      "title": "Daftar Produk"
    }
  }
}
```

Penggunaan: `t("products.list.title")`

## Tips

1. **Selalu tambahkan di kedua file** (id.json dan en.json)
2. **Gunakan struktur yang konsisten** - kelompokkan berdasarkan fitur/modul
3. **Gunakan nama key yang deskriptif** - mudah dipahami maksudnya
4. **Jika key tidak ditemukan**, sistem akan mengembalikan key itu sendiri sebagai fallback

## Contoh Lengkap

### Menambahkan Terjemahan untuk Halaman Profile

**1. Tambahkan di `locales/id.json`:**

```json
{
  "profile": {
    "title": "Profil Saya",
    "editProfile": "Edit Profil",
    "myOrders": "Pesanan Saya",
    "settings": "Pengaturan"
  }
}
```

**2. Tambahkan di `locales/en.json`:**

```json
{
  "profile": {
    "title": "My Profile",
    "editProfile": "Edit Profile",
    "myOrders": "My Orders",
    "settings": "Settings"
  }
}
```

**3. Gunakan di komponen:**

```tsx
import { useTranslation } from "@/hooks/useTranslation";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("profile.title")}</h1>
      <button>{t("profile.editProfile")}</button>
      <button>{t("profile.myOrders")}</button>
    </div>
  );
}
```

## Struktur File Terjemahan Saat Ini

- `nav` - Navigasi
- `header` - Header/Navbar
- `common` - Teks umum yang sering digunakan
- `auth` - Autentikasi (login, register, dll)
- `footer` - Footer
- `products` - Produk
- `checkout` - Checkout/Pembayaran

Anda bisa menambahkan kategori baru sesuai kebutuhan!

## 🔄 Realtime Updates (Update Tanpa Restart)

Sistem terjemahan sekarang mendukung **realtime updates**! Ketika Anda menambahkan atau mengubah terjemahan di file JSON, perubahan akan langsung terlihat tanpa perlu restart aplikasi.

### Cara Kerja

1. **API Endpoint**: Terjemahan dimuat dari `/api/translations/[lang]` yang membaca file JSON secara dinamis
2. **Caching**: Terjemahan di-cache selama 5 menit untuk performa optimal
3. **Auto-refresh**: Bisa diaktifkan untuk refresh otomatis secara berkala

### Manual Refresh

Untuk refresh terjemahan secara manual (misalnya setelah menambah data baru):

```tsx
"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function MyComponent() {
  const { t, refreshTranslations, isLoading } = useTranslation();

  const handleRefresh = async () => {
    await refreshTranslations();
    console.log("Translations refreshed!");
  };

  return (
    <div>
      <button onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? "Loading..." : "Refresh Translations"}
      </button>
      <p>{t("common.loading")}</p>
    </div>
  );
}
```

### Auto-Refresh (Opsional)

Untuk auto-refresh terjemahan secara berkala:

```tsx
"use client";

import { useAutoRefreshTranslations } from "@/hooks/useAutoRefreshTranslations";

export default function MyComponent() {
  // Auto-refresh setiap 5 menit (default)
  useAutoRefreshTranslations();

  // Atau custom interval
  // useAutoRefreshTranslations({ interval: 60000 }); // 1 menit

  return <div>My Component</div>;
}
```

### Tips Realtime Updates

1. **Setelah menambah data baru** di `locales/id.json` atau `locales/en.json`:

   - Refresh halaman browser, atau
   - Panggil `refreshTranslations()` secara manual, atau
   - Tunggu cache expire (5 menit) untuk auto-update

2. **Untuk development**: Gunakan auto-refresh dengan interval pendek (misalnya 30 detik)

3. **Untuk production**: Biarkan default (5 menit) atau nonaktifkan auto-refresh untuk menghemat bandwidth

### API Endpoint

Terjemahan bisa diakses langsung via API:

```bash
# Get Indonesian translations
GET /api/translations/id

# Get English translations
GET /api/translations/en
```

Response akan selalu mengembalikan data terbaru dari file JSON (tanpa cache di server).
