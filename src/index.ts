// Aplikasi Kasir dan Manajemen Stok Toko Grosir
import * as readline from "readline-sync";

// ===== TIPE DATA =====
interface Barang {
  id: string;
  nama: string;
  kategori: string;
  satuan: string;
  hargaSatuan: number;
  hargaGrosir: number;
  minGrosir: number;
  stok: number; 
  tersedia: boolean;
}

interface ItemBelanja {
  idbarang: string;
  nama: string;
  jumlah: number;
  hargaSatuan: number;
  keteranganHarga: string;
  subtotal: number;
}

// ===== VARIABEL & KONSTANTA =====
const NAMA_TOKO: string = "TOKO GROSIR SUMBER REJEKI";
const BATAS_STOK_MENIPIS: number = 10;
const ISI_PER_DUS: number = 12;
const PERSEN_DISKON_BESAR: number = 0.10; // 10% diskon jika total >= 1.000.000
const PERSEN_DISKON_SEDANG: number = 0.05; // 5% diskon jika total >= 500.000
const PERSEN_DISKON_MEMBER: number = 0.02; // 2% diskon jika total >= 100.000
const daftarBarang: Barang[] = buatDataStokAwal();
let totalPendapatan: number = 0;
let aplikasiBerjalan: boolean = true;
 
// ===========================
// KUMPULAN FUNCTION
// ===========================

// FUNCTION untuk membuat data stok awal toko grosir
function buatDataStokAwal(): Barang[] {
  const daftarBarang: Barang[] = [
    {
      id: "BRG01",
      nama: "Beras 5kg",
      kategori: "Beras",
      satuan: "karung",
      hargaSatuan: 68000,
      hargaGrosir: 65000,
      minGrosir: 10,
      stok: 40,
      tersedia: true
    },
    {
      id: "BRG02",
      nama: "Minyak Goreng 1L",
      kategori: "Minyak",
      satuan: "botol",
      hargaSatuan: 18000,
      hargaGrosir: 17000,
      minGrosir: 5,
      stok: 60,
      tersedia: true
    },
    {
      id: "BRG03",
      nama: "Gula Pasir 1kg",
      kategori: "Gula",
      satuan: "kg",
      hargaSatuan: 19000,
      hargaGrosir: 18000,
      minGrosir: 5,
      stok: 10,
      tersedia: true
    },
    {
      id: "BRG04",
      nama: "MIE INSTANT 1 dus isi 36",
      kategori: "Mie",
      satuan: "dus",
      hargaSatuan: 45000,
      hargaGrosir: 42000,
      minGrosir: 5,
      stok: 20,
      tersedia: true
    }
  ];
  return daftarBarang;
}

// function untuk mengubah angka menjadi format rupiah
function formatRupiah(angka: number): string {
  return "Rp " + angka.toLocaleString("id-ID");
}

// function seleksi kondisi untuk mengecek status barang
function cekStatusBarang(stok: number): string {
  if (stok <= 0) {
    return "Habis";
  } else if (stok <= BATAS_STOK_MENIPIS) {
    return "Menipis";
  } else {
  return "Tersedia";
  }
}

// function untuk membuat ID barang baru secara otomatis (BRG01, BRG02, dst)
function buatIdBaru(daftarBarang: Barang[]): string {
  let terbesar: number = 0;
  for (const b of daftarBarang) {
    const Angka: number = Number(b.id.substring(3));
    if (!isNaN(Angka) && Angka > terbesar) {
      terbesar = Angka;
    }
  }
  const berikutnya: number = terbesar + 1;
  return `BRG${berikutnya < 10 ? "0" : ""}${berikutnya}`;
}

// function untuk menampilkan daftar barang yang stoknya menipis atau habis
function tampilkanDaftarBarangMenipis(daftarBarang: Barang[]): void {
  console.log("\n Daftar STOK BARANG MENIPIS / HABIS");
  let adaYangMenipis: boolean = false;

  for (let i: number = 0; i < daftarBarang.length; i++) {
    const b: Barang = daftarBarang[i]!;
    if (b.stok <= BATAS_STOK_MENIPIS) {
      adaYangMenipis = true;
      const status: string = cekStatusBarang(b.stok);
      console.log('${i + 1}. [${b.kode}] ${b.nama} (${b.satuan}) - Rp ${b.harga} - Stok: ${b.stok} - Status: ${status}');
    }
  }

  if (!adaYangMenipis) {
    console.log("Semua stok tersedia/aman.");
  }
}

// Function untuk mencari barang berdasarkan kode menggunakan loop for
function cariBarangByKode(daftarBarang: Barang[], kode: string): Barang | null {
  const kodeBersih: string = kode.trim().toUpperCase();
  for (let i: number = 0; i < daftarBarang.length; i++) {
    if (daftarBarang[i]!.id === kodeBersih) {
      return daftarBarang[i]!;
    }
  }
  return null;
}

// Function untuk mendaftarkan barang baru ke dalam array stok
function tambahBarangBaru(
  daftarBarang: Barang[],
  kode: string,
  nama: string,
  satuan: string,
  hargaEceran: number,
  hargaGrosir: number,
  minGrosir: number,
  stokAwal: number
): boolean {
  const kodeBersih: string = kode.trim().toUpperCase();
  const namaBersih: string = nama.trim();

  // Validasi menggunakan operator logika (||) dan perbandingan
  if (kodeBersih === "" || namaBersih === "") {
    console.log("[!] Kode dan nama barang tidak boleh kosong.");
    return false;
  }

  if (cariBarangByKode(daftarBarang, kodeBersih) !== null) {
    console.log("[!] Kode barang sudah terdaftar.");
    return false;
  }

  if (hargaEceran <= 0 || hargaGrosir <= 0 || minGrosir < 1 || stokAwal < 0) {
    console.log("[!] Harga harus > 0, minimal grosir >= 1, dan stok >= 0.");
    return false;
  }

  if (hargaGrosir > hargaEceran) {
    console.log("[!] Harga grosir tidak boleh lebih mahal dari harga eceran.");
    return false;
  }

  const barangBaru: Barang = {
    id: kodeBersih,
    nama: namaBersih,
    kategori: "Umum",
    satuan: satuan.trim() === "" ? "Pcs" : satuan.trim(),
    hargaSatuan: hargaEceran,
    hargaGrosir: hargaGrosir,
    minGrosir: minGrosir,
    stok: stokAwal,
    tersedia: stokAwal > 0,
  };

  daftarBarang.push(barangBaru);
  console.log(`[OK] Barang baru '${barangBaru.nama}' berhasil ditambahkan.`);
  return true;
}

//function seleksi kondisi untuk menentukan harga grosir atau ecera
function tentukanHargaBarang(barang: Barang, jumlahBeli: number): number {
  if (jumlahBeli >= (barang.minGrosir ?? Infinity) && barang.hargaGrosir !== undefined) {
    return barang.hargaGrosir;
  } else {
    return barang.hargaSatuan ?? barang.hargaGrosir ?? 0;
  }
}

//Function Hitung Subtotal Belanja
function hitungSubtotal(hargaSatuan : number, JumlahBeli : number): number {
  return hargaSatuan * JumlahBeli;
}

//Function  Menghitung Nominal Diskon (Kondisi dan Operator Logika)
function hitungDiskon(totalBelanja: number, isMember: boolean): number {
  let persenDiskon: number = 0;

  if (totalBelanja >= 1000000) {
    persenDiskon = PERSEN_DISKON_BESAR
  } else if (totalBelanja >= 500000) {
    persenDiskon = PERSEN_DISKON_SEDANG
  }
  if (isMember && totalBelanja > 0) {
    persenDiskon += PERSEN_DISKON_MEMBER;
  }
const nominalDiskon: number = Math.floor(totalBelanja * persenDiskon);
return nominalDiskon;
}

//Function Hitung Uang Kembalian
function hitungKembalian(totalBayar: number, uangDibayar: number): number {
  return uangDibayar - totalBayar;
}

