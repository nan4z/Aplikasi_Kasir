import * as readline from "readline-sync";

<<<<<<< HEAD
for (let i = 0; i < 10; i++) {
console.log(`${a} + ${b} = ${s}`);
console.log(`${s} + ${g} = ${s + g}`);

// Feature : search data


}
=======
// ===== TIPE DATA =====
interface Barang {
    kode: string;
    nama: string;
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
const daftarBarang: Barang[] = [
  { kode: "B01", nama: "Beras 5kg", harga: 68000, stok: 40, tersedia: true },
  { kode: "B02", nama: "Minyak Goreng 1L", harga: 18000, stok: 60, tersedia: true },
  { kode: "B03", nama: "Gula Pasir 1kg", harga: 17000, stok: 8, tersedia: true },
];
let totalPendapatan: number = 0;
let aplikasiBerjalan: boolean = true;
>>>>>>> feature/update-data
