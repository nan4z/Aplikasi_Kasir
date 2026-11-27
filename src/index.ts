// Aplikasi Kasir dan Manajemen Stok Toko Grosir
import * as readline from "readline-sync";

// ===== TIPE DATA =====
interface Barang {
  kode: string;
  nama: string;
  satuan: string;
  harga: number;
  stok: number;
  tersedia: boolean;
}

interface ItemBelanja {
  kode: string;
  nama: string;
  harga: number;
  jumlah: number;
}

// ===== VARIABEL & KONSTANTA =====
const NAMA_TOKO: string = "TOKO GROSIR SUMBER REJEKI";
const BATAS_STOK_MENIPIS: number = 10;
const ISI_PER_DUS: number = 12;
<<<<<<< Updated upstream
const PERSEN_DISKON_BESAR: number = 0.05; // 5% diskon jika total >= 1.000.000
const PERSEN_DISKON_SEDANG: number = 0.05; // 5% diskon jika total >= 500.000
const PERSEN_DISKON_MEMBER: number = 0.02; // 2% diskon jika total >= 100.000
const daftarBarang: Barang[] = buatDataStokAwal();
 
// ===========================
// KUMPULAN FUNCTION
// ===========================

// FUNCTION untuk membuat data stok awal toko grosir
function buatDataStokAwal(): Barang[] {
  const daftarBarang: Barang[] = [
    {
      kode: "BRG01",
      nama: "Beras 5kg",
      satuan: "karung",
      harga: 68000,
      stok: 40,
      tersedia: true
    },
    {
      kode: "BRG02",
      nama: "Minyak Goreng 1L",
      satuan: "botol",
      harga: 18000,
      stok: 60,
      tersedia: true
    },
    {
      kode: "BRG03",
      nama: "Gula Pasir 1kg",
      satuan: "kg",
      harga: 19000,
      stok: 10,
      tersedia: true
    },
    {
      kode: "BRG04",
      nama: "MIE INSTANT 1 dus isi 36",
      satuan: "dus",
      harga: 45000,
      stok: 20,
      tersedia: true
    }
  ];
  return daftarBarang;
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

// function menampilkan untuk menampilkan seluruh daftar barang menggunakan loop for
function tampilkanDaftarBarang(daftarBarang: Barang[]): void {
  console.log ("\n Daftar STOK BARANG TOKO GROSIR");
  for (let i : number = 0; i < daftarBarang.length; i++) {
    const b: Barang = daftarBarang[i]!;
    const status : string = cekStatusBarang(b.stok);
    console.log( '${i + 1}. [${b.kode}] ${b.nama} (${b.satuan}) - Rp ${b.harga} - Stok: ${b.stok} - Status: ${status}');
  }
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

//
=======
const daftarBarang: Barang[] = [
  { kode: "B01", nama: "Beras 5kg", harga: 68000, stok: 40, tersedia: true },
  { kode: "B02", nama: "Minyak Goreng 1L", harga: 18000, stok: 60, tersedia: true },
  { kode: "B03", nama: "Gula Pasir 1kg", harga: 17000, stok: 8, tersedia: true },
];
let totalPendapatan: number = 0;
let aplikasiBerjalan: boolean = true;  
>>>>>>> Stashed changes