// Function mengurangi stok barang setelah transaksi
function kurangiStok(barang: Barang, jumlahBeli: number): void {
barang.stok -= jumlahBeli;
if (barang.stok <= 0) {
barang.tersedia = false;
}
}

//Function membaca input angka bulat + Validasi input
function inputAngka(pertanyaan: string, minimal :number): number {
  while (true) {
    const teks: string = readline.question(pertanyaan);
    const angka: number = Number(teks);
    if (teks !== "" && !isNaN(angka) && Number.isInteger(angka) && angka >= minimal) {
      return angka;
    } 
    console.log(`[!] Masukkan angka bulat minimal ${minimal}`);
  }
}


// Function alur transaksi kasir
function prosesKasir(daftarBarang: Barang[]): void {
  const keranjang: ItemBelanja[] = [];
  let tambahLagi: boolean = true;
  while (tambahLagi) {
    tampilkanDaftarBarangMenipis(daftarBarang);
    const kodeInput: string = readline
    .question("Masukkan Kode Barang (atau '0' untuk selesai): ")
    .trim();
      if (kodeInput === "0") {
      break;
      }
      const barang: Barang | null = cariBarangByKode(daftarBarang, kodeInput);
      if (barang === null) {
      console.log("[!] Barang tidak ditemukan.");
      continue;
      } 
      if (barang.stok <= 0) {
      console.log("[!] Stok barang sedang habis.");
      continue;
      }
      const jumlahBeli: number = inputAngka(`Jumlah beli (maks ${barang.stok}): `, 1);
      if (jumlahBeli > barang.stok) {
      console.log("[!] Jumlah beli melebihi stok yang tersedia.");
      continue;
      }

// Menentukan harga satuan (grosir atau eceran) dan menghitung subtotal
const hargaEceran: number = tentukanHargaBarang(barang, jumlahBeli);
const keteranganHarga: string =
  barang.minGrosir !== undefined && jumlahBeli >= barang.minGrosir && barang.hargaGrosir !== undefined
    ? "Grosir"
    : "Eceran";
const subtotal: number = hitungSubtotal(hargaEceran, jumlahBeli);

// Kurangi stok barang dan masukkan ke keranjang
kurangiStok(barang, jumlahBeli);
keranjang.push({
  idbarang: barang.id,
  nama: barang.nama,
  jumlah: jumlahBeli,
  hargaSatuan: hargaEceran,
  keteranganHarga: keteranganHarga,
  subtotal: subtotal
});
  console.log(
    `[+] Ditambahkan: ${barang.nama} x${jumlahBeli} (${keteranganHarga}) = Rp${subtotal}`
    );
  const jawabLanjut: string = readline
  .question("Tambah barang lain? (y/n): ")
  .trim()
  .toLowerCase();
    if (jawabLanjut !== "y") {
    tambahLagi = false;
  }
}
  if (keranjang.length === 0) {
  console.log("[!] Transaksi dibatalkan karena keranjang kosong.");
  return;
}

// Hitung total belanja menggunakan loop for
let totalKotor: number = 0;
  for (let i: number = 0; i < keranjang.length; i++) {
  totalKotor += keranjang[i]!.subtotal;
}

  const jawabMember: string = readline
  .question("Apakah pembeli member grosir? (y/n): ")
  .trim()
  .toLowerCase();
  const isMember: boolean = jawabMember === "y";
  const diskon: number = hitungDiskon(totalKotor, isMember);
  const totalBayar: number = totalKotor - diskon;
    console.log(`\nTotal Belanja : Rp${totalKotor}`);
    console.log(`Diskon : Rp${diskon}`);
    console.log(`Total Tagihan : Rp${totalBayar}`);
  let uangDiterima: number = inputAngka("Masukkan Uang Bayar (Rp): ", 0);
  while (uangDiterima < totalBayar) {
  console.log(`[!] Uang kurang Rp${totalBayar - uangDiterima}. Silakan masukkan lagi.`);
  uangDiterima = inputAngka("Masukkan Uang Bayar (Rp): ", 0);
}
  const kembalian: number = hitungKembalian(totalBayar, uangDiterima);

// Cetak struk 
console.log("\n=== STRUK TRANSAKSI TOKO GROSIR ===");
for (let i: number = 0; i < keranjang.length; i++) {
const item: ItemBelanja = keranjang[i]!;
console.log(
`${i + 1}. ${item.nama} (${item.keteranganHarga}) | ` +
`${item.jumlah} x Rp${item.hargaSatuan} = Rp${item.subtotal}`
);
}
console.log("-----------------------------------");
console.log(`Total Kotor : Rp${totalKotor}`);
console.log(`Diskon : Rp${diskon}`);
console.log(`Total Bayar : Rp${totalBayar}`);
console.log(`Uang Diterima : Rp${uangDiterima}`);
console.log(`Kembalian : Rp${kembalian}`);
console.log("===================================");
}

// ===== FITUR CRUD (Create, Read, Update, Delete) & SEARCH =====
// Function Create (menu 1): input data barang baru dari pengguna
function tambahData(daftarBarang: Barang[]): void {
  console.log("\n--- TAMBAH BARANG BARU ---");
  const nama: string = readline.question("Nama Barang: ");
  const kategori: string = readline.question("Kategori (Sembako/Makanan Instan/dll): ");
  const satuan: string = readline.question("Satuan (Karung/Dus/Bal/Pcs): ");
  const hargaSatuan: number = inputAngka("Harga Satuan/Eceran (Rp): ", 1);
  const hargaGrosir: number = inputAngka("Harga Grosir (Rp): ", 1);
  const minGrosir: number = inputAngka("Minimal Beli Grosir: ", 1);
  const stokAwal: number = inputAngka("Stok Awal: ", 0);
  tambahBarangBaru(daftarBarang, nama, kategori, satuan, hargaSatuan, hargaGrosir, minGrosir, stokAwal);
}

// Function Read (menu 2): tampilkan seluruh barang, jumlah stok, pendapatan, dan detail berdasarkan ID
function bacaData(daftarBarang: Barang[]): void {
  tampilkanDaftarBarang(daftarBarang);
  if (daftarBarang.length === 0) {
    return;
  }
  tampilkanDaftarBarangMenipis(daftarBarang);

  let jumlahStok: number = 0;
  for (let i: number = 0; i < daftarBarang.length; i++) {
    jumlahStok += daftarBarang[i]!.stok;
  }
  console.log(`\nJumlah Jenis Barang : ${daftarBarang.length}`);
  console.log(`Jumlah Seluruh Stok : ${jumlahStok}`);
  console.log(`Total Pendapatan    : ${formatRupiah(totalPendapatan)}`);

  const id: string = readline.question("\nMasukkan ID Barang untuk lihat detail (kosongkan untuk lewati): ");
  if (id.trim() === "") {
    return;
  }
  const barang: Barang | null = cariBarangById(daftarBarang, id);
  if (barang !== null) {
    tampilkanDetailBarang(barang);
  } else {
    console.log("[!] Barang tidak ditemukan.");
  }
}

// Function Update (menu 3): ubah harga, tambah stok, atau kurangi stok
function ubahData(daftarBarang: Barang[]): void {
  tampilkanDaftarBarang(daftarBarang);
  const id: string = readline.question("Masukkan ID Barang yang akan diubah: ");
  const barang: Barang | null = cariBarangById(daftarBarang, id);
  if (barang === null) {
    console.log("[!] Barang tidak ditemukan.");
    return;
  }
  console.log(`Barang: ${barang.nama} | Harga: ${formatRupiah(barang.hargaSatuan)} | Stok saat ini: ${barang.stok}`);
  console.log("1. Ubah harga satuan");
  console.log("2. Tambah stok");
  console.log("3. Kurangi stok");
  const pilihan: string = readline.question("Pilih (1-3): ").trim();

  if (pilihan === "1") {
    const hargaBaru: number = inputAngka("Harga satuan baru (Rp): ", 1);
    if (hargaBaru < barang.hargaGrosir) {
      console.log("[!] Harga satuan tidak boleh lebih murah dari harga grosir.");
    } else {
      barang.hargaSatuan = hargaBaru;
      console.log(`[OK] Harga '${barang.nama}' berhasil diubah menjadi ${formatRupiah(barang.hargaSatuan)}.`);
    }
  } else if (pilihan === "2") {
    const jumlah: number = inputAngka("Jumlah stok yang ditambah: ", 1);
    barang.stok += jumlah;
    console.log(`[OK] Stok '${barang.nama}' bertambah. Stok sekarang: ${barang.stok}`);
  } else if (pilihan === "3") {
    const jumlah: number = inputAngka("Jumlah stok yang dikurangi: ", 1);
    if (jumlah > barang.stok) {
      console.log("[!] Pengurangan melebihi stok yang ada.");
    } else {
      barang.stok -= jumlah;
      console.log(`[OK] Stok '${barang.nama}' berkurang. Stok sekarang: ${barang.stok}`);
    }
  } else {
    console.log("[!] Pilihan tidak valid, perubahan dibatalkan.");
  }
}

// Function Delete (menu 4): hapus barang dengan konfirmasi (nested if 3 tingkat + splice)
function hapusData(daftarBarang: Barang[]): void {
  tampilkanDaftarBarang(daftarBarang);
  const id: string = readline.question("Masukkan ID Barang yang akan dihapus: ");
  const index: number = cariIndexById(daftarBarang, id);

  if (index === -1) {
    console.log("[!] Barang tidak ditemukan.");
    return;
  }

  const barang: Barang = daftarBarang[index]!;
  tampilkanDetailBarang(barang);
  const yakin: string = readline.question("Yakin ingin menghapus barang ini? (y/n): ").trim().toLowerCase();
  let lanjutHapus: boolean = false;

  if (yakin === "y") {
    if (barang.stok > 0) {
      const yakinLagi: string = readline
        .question(`Barang masih memiliki stok ${barang.stok}. Tetap hapus? (y/n): `)
        .trim()
        .toLowerCase();
      if (yakinLagi === "y") {
        lanjutHapus = true;
      } else {
        console.log("[!] Penghapusan dibatalkan.");
      }
    } else {
      lanjutHapus = true;
    }
  } else {
    console.log("[!] Penghapusan dibatalkan.");
  }

  if (lanjutHapus) {
    daftarBarang.splice(index, 1);
    console.log(`[OK] Barang '${barang.nama}' berhasil dihapus.`);
  }
}

// Function Search (menu 5): cari barang berdasarkan kata kunci + filter tambahan stok tersedia
function cariData(daftarBarang: Barang[]): void {
  const kataKunci: string = readline.question("Masukkan kata kunci (ID / nama / kategori): ").trim();
  if (kataKunci === "") {
    console.log("[!] Kata kunci tidak boleh kosong.");
    return;
  }
  const filterStok: string = readline
    .question("Hanya tampilkan barang yang stoknya tersedia? (y/n): ")
    .trim()
    .toLowerCase();
  const hasil: Barang[] = cariBarang(daftarBarang, kataKunci, filterStok === "y");

  console.log(`\n Hasil pencarian '${kataKunci}': ${hasil.length} barang ditemukan`);
  if (hasil.length === 0) {
    console.log("[!] Tidak ada barang yang cocok.");
    return;
  }
  hasil.forEach((b: Barang, i: number): void => {
    cetakBarisBarang(b, i + 1);
  });
}

// Function Simulasi Harga per dus (menu 7) - operator %, *=, /=, -=
function simulasiHarga(): void {
  console.log(`\n=== SIMULASI HARGA DUS (isi ${ISI_PER_DUS} pcs, diskon dus ${PERSEN_DISKON_DUS * 100}%) ===`);
  const hargaSatuan: number = inputAngka("Harga per pcs (Rp): ", 1);
  const jumlahPcs: number = inputAngka("Jumlah pcs yang dibeli: ", 1);

  const jumlahDus: number = Math.floor(jumlahPcs / ISI_PER_DUS);
  const sisaPcs: number = jumlahPcs % ISI_PER_DUS;

  let hargaPerDus: number = hargaSatuan;
  hargaPerDus *= ISI_PER_DUS;
  hargaPerDus -= Math.round(hargaPerDus * PERSEN_DISKON_DUS);

  const totalHarga: number = hargaPerDus * jumlahDus + hargaSatuan * sisaPcs;
  let rataRataPerPcs: number = totalHarga;
  rataRataPerPcs /= jumlahPcs;

  console.log(`Jumlah dus penuh     : ${jumlahDus}`);
  console.log(`Sisa pcs (eceran)    : ${sisaPcs}`);
  console.log(`Harga per dus        : ${formatRupiah(hargaPerDus)}`);
  console.log(`Total harga          : ${formatRupiah(totalHarga)}`);
  console.log(`Rata-rata per pcs    : ${formatRupiah(Math.round(rataRataPerPcs))}`);
}

// Function alur transaksi kasir (menu 6)
function transaksiKasir(daftarBarang: Barang[]): void {
  const keranjang: ItemBelanja[] = [];
  let tambahLagi: boolean = true;

  while (tambahLagi) {
    tampilkanDaftarBarang(daftarBarang);
    const idInput: string = readline
      .question("Masukkan ID Barang (atau '0' untuk selesai): ")
      .trim();
    if (idInput === "0") {
      break;
    }
    const barang: Barang | null = cariBarangById(daftarBarang, idInput);
    if (barang === null) {
      console.log("[!] Barang tidak ditemukan.");
      continue;
    }
    if (barang.stok <= 0) {
      console.log("[!] Stok barang sedang habis.");
      continue;
    }
    const jumlahBeli: number = inputAngka(`Jumlah beli (maks ${barang.stok}): `, 1);
    if (jumlahBeli > barang.stok) {
      console.log("[!] Jumlah beli melebihi stok yang tersedia.");
      continue;
    }

    // Menentukan harga satuan (grosir atau eceran) dan menghitung subtotal
    const hargaSatuan: number = tentukanHargaBarang(barang, jumlahBeli);
    const keteranganHarga: string = jumlahBeli >= barang.minGrosir ? "Grosir" : "Eceran";
    const subtotal: number = hitungSubtotal(hargaSatuan, jumlahBeli);

    // Kurangi stok barang dan masukkan ke keranjang
    kurangiStok(barang, jumlahBeli);
    keranjang.push({
      idBarang: barang.id,
      nama: barang.nama,
      jumlah: jumlahBeli,
      hargaSatuan: hargaSatuan,
      keteranganHarga: keteranganHarga,
      subtotal: subtotal,
    });
    console.log(`[+] Ditambahkan: ${barang.nama} x${jumlahBeli} (${keteranganHarga}) = ${formatRupiah(subtotal)}`);

    const jawabLanjut: string = readline.question("Tambah barang lain? (y/n): ").trim().toLowerCase();
    if (jawabLanjut !== "y") {
      tambahLagi = false;
    }
  }

  if (keranjang.length === 0) {
    console.log("[!] Transaksi dibatalkan karena keranjang kosong.");
    return;
  }

  // Hitung total belanja menggunakan loop for...of
  let totalKotor: number = 0;
  for (const item of keranjang) {
    totalKotor += item.subtotal;
  }

  const jawabMember: string = readline.question("Apakah pembeli member grosir? (y/n): ").trim().toLowerCase();
  const isMember: boolean = jawabMember === "y";
  const diskon: number = hitungDiskon(totalKotor, isMember);
  const totalBayar: number = totalKotor - diskon;
  console.log(`\nTotal Belanja : ${formatRupiah(totalKotor)}`);
  console.log(`Diskon        : ${formatRupiah(diskon)}`);
  console.log(`Total Tagihan : ${formatRupiah(totalBayar)}`);

  // Pembayaran menggunakan do...while sampai uang cukup
  let uangDiterima: number;
  do {
    uangDiterima = inputAngka("Masukkan Uang Bayar (Rp): ", 0);
    if (uangDiterima < totalBayar) {
      console.log(`[!] Uang kurang ${formatRupiah(totalBayar - uangDiterima)}. Silakan masukkan lagi.`);
    }
  } while (uangDiterima < totalBayar);
  const kembalian: number = hitungKembalian(totalBayar, uangDiterima);
  totalPendapatan += totalBayar;

  // Cetak struk
  console.log(`\n=== STRUK TRANSAKSI ${NAMA_TOKO} ===`);
  for (let i: number = 0; i < keranjang.length; i++) {
    const item: ItemBelanja = keranjang[i]!;
    console.log(
      `${i + 1}. ${item.nama} (${item.keteranganHarga}) | ` +
        `${item.jumlah} x ${formatRupiah(item.hargaSatuan)} = ${formatRupiah(item.subtotal)}`
    );
  }
  console.log("-----------------------------------");
  console.log(`Total Kotor   : ${formatRupiah(totalKotor)}`);
  console.log(`Diskon        : ${formatRupiah(diskon)}`);
  console.log(`Total Bayar   : ${formatRupiah(totalBayar)}`);
  console.log(`Uang Diterima : ${formatRupiah(uangDiterima)}`);
  console.log(`Kembalian     : ${formatRupiah(kembalian)}`);
  console.log("===================================");
}



