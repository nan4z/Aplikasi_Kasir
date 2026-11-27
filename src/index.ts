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