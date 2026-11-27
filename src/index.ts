// Aplikasi Kasir dan Manajemen Stok Toko Grosir
import * as readline from "readline-sync";

// ===== TIPE DATA =====
interface Barang {
  kode: string;
  nama: string;
  satuan: string;
  harga: number;
  hargaEceran?: number;
  hargaGrosir?: number;
  minGrosir?: number;
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

// Function untuk mencari barang berdasarkan kode menggunakan loop for
function cariBarangByKode(daftarBarang: Barang[], kode: string): Barang | null {
  const kodeBersih: string = kode.trim().toUpperCase();
  for (let i: number = 0; i < daftarBarang.length; i++) {
    if (daftarBarang[i]!.kode === kodeBersih) {
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
    kode: kodeBersih,
    nama: namaBersih,
    satuan: satuan.trim() === "" ? "Pcs" : satuan.trim(),
    harga: hargaEceran,
    hargaEceran: hargaEceran,
    hargaGrosir: hargaGrosir,
    minGrosir: minGrosir,
    stok: stokAwal,
    tersedia: stokAwal > 0,
  };

  daftarBarang.push(barangBaru);
  console.log(`[OK] Barang baru '${barangBaru.nama}' berhasil ditambahkan.`);
  return true;
}