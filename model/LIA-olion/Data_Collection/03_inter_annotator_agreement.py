"""
03_inter_annotator_agreement.py
=====================================================================
Menghitung Cohen's Kappa antar-annotator dan menggabungkan hasil
anotasi manual (02_annotation_tool.py) menjadi dataset final dengan
skema KOLOM TEPAT `text,label` — siap dipakai langsung sebagai
DATA_PATH pada Code/Eksperimen_Komparasi_ML_IndoBERT_Depresi.ipynb.

Konsisten dengan:
  - 03_Proposal_Penelitian.md §5 (Batasan Masalah, butir 6):
        "anotasi manual oleh sejumlah terbatas annotator... berpotensi
         mengandung subjektivitas pelabelan yang dimitigasi melalui
         pengukuran inter-annotator agreement (Cohen's Kappa)"
  - 04_Desain_Eksperimen.md §4 (Cohen's Kappa >= 0.6 sebagai syarat
    kelayakan data sebelum dipakai untuk eksperimen)

Cara pakai (2 annotator):
    python 03_inter_annotator_agreement.py \\
        --annotators annotated_by_andi.csv annotated_by_budi.csv \\
        --output dataset_depresi_id.csv

Cara pakai (dengan adjudikator ke-3 untuk baris yang berselisih):
    python 03_inter_annotator_agreement.py \\
        --annotators annotated_by_andi.csv annotated_by_budi.csv \\
        --adjudicator annotated_by_supervisor.csv \\
        --output dataset_depresi_id.csv
=====================================================================
"""

import argparse
import itertools
import sys

import numpy as np
import pandas as pd
from sklearn.metrics import cohen_kappa_score, confusion_matrix

LABELS = ["Tidak Ada", "Ringan", "Sedang", "Berat"]   # HARUS identik dgn notebook
KAPPA_THRESHOLD = 0.6   # ambang kelayakan data sesuai 04_Desain_Eksperimen.md §4


def load_annotator_csv(path):
    df = pd.read_csv(path)
    required = {"tweet_id", "text", "label"}
    if not required.issubset(df.columns):
        sys.exit(f"❌ {path} harus memiliki kolom: {required}")
    df = df[df["label"] != "SKIP"].copy()   # buang baris yang di-skip annotator
    return df


def pairwise_kappa(annotator_dfs, annotator_names):
    print("=" * 70)
    print("COHEN'S KAPPA — AGREEMENT ANTAR-PASANGAN ANNOTATOR")
    print("=" * 70)
    kappa_results = []
    for (i, j) in itertools.combinations(range(len(annotator_dfs)), 2):
        df_i, df_j = annotator_dfs[i], annotator_dfs[j]
        merged = df_i.merge(df_j, on="tweet_id", suffixes=("_a", "_b"))
        if merged.empty:
            print(f"⚠️ Tidak ada tweet_id yang sama antara "
                  f"{annotator_names[i]} & {annotator_names[j]}.")
            continue
        kappa = cohen_kappa_score(merged["label_a"], merged["label_b"], labels=LABELS)
        n_overlap = len(merged)
        n_agree = (merged["label_a"] == merged["label_b"]).sum()
        print(f"\n{annotator_names[i]} vs {annotator_names[j]}:")
        print(f"  Jumlah data overlap : {n_overlap}")
        print(f"  Persentase setuju   : {n_agree / n_overlap * 100:.1f}%")
        print(f"  Cohen's Kappa       : {kappa:.4f}  "
              f"({'✅ LAYAK (>= ' + str(KAPPA_THRESHOLD) + ')' if kappa >= KAPPA_THRESHOLD else '❌ DI BAWAH AMBANG'})")

        cm = confusion_matrix(merged["label_a"], merged["label_b"], labels=LABELS)
        print(f"  Confusion matrix antar-annotator (baris={annotator_names[i]}, kolom={annotator_names[j]}):")
        print(pd.DataFrame(cm, index=LABELS, columns=LABELS))

        kappa_results.append({
            "annotator_1": annotator_names[i], "annotator_2": annotator_names[j],
            "kappa": kappa, "n_overlap": n_overlap, "pct_agree": n_agree / n_overlap * 100,
        })
    return pd.DataFrame(kappa_results)


def build_disagreement_report(annotator_dfs, annotator_names):
    """Mengidentifikasi baris-baris yang labelnya berbeda antar-2 annotator
    pertama, untuk diadjudikasi (oleh annotator ke-3/supervisor)."""
    if len(annotator_dfs) < 2:
        return pd.DataFrame()
    df_a, df_b = annotator_dfs[0], annotator_dfs[1]
    merged = df_a.merge(df_b, on=["tweet_id", "text"], suffixes=("_a", "_b"))
    disagreements = merged[merged["label_a"] != merged["label_b"]].copy()
    disagreements = disagreements.rename(columns={
        "label_a": f"label_{annotator_names[0]}", "label_b": f"label_{annotator_names[1]}",
    })
    return disagreements[["tweet_id", "text",
                          f"label_{annotator_names[0]}", f"label_{annotator_names[1]}"]]


def merge_final_dataset(annotator_dfs, annotator_names, adjudicator_df=None):
    """Strategi penggabungan label final:
       1. Baris yang labelnya SAMA di semua annotator -> dipakai langsung.
       2. Baris yang berselisih:
            a. Jika ada file adjudikator (mis. supervisor/psikolog) yang
               memuat tweet_id tsb -> pakai label adjudikator.
            b. Jika tidak ada adjudikator -> baris tsb DIBUANG (lebih aman
               daripada menebak/voting otomatis pada domain sensitif ini).
    """
    df_a = annotator_dfs[0][["tweet_id", "text", "label"]].rename(columns={"label": "label_0"})
    merged = df_a
    for k, df_k in enumerate(annotator_dfs[1:], start=1):
        merged = merged.merge(
            df_k[["tweet_id", "label"]].rename(columns={"label": f"label_{k}"}),
            on="tweet_id", how="inner"
        )

    label_cols = [c for c in merged.columns if c.startswith("label_")]
    merged["all_agree"] = merged[label_cols].nunique(axis=1) == 1
    final_rows = []

    for _, row in merged.iterrows():
        if row["all_agree"]:
            final_rows.append({"tweet_id": row["tweet_id"], "text": row["text"], "label": row[label_cols[0]]})
        elif adjudicator_df is not None:
            adj_match = adjudicator_df[adjudicator_df["tweet_id"] == row["tweet_id"]]
            if not adj_match.empty:
                final_rows.append({
                    "tweet_id": row["tweet_id"], "text": row["text"],
                    "label": adj_match.iloc[0]["label"],
                })
            # jika tidak ada keputusan adjudikator untuk baris ini -> dibuang

    df_final = pd.DataFrame(final_rows)
    return df_final


def main():
    parser = argparse.ArgumentParser(
        description="Hitung Cohen's Kappa & gabungkan anotasi manual jadi dataset final text,label."
    )
    parser.add_argument("--annotators", nargs="+", required=True,
                        help="Daftar file CSV hasil 02_annotation_tool.py (>=2 file).")
    parser.add_argument("--adjudicator", default=None,
                        help="(Opsional) CSV keputusan adjudikator untuk baris berselisih.")
    parser.add_argument("--output", default="dataset_depresi_id.csv",
                        help="Path output dataset final (kolom: text,label).")
    parser.add_argument("--disagreement-report", default="disagreements_for_adjudication.csv",
                        help="Path laporan baris yang berselisih (untuk adjudikasi manual).")
    args = parser.parse_args()

    if len(args.annotators) < 2:
        sys.exit("❌ Minimal 2 file annotator diperlukan untuk menghitung inter-annotator agreement.")

    annotator_names = [f.split("/")[-1].replace("annotated_by_", "").replace(".csv", "")
                       for f in args.annotators]
    annotator_dfs = [load_annotator_csv(f) for f in args.annotators]

    # --- 1. Cohen's Kappa pairwise ---
    df_kappa = pairwise_kappa(annotator_dfs, annotator_names)
    avg_kappa = df_kappa["kappa"].mean() if not df_kappa.empty else float("nan")
    print(f"\n📊 Rata-rata Cohen's Kappa seluruh pasangan: {avg_kappa:.4f}")
    if avg_kappa < KAPPA_THRESHOLD:
        print(f"⚠️  PERINGATAN: Rata-rata Kappa di bawah ambang {KAPPA_THRESHOLD} yang disyaratkan "
              f"04_Desain_Eksperimen.md §4. Disarankan: kalibrasi ulang rubrik bersama annotator, "
              f"diskusikan contoh kasus yang berselisih, lalu lakukan anotasi ulang pada subset data "
              f"sebelum dataset dipakai untuk eksperimen.")
    else:
        print(f"✅ Kesepakatan antar-annotator memenuhi ambang kelayakan (Kappa >= {KAPPA_THRESHOLD}).")

    # --- 2. Laporan baris berselisih (untuk adjudikasi) ---
    df_disagree = build_disagreement_report(annotator_dfs, annotator_names)
    if not df_disagree.empty:
        df_disagree.to_csv(args.disagreement_report, index=False)
        print(f"\n📝 {len(df_disagree)} baris berselisih disimpan di: {args.disagreement_report}")
        print("   (gunakan file ini untuk sesi adjudikasi oleh supervisor/annotator ke-3)")

    # --- 3. Gabungkan jadi dataset final ---
    adjudicator_df = None
    if args.adjudicator:
        adjudicator_df = load_annotator_csv(args.adjudicator)

    df_final = merge_final_dataset(annotator_dfs, annotator_names, adjudicator_df)

    if df_final.empty:
        sys.exit("❌ Dataset final kosong — periksa kembali overlap tweet_id antar file annotator.")

    # Pastikan skema KOLOM TEPAT text,label sesuai kebutuhan notebook
    df_export = df_final[["text", "label"]].copy()
    df_export.to_csv(args.output, index=False, encoding="utf-8")

    print(f"\n✅ Dataset final tersimpan: {args.output}")
    print(f"   Total baris (label disepakati/teradjudikasi): {len(df_export)}")
    print("\nDistribusi label dataset final:")
    print(df_export["label"].value_counts())
    print(
        f"\n➡️  Salin/unggah '{args.output}' ke Google Drive lalu set variabel DATA_PATH "
        f"pada Code/Eksperimen_Komparasi_ML_IndoBERT_Depresi.ipynb (Bagian 3) ke path file ini."
    )


if __name__ == "__main__":
    main()