//==========================
// PROGRAM UTAMA & MENU (LOOP WHILE)
//==========================

function main(): void {
  console.log("\nSelamat datang di TOKO GROSIR SUMBER REJEKI");

  // Penanda menu terus berulang sampai pengguna memilih keluar
  let berjalan: boolean = true;

  while (berjalan) {
    console.log("\n=================================");
    console.log("APLIKASI KASIR & MANAJEMEN STOK TOKO GROSIR");
    console.log("=================================");
    console.log("1. Tampilkan Daftar Barang");
    console.log("2. Tampilkan Daftar Barang Menipis/Habis");
    console.log("3. Tambah Stok Barang Lama");
    console.log("4. Tambah Barang Baru");
    console.log("5. Transaksi Kasir");
    console.log("0. Keluar");

    // Membaca pilihan menu dari pengguna
    const pilihan: string = readline.question("Pilih menu (0-5): ").trim();

    // Proses pilihan menu (seleksi kondisi)
    if (pilihan === "1") {
      tampilkanDaftarBarangMenipis(daftarBarang);
    } else if (pilihan === "2") {
      tampilkanDaftarBarangMenipis(daftarBarang);
    } else if (pilihan === "3") {
      tampilkanDaftarBarangMenipis(daftarBarang);
      const kode: string = readline.question("Masukkan Kode Barang: ");
      const jumlah: number = inputAngka("Jumlah stok masuk: ", 1);
      const barang: Barang | null = cariBarangByKode(daftarBarang, kode);
      if (barang !== null) {
        barang.stok += jumlah;
        barang.tersedia = true;
        console.log(`[OK] Stok '${barang.nama}' berhasil ditambah. Stok sekarang: ${barang.stok}`);
      } else {
        console.log("[!] Barang tidak ditemukan.");
      }
    } else if (pilihan === "4") {
      const kode: string = readline.question("Kode Barang Baru: ");
      const nama: string = readline.question("Nama Barang: ");
      const satuan: string = readline.question("Satuan (Karung/Dus/Bal/Pcs): ");
      const hargaEceran: number = inputAngka("Harga Eceran (Rp): ", 1);
      const hargaGrosir: number = inputAngka("Harga Grosir (Rp): ", 1);
      const minGrosir: number = inputAngka("Minimal Beli Grosir: ", 1);
      const stokAwal: number = inputAngka("Stok Awal: ", 0);
      tambahBarangBaru(daftarBarang, kode, nama, satuan, hargaEceran, hargaGrosir, minGrosir, stokAwal);
    } else if (pilihan === "5") {
      prosesKasir(daftarBarang);
    } else if (pilihan === "0") {
      console.log("Terima kasih. Program selesai.");
      berjalan = false;
    } else {
      console.log("[!] Menu tidak tersedia, silakan pilih 0-5.");
    }
  }   // penutup while
}     // penutup main

main(); // panggil main agar program berjalan
