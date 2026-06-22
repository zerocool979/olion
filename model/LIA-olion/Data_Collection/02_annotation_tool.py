"""
02_annotation_tool.py
=====================================================================
Tool anotasi MANUAL berbasis command-line untuk melabeli unggahan hasil
01_scraper_x_phq9.py ke 4 kelas tingkat keparahan, konsisten dengan:

  - 03_Proposal_Penelitian.md §5 (Batasan Masalah — label hasil anotasi
    manual oleh annotator, BUKAN otomatis/berbasis kata kunci semata)
  - 03_Proposal_Penelitian.md §6/§7 (4 kelas ordinal: Tidak Ada/Ringan/
    Sedang/Berat, sebagai variabel label hasil anotasi)
  - 04_Desain_Eksperimen.md §4 (≥2 annotator terlatih + Cohen's Kappa)

⚠️  CATATAN KESEJAHTERAAN ANNOTATOR:
Sebagian konten yang dianotasi berpotensi berisi ekspresi tekanan
emosional, termasuk indikasi ide bunuh diri (item ke-9 PHQ-9). Annotator
dianjurkan untuk:
  - Beristirahat berkala (tool ini menyimpan progres secara inkremental
    sehingga sesi anotasi dapat dijeda kapan saja dengan menekan 'q').
  - TIDAK mencoba menghubungi/mengidentifikasi penulis unggahan asli —
    tugas ini adalah penelitian pola linguistik agregat, bukan
    intervensi individu.
  - Mengikuti protokol etik institusi (komite etik/IRB) terkait
    penanganan ditemukan konten berisiko tinggi.
  - Jika anotator sendiri merasa terdampak secara emosional oleh
    konten yang dianotasi, dianjurkan untuk berbicara dengan rekan/
    supervisor riset atau layanan dukungan kesehatan mental institusi.

Cara pakai:
    python 02_annotation_tool.py --input raw_scraped_posts.csv \\
        --annotator nama_annotator_1

    # Bisa dijeda & dilanjutkan kapan saja (progres tersimpan otomatis):
    python 02_annotation_tool.py --input raw_scraped_posts.csv \\
        --annotator nama_annotator_1 --resume
=====================================================================
"""

import argparse
import os
import sys

import pandas as pd

LABELS = ["Tidak Ada", "Ringan", "Sedang", "Berat"]   # HARUS identik dgn notebook (LABELS)
KEY_TO_LABEL = {"0": "Tidak Ada", "1": "Ringan", "2": "Sedang", "3": "Berat"}
CONTENT_WARNING_CATEGORY = "ide_bunuh_diri"

RUBRIK = """
================================================================================
 RUBRIK ANOTASI TINGKAT KEPARAHAN EKSPRESI DEPRESIF (skala per-unggahan)
 (Adaptasi kualitatif dari PHQ-9 untuk teks tunggal — PHQ-9 asli adalah
 instrumen 9-item multi-pertanyaan; adaptasi ini PRAGMATIS untuk konteks
 anotasi teks media sosial dan TIDAK setara dengan diagnosis klinis.)
================================================================================
 [0] Tidak Ada  -> Tidak ada indikasi simtom depresif yang jelas;
                    konten netral/positif/tidak relevan dgn kesehatan mental.
 [1] Ringan     -> Menyebut 1-2 simtom ringan (capek, agak sedih, kurang
                    fokus) TANPA indikasi durasi lama/gangguan fungsi berarti.
 [2] Sedang     -> Menyebut beberapa simtom (>=3) yang tampak berlangsung
                    cukup lama (skala minggu) & mengindikasikan gangguan
                    aktivitas sehari-hari.
 [3] Berat      -> Simtom multipel & intens: keputusasaan mendalam, perasaan
                    tidak berharga ekstrem, dan/atau indikasi ide terkait
                    kematian/menyakiti diri.

 [s] Skip / Ragu-ragu  -> lewati, akan ditinjau ulang/diadjudikasi nanti
 [r] Tampilkan rubrik ini lagi
 [q] Simpan & keluar (progres tersimpan, bisa dilanjutkan dengan --resume)
================================================================================
"""


def load_progress(output_path):
    if os.path.exists(output_path):
        return pd.read_csv(output_path)
    return pd.DataFrame(columns=["tweet_id", "text", "matched_category", "label", "annotator"])


def annotate(input_path, annotator_name, output_dir="."):
    if not os.path.exists(input_path):
        sys.exit(f"❌ File input tidak ditemukan: {input_path}")

    df_raw = pd.read_csv(input_path)
    required_cols = {"tweet_id", "text"}
    if not required_cols.issubset(df_raw.columns):
        sys.exit(f"❌ CSV input harus memiliki kolom: {required_cols}")

    output_path = os.path.join(output_dir, f"annotated_by_{annotator_name}.csv")
    df_done = load_progress(output_path)
    done_ids = set(df_done["tweet_id"].tolist())

    df_todo = df_raw[~df_raw["tweet_id"].isin(done_ids)].reset_index(drop=True)

    print(RUBRIK)
    print(f"Annotator   : {annotator_name}")
    print(f"Total data  : {len(df_raw)} | Sudah dianotasi: {len(done_ids)} | Sisa: {len(df_todo)}")
    print(f"Hasil tersimpan otomatis ke: {output_path}\n")

    results = df_done.to_dict("records")

    for i, row in df_todo.iterrows():
        category = row.get("matched_category", "")
        warning = " ⚠️  [POTENSI KONTEN SENSITIF — ide terkait kematian/menyakiti diri]" if \
            category == CONTENT_WARNING_CATEGORY else ""

        print("-" * 80)
        print(f"[{i + 1}/{len(df_todo)}] (kategori kata kunci: {category}){warning}")
        print(f'Teks: "{row["text"]}"')

        while True:
            choice = input("Label [0/1/2/3 | s=skip | r=rubrik | q=simpan&keluar]: ").strip().lower()
            if choice == "q":
                _save(results, output_path)
                print(f"\n✅ Progres tersimpan ({len(results)} baris). "
                      f"Lanjutkan kapan saja dengan --resume.")
                return
            elif choice == "r":
                print(RUBRIK)
                continue
            elif choice == "s":
                results.append({
                    "tweet_id": row["tweet_id"], "text": row["text"],
                    "matched_category": category, "label": "SKIP", "annotator": annotator_name,
                })
                break
            elif choice in KEY_TO_LABEL:
                results.append({
                    "tweet_id": row["tweet_id"], "text": row["text"],
                    "matched_category": category, "label": KEY_TO_LABEL[choice],
                    "annotator": annotator_name,
                })
                break
            else:
                print("⚠️ Input tidak valid. Gunakan 0/1/2/3/s/r/q.")

        if (i + 1) % 10 == 0:   # simpan progres tiap 10 anotasi (anti data-loss)
            _save(results, output_path)

    _save(results, output_path)
    print(f"\n🎉 Semua data telah dianotasi oleh {annotator_name}! Tersimpan di: {output_path}")
    print_distribution(results)


def _save(results, output_path):
    pd.DataFrame(results).to_csv(output_path, index=False)


def print_distribution(results):
    df = pd.DataFrame(results)
    print("\nDistribusi label hasil anotasi:")
    print(df["label"].value_counts())


def main():
    parser = argparse.ArgumentParser(description="Tool anotasi manual tingkat keparahan depresi.")
    parser.add_argument("--input", required=True, help="CSV mentah hasil 01_scraper_x_phq9.py")
    parser.add_argument("--annotator", required=True, help="Nama/ID annotator (unik per orang)")
    parser.add_argument("--output-dir", default=".", help="Folder penyimpanan hasil anotasi")
    parser.add_argument("--resume", action="store_true",
                        help="(opsional, perilaku resume otomatis aktif secara default)")
    args = parser.parse_args()

    annotate(args.input, args.annotator, args.output_dir)


if __name__ == "__main__":
    main()
