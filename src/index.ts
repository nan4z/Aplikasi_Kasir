// Aplikasi Kasir dan Manajemen Stok Toko Grosir
import * as readline from "readline-sync";

// ===== TIPE DATA =====
interface Barang {
  id: string;
  nama: string;
  kategori: string;
  satuan: string;
  hargaSatuan: number; // harga eceran
  hargaGrosir: number;
  minGrosir: number; // minimal jumlah beli agar memakai harga grosir
  stok: number;
}

interface ItemBelanja {
  idBarang: string;
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
const PERSEN_DISKON_MEMBER: number = 0.02; // 2% diskon untuk member
const PERSEN_DISKON_DUS: number = 0.05; // 5% diskon untuk pembelian per dus (simulasi harga)

const daftarBarang: Barang[] = buatDataStokAwal();
let totalPendapatan: number = 0;
let aplikasiBerjalan: boolean = true;

// ===========================
// KUMPULAN FUNCTION
// ===========================

// FUNCTION untuk membuat data stok awal toko grosir
function buatDataStokAwal(): Barang[] {
  const data: Barang[] = [
    {
      id: "BRG01",
      nama: "Beras 5kg",
      kategori: "Sembako",
      satuan: "karung",
      hargaSatuan: 68000,
      hargaGrosir: 65000,
      minGrosir: 5,
      stok: 40,
    },
    {
      id: "BRG02",
      nama: "Minyak Goreng 1L",
      kategori: "Sembako",
      satuan: "botol",
      hargaSatuan: 18000,
      hargaGrosir: 17000,
      minGrosir: 12,
      stok: 60,
    },
    {
      id: "BRG03",
      nama: "Gula Pasir 1kg",
      kategori: "Sembako",
      satuan: "kg",
      hargaSatuan: 19000,
      hargaGrosir: 18000,
      minGrosir: 10,
      stok: 10,
    },
    {
      id: "BRG04",
      nama: "MIE INSTANT 1 dus isi 36",
      kategori: "Makanan Instan",
      satuan: "dus",
      hargaSatuan: 45000,
      hargaGrosir: 43000,
      minGrosir: 5,
      stok: 20,
    },
  ];
  return data;
}

// function untuk mengubah angka menjadi format rupiah, contoh: 68000 -> Rp68.000
function formatRupiah(angka: number): string {
  return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

// function untuk membuat ID barang baru secara otomatis (BRG01, BRG02, ...)
function buatIdBaru(daftarBarang: Barang[]): string {
  let terbesar: number = 0;
  for (const b of daftarBarang) {
    const angka: number = Number(b.id.slice(3));
    if (!isNaN(angka) && angka > terbesar) {
      terbesar = angka;
    }
  }
  const berikutnya: number = terbesar + 1;
  return `BRG${berikutnya < 10 ? "0" : ""}${berikutnya}`;
}

// function untuk mencetak satu baris data barang
function cetakBarisBarang(b: Barang, nomor: number): void {
  const status: string = cekStatusBarang(b.stok);
  console.log(
    `${nomor}. [${b.id}] ${b.nama} | ${b.kategori} (${b.satuan}) - ${formatRupiah(b.hargaSatuan)} - Stok: ${b.stok} - Status: ${status}`
  );
}

// function untuk menampilkan seluruh daftar barang menggunakan loop for
function tampilkanDaftarBarang(daftarBarang: Barang[]): void {
  console.log("\n Daftar STOK BARANG TOKO GROSIR");
  if (daftarBarang.length === 0) {
    console.log("[!] Belum ada data barang yang tersimpan.");
    return;
  }
  for (let i: number = 0; i < daftarBarang.length; i++) {
    cetakBarisBarang(daftarBarang[i]!, i + 1);
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
      cetakBarisBarang(b, i + 1);
    }
  }

  if (!adaYangMenipis) {
    console.log("Semua stok tersedia/aman.");
  }
}

// function untuk menampilkan detail satu barang
function tampilkanDetailBarang(b: Barang): void {
  console.log("\n--- DETAIL BARANG ---");
  console.log(`ID            : ${b.id}`);
  console.log(`Nama          : ${b.nama}`);
  console.log(`Kategori      : ${b.kategori}`);
  console.log(`Satuan        : ${b.satuan}`);
  console.log(`Harga Satuan  : ${formatRupiah(b.hargaSatuan)}`);
  console.log(`Harga Grosir  : ${formatRupiah(b.hargaGrosir)} (min. beli ${b.minGrosir})`);
  console.log(`Stok          : ${b.stok} (${cekStatusBarang(b.stok)})`);
}

// Function untuk mencari barang berdasarkan ID menggunakan find()
function cariBarangById(daftarBarang: Barang[], id: string): Barang | null {
  const idBersih: string = id.trim().toUpperCase();
  const hasil: Barang | undefined = daftarBarang.find(
    (b: Barang): boolean => b.id === idBersih
  );
  return hasil ?? null;
}

// Function untuk mencari posisi (index) barang berdasarkan ID menggunakan findIndex()
function cariIndexById(daftarBarang: Barang[], id: string): number {
  const idBersih: string = id.trim().toUpperCase();
  return daftarBarang.findIndex((b: Barang): boolean => b.id === idBersih);
}

// Function mencari barang berdasarkan kata kunci (ID / nama / kategori) menggunakan filter()
function cariBarang(daftarBarang: Barang[], kataKunci: string, hanyaTersedia: boolean): Barang[] {
  const kunci: string = kataKunci.trim().toLowerCase();
  return daftarBarang.filter((b: Barang): boolean => {
    const cocok: boolean =
      b.id.toLowerCase().includes(kunci) ||
      b.nama.toLowerCase().includes(kunci) ||
      b.kategori.toLowerCase().includes(kunci);
    return cocok && (!hanyaTersedia || b.stok > 0);
  });
}

// Function untuk mendaftarkan barang baru ke dalam array stok (ID dibuat otomatis)
function tambahBarangBaru(
  daftarBarang: Barang[],
  nama: string,
  kategori: string,
  satuan: string,
  hargaSatuan: number,
  hargaGrosir: number,
  minGrosir: number,
  stokAwal: number
): boolean {
  const namaBersih: string = nama.trim();
  const kategoriBersih: string = kategori.trim();
  const satuanBersih: string = satuan.trim();

  // Validasi menggunakan operator logika (||) dan perbandingan
  if (namaBersih === "" || kategoriBersih === "" || satuanBersih === "") {
    console.log("[!] Nama, kategori, dan satuan barang tidak boleh kosong.");
    return false;
  }

  if (hargaSatuan <= 0 || hargaGrosir <= 0 || minGrosir < 1 || stokAwal < 0) {
    console.log("[!] Harga harus > 0, minimal grosir >= 1, dan stok >= 0.");
    return false;
  }

  if (hargaGrosir > hargaSatuan) {
    console.log("[!] Harga grosir tidak boleh lebih mahal dari harga satuan.");
    return false;
  }

  const barangBaru: Barang = {
    id: buatIdBaru(daftarBarang),
    nama: namaBersih,
    kategori: kategoriBersih,
    satuan: satuanBersih,
    hargaSatuan: hargaSatuan,
    hargaGrosir: hargaGrosir,
    minGrosir: minGrosir,
    stok: stokAwal,
  };

  daftarBarang.push(barangBaru);
  console.log(`[OK] Barang baru '${barangBaru.nama}' berhasil ditambahkan dengan ID ${barangBaru.id}.`);
  return true;
}

// function seleksi kondisi untuk menentukan harga grosir atau eceran
function tentukanHargaBarang(barang: Barang, jumlahBeli: number): number {
  if (jumlahBeli >= barang.minGrosir) {
    return barang.hargaGrosir;
  } else {
    return barang.hargaSatuan;
  }
}

// Function Hitung Subtotal Belanja
function hitungSubtotal(hargaSatuan: number, jumlahBeli: number): number {
  return hargaSatuan * jumlahBeli;
}

// Function Menghitung Nominal Diskon (Kondisi dan Operator Logika)
function hitungDiskon(totalBelanja: number, isMember: boolean): number {
  let persenDiskon: number = 0;

  if (totalBelanja >= 1000000) {
    persenDiskon = PERSEN_DISKON_BESAR;
  } else if (totalBelanja >= 500000) {
    persenDiskon = PERSEN_DISKON_SEDANG;
  }
  if (isMember && totalBelanja > 0) {
    persenDiskon += PERSEN_DISKON_MEMBER;
  }
  const nominalDiskon: number = Math.floor(totalBelanja * persenDiskon);
  return nominalDiskon;
}

// Function Hitung Uang Kembalian
function hitungKembalian(totalBayar: number, uangDibayar: number): number {
  return uangDibayar - totalBayar;
}

// Function mengurangi stok barang setelah transaksi
function kurangiStok(barang: Barang, jumlahBeli: number): void {
  barang.stok -= jumlahBeli;
}

// Function membaca input angka bulat + Validasi input
function inputAngka(pertanyaan: string, minimal: number): number {
  while (true) {
    const teks: string = readline.question(pertanyaan);
    const angka: number = Number(teks);
    if (teks !== "" && !isNaN(angka) && Number.isInteger(angka) && angka >= minimal) {
      return angka;
    }
    console.log(`[!] Masukkan angka bulat minimal ${minimal}`);
  }
}

// ===== FITUR CRUD & SEARCH =====

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

// ==========================
// PROGRAM UTAMA & MENU (LOOP WHILE)
// ==========================

function main(): void {
  console.log(`\nSelamat datang di ${NAMA_TOKO}`);

  // Menu terus berulang sampai pengguna memilih keluar (aplikasiBerjalan = false)
  while (aplikasiBerjalan) {
    console.log("\n=================================");
    console.log("APLIKASI KASIR & MANAJEMEN STOK TOKO GROSIR");
    console.log("=================================");
    console.log("1. Tambah Barang Baru (Create)");
    console.log("2. Tampilkan Daftar & Detail Barang (Read)");
    console.log("3. Ubah Harga / Stok Barang (Update)");
    console.log("4. Hapus Barang (Delete)");
    console.log("5. Cari Barang (Search)");
    console.log("6. Transaksi Kasir");
    console.log("7. Simulasi Harga Dus");
    console.log("0. Keluar");

    // Membaca pilihan menu dari pengguna
    const pilihan: string = readline.question("Pilih menu (0-7): ").trim();

    // Proses pilihan menu (seleksi kondisi switch)
    switch (pilihan) {
      case "1":
        tambahData(daftarBarang);
        break;
      case "2":
        bacaData(daftarBarang);
        break;
      case "3":
        ubahData(daftarBarang);
        break;
      case "4":
        hapusData(daftarBarang);
        break;
      case "5":
        cariData(daftarBarang);
        break;
      case "6":
        transaksiKasir(daftarBarang);
        break;
      case "7":
        simulasiHarga();
        break;
      case "0":
        console.log("Terima kasih. Program selesai.");
        aplikasiBerjalan = false;
        break;
      default:
        console.log("[!] Menu tidak tersedia, silakan pilih 0-7.");
    }
  } // penutup while
} // penutup main

main(); // panggil main agar program berjalan