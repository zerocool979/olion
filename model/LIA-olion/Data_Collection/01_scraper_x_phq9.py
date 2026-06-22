"""
01_scraper_x_phq9.py
=====================================================================
Scraper unggahan publik X (Twitter) berbahasa Indonesia menggunakan
kata kunci yang diturunkan dari 9 domain gejala PHQ-9 (Patient Health
Questionnaire-9), konsisten dengan:

  - 03_Proposal_Penelitian.md §5 (Batasan Masalah — Dataset)
  - 04_Desain_Eksperimen.md §4 (Spesifikasi Instrumen — Dataset)
  - Pendekatan pengumpulan data pada Papers/P01, P02, P03 (kata kunci
    PHQ-9/psychiatrist-approved + filter bahasa Indonesia)

OUTPUT skrip ini adalah CSV MENTAH (BELUM BERLABEL):
    kolom -> tweet_id, created_at, lang, matched_category, text

PENTING — KONSISTENSI METODOLOGIS:
Skrip ini TIDAK melakukan auto-labeling/pseudo-labeling berbasis kata
kunci. Sesuai 03_Proposal_Penelitian.md §5 ("Label tingkat keparahan
... merupakan hasil anotasi manual oleh sejumlah terbatas annotator"),
pelabelan 4 kelas (Tidak Ada/Ringan/Sedang/Berat) WAJIB dilakukan
manusia melalui 02_annotation_tool.py, lalu divalidasi inter-annotator
agreement melalui 03_inter_annotator_agreement.py.

KEPATUHAN PLATFORM & ETIKA PENELITIAN:
- Skrip ini menggunakan X API v2 resmi (via pustaka `tweepy`), BUKAN
  scraping tanpa otorisasi / bypass anti-bot. Anda memerlukan Bearer
  Token dari X Developer Portal (https://developer.x.com) dengan tier
  akses yang sesuai (Basic/Pro untuk volume pencarian memadai; tier
  gratis hanya menyediakan akses sangat terbatas).
- Tidak menyimpan nama pengguna/identitas penulis — hanya teks publik,
  cap waktu, dan ID unggahan (diperlukan untuk pencocokan anotasi).
- Untuk publikasi/berbagi dataset ke pihak lain, lepas kolom `tweet_id`
  dan pertimbangkan agregasi/anonimisasi lebih lanjut, serta pastikan
  penelitian Anda telah memperoleh persetujuan etik (komite etik/IRB
  institusi) karena topik ini menyangkut data kesehatan mental.

Instalasi dependensi:
    pip install tweepy pandas

Contoh penggunaan:
    export X_BEARER_TOKEN="xxxxxxxxxxxxxxxx"
    python 01_scraper_x_phq9.py --max-per-category 150 --output raw_scraped_posts.csv
    python 01_scraper_x_phq9.py --snscrape --max-per-category 150 --output data.csv

    # Mode demo/offline (tanpa API, untuk menguji pipeline end-to-end):
    python 01_scraper_x_phq9.py --demo --output raw_scraped_posts.csv
=====================================================================
"""

import argparse
import csv
import os
import random
import re
import sys
import time

# =====================================================================
# SNSCRAPE IMPORT (FALLBACK MODE TANPA API X)
# =====================================================================
try:
    import snscrape.modules.twitter as sntwitter
except ImportError:
    sntwitter = None

from datetime import datetime, timezone

import pandas as pd

# =====================================================================
# 1. KAMUS KATA KUNCI — 9 DOMAIN GEJALA PHQ-9 (BAHASA INDONESIA SEHARI-HARI)
# =====================================================================
# Disusun longgar mengacu pada 9 item PHQ-9 standar, diadaptasi ke ekspresi
# kolokial Bahasa Indonesia yang umum dipakai di media sosial — pendekatan
# yang sama dengan Papers/P03 (kata kunci turunan PHQ-9) dan Papers/P02
# (kata kunci yang merepresentasikan aspek DSM-V).
#
# Kategori "ide_bunuh_diri" merepresentasikan item ke-9 PHQ-9 ("pikiran
# bahwa lebih baik mati, atau menyakiti diri sendiri"). Kata kunci di sini
# HANYA berupa pola ekspresi emosional umum untuk keperluan PENGUMPULAN
# KORPUS PENELITIAN LINGUISTIK — bukan dimaksudkan sebagai panduan apa pun
# terkait metode/cara, dan TIDAK menggantikan instrumen skrining klinis.
PHQ9_KEYWORDS = {
    "anhedonia": [
        "gak ada minat ngapa-ngapain", "udah gak semangat ngapa-ngapain",
        "gak ada yang menyenangkan lagi", "males ngapa-ngapain banget",
        "kehilangan minat sama hobi", "udah gak excited sama apapun",
    ],
    "mood_sedih": [
        "sedih terus tanpa alasan", "ngerasa hampa banget",
        "kosong banget rasanya", "ngerasa putus asa",
        "ngerasa down terus belakangan ini", "nangis tanpa sebab jelas",
    ],
    "gangguan_tidur": [
        "susah tidur belakangan ini", "insomnia parah",
        "gak bisa tidur semalaman", "kebangun terus tengah malam",
        "tidur kebanyakan tapi capek terus",
    ],
    "kelelahan": [
        "capek terus padahal gak ngapa-ngapain", "lemes gak ada energi",
        "kehabisan tenaga buat ngapa-ngapain", "cape banget tiap hari",
    ],
    "nafsu_makan": [
        "gak nafsu makan sama sekali", "males makan belakangan ini",
        "makan jadi berlebihan terus", "berat badan turun drastis",
    ],
    "rasa_bersalah": [
        "ngerasa gak berharga", "ngerasa gagal terus",
        "ngerasa jadi beban buat orang lain", "nyalahin diri sendiri terus",
    ],
    "konsentrasi": [
        "susah fokus belakangan ini", "susah konsentrasi banget",
        "pikiran berantakan terus", "gampang lupa belakangan ini",
    ],
    "psikomotor": [
        "gelisah terus gak jelas", "gak bisa diem rasanya",
        "lemot banget gerak-gerak", "berat rasanya buat gerak",
    ],
    "ide_bunuh_diri": [
        "pengen menghilang aja", "capek banget sama hidup",
        "mending gak usah ada", "pengen berhenti dari semua ini",
        "udah gak kuat lagi jalanin hidup",
    ],
}

CONTENT_WARNING_CATEGORY = "ide_bunuh_diri"

# =====================================================================
# 2. PEMBANGUN QUERY X API v2
# =====================================================================
MAX_QUERY_LEN = 480   # batas aman di bawah limit 512 karakter (tier dasar)


def build_queries_for_category(category, keywords, lang="id", exclude_retweets=True):
    """Memecah daftar kata kunci 1 kategori menjadi beberapa query
    (jika melebihi batas panjang query API) dengan format:
        ("kw1" OR "kw2" OR ...) lang:id -is:retweet
    """
    suffix = f' lang:{lang}' + (' -is:retweet' if exclude_retweets else '')
    queries, current_terms = [], []

    def assemble(terms):
        return "(" + " OR ".join(f'"{t}"' for t in terms) + ")" + suffix

    for kw in keywords:
        trial = current_terms + [kw]
        if len(assemble(trial)) > MAX_QUERY_LEN and current_terms:
            queries.append(assemble(current_terms))
            current_terms = [kw]
        else:
            current_terms = trial
    if current_terms:
        queries.append(assemble(current_terms))
    return queries


# =====================================================================
# 3. SCRAPER VIA X API v2 (TWEEPY) — JALUR RESMI/SESUAI TOS
# =====================================================================

def scrape_via_api(bearer_token, max_per_category=150, full_archive=False,
                    since_days=7, exclude_retweets=True, sleep_between_calls=1.0):
    try:
        import tweepy
    except ImportError:
        sys.exit("❌ Pustaka 'tweepy' belum terpasang. Jalankan: pip install tweepy")

    client = tweepy.Client(bearer_token=bearer_token, wait_on_rate_limit=True)
    search_fn = client.search_all_tweets if full_archive else client.search_recent_tweets

    rows, seen_ids = [], set()

    for category, kw_list in PHQ9_KEYWORDS.items():
        queries = build_queries_for_category(category, kw_list, exclude_retweets=exclude_retweets)
        for q in queries:
            print(f"[{category}] Query: {q}")
            collected_for_query = 0
            try:
                paginator = tweepy.Paginator(
                    search_fn, query=q,
                    tweet_fields=["created_at", "lang", "id"],
                    max_results=100,
                ).flatten(limit=max_per_category)

                for tweet in paginator:
                    if tweet.id in seen_ids:
                        continue
                    if tweet.lang != "id":
                        continue
                    text = clean_for_storage(tweet.text)
                    if not is_valid_candidate(text):
                        continue
                    seen_ids.add(tweet.id)
                    rows.append({
                        "tweet_id": tweet.id,
                        "created_at": tweet.created_at.isoformat() if tweet.created_at else "",
                        "lang": tweet.lang,
                        "matched_category": category,
                        "text": text,
                    })
                    collected_for_query += 1
            except Exception as e:
                print(f"  ⚠️ Gagal mengambil query ini: {e}")
            print(f"  -> Terkumpul {collected_for_query} unggahan baru dari query ini.")
            time.sleep(sleep_between_calls)   # jeda sopan antar-panggilan API

    return pd.DataFrame(rows)


# =====================================================================
# 3B. SCRAPER VIA SNSCRAPE (FALLBACK TANPA API X / BEARER TOKEN)
# =====================================================================
def scrape_via_snscrape(max_per_category=150):
    """
    Alternatif tanpa X API.
    Menggunakan snscrape (tidak butuh Bearer Token).
    """
    if sntwitter is None:
        sys.exit("❌ snscrape belum terinstall. Jalankan: pip install snscrape")

    rows, seen_ids = [], set()

    for category, kw_list in PHQ9_KEYWORDS.items():
        queries = build_queries_for_category(category, kw_list, exclude_retweets=True)

        for q in queries:
            # ubah format query X API -> format snscrape
            q_clean = q.replace("lang:id", "lang:id")

            print(f"[SNSCRAPE - {category}] Query: {q_clean}")

            collected_for_query = 0

            try:
                scraper = sntwitter.TwitterSearchScraper(q_clean)

                for i, tweet in enumerate(scraper.get_items()):
                    if i >= max_per_category:
                        break

                    if tweet.id in seen_ids:
                        continue

                    if hasattr(tweet, "lang") and tweet.lang != "id":
                        continue

                    text = clean_for_storage(tweet.content)

                    if not is_valid_candidate(text):
                        continue

                    seen_ids.add(tweet.id)

                    rows.append({
                        "tweet_id": tweet.id,
                        "created_at": tweet.date.isoformat() if tweet.date else "",
                        "lang": "id",
                        "matched_category": category,
                        "text": text,
                    })

                    collected_for_query += 1

            except Exception as e:
                print(f"  ⚠️ SNSCRAPE gagal: {e}")

            print(f"  -> Terkumpul {collected_for_query} unggahan baru dari query ini.")

    return pd.DataFrame(rows)


# =====================================================================
# 4. MODE DEMO/OFFLINE (TANPA API) — UNTUK MENGUJI PIPELINE END-TO-END
# =====================================================================
def scrape_demo_offline(n_per_category=15, seed=42):
    """Membangkitkan data sintetis (BUKAN data nyata) agar seluruh pipeline
    (scraping -> anotasi -> Cohen's Kappa -> dataset final) dapat diuji
    end-to-end sebelum Anda memperoleh akses X API. Konsisten dengan filosofi
    QUICK_DEMO_MODE pada Code/Eksperimen_Komparasi_ML_IndoBERT_Depresi.ipynb."""
    rng = random.Random(seed)
    base_templates = {
        "anhedonia": "udah lama banget gak ngerasa seneng ngapa-ngapain, semua hambar aja",
        "mood_sedih": "akhir-akhir ini sedih mulu padahal gatau kenapa",
        "gangguan_tidur": "tiap malem susah banget merem, kebangun mulu",
        "kelelahan": "capek banget rasanya padahal gak ngapa-ngapain seharian",
        "nafsu_makan": "udah beberapa hari ini males makan, berat badan turun",
        "rasa_bersalah": "ngerasa jadi beban buat semua orang di sekitar",
        "konsentrasi": "susah banget fokus kerja, pikiran kemana-mana",
        "psikomotor": "gelisah terus gabisa diem dari tadi",
        "ide_bunuh_diri": "capek banget sama hidup, pengen menghilang aja rasanya",
    }
    rows, tweet_id = [], 1000
    for category, base in base_templates.items():
        for _ in range(n_per_category):
            tweet_id += 1
            filler = rng.choice(["", " btw", " sih", " :(", " huhu", " ya allah"])
            rows.append({
                "tweet_id": tweet_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "lang": "id",
                "matched_category": category,
                "text": base + filler,
            })
    return pd.DataFrame(rows)


# =====================================================================
# 5. PEMBERSIHAN & FILTER KUALITAS DATA MENTAH
# =====================================================================
def clean_for_storage(text):
    """Pembersihan ringan HANYA untuk penyimpanan mentah (BUKAN preprocessing
    NLP penuh — preprocessing lengkap tetap dilakukan di notebook eksperimen
    pada Bagian 4, agar identik untuk semua model)."""
    text = re.sub(r"http\S+|www\S+", " ", text)   # hapus URL
    text = re.sub(r"\s+", " ", text).strip()
    return text


def is_valid_candidate(text, min_len=15):
    if len(text) < min_len:
        return False
    if text.startswith("RT @"):
        return False
    if re.fullmatch(r"[\W\d_]+", text):   # hanya simbol/angka, tanpa huruf
        return False
    return True


# =====================================================================
# 6. MAIN
# =====================================================================
def main():
    parser = argparse.ArgumentParser(
        description="Scraper unggahan publik X (Twitter) berbahasa Indonesia "
                    "menggunakan kata kunci turunan PHQ-9 (X API v2 resmi)."
    )
    parser.add_argument("--output", default="raw_scraped_posts.csv",
                        help="Path file CSV mentah hasil scraping (belum berlabel).")
    parser.add_argument("--max-per-category", type=int, default=150,
                        help="Maksimum unggahan dikumpulkan per kategori PHQ-9.")
    parser.add_argument("--full-archive", action="store_true",
                        help="Gunakan endpoint full-archive search (memerlukan akses Academic/Pro).")
    parser.add_argument("--since-days", type=int, default=7,
                        help="Rentang hari ke belakang untuk recent search (maks 7 hari di tier dasar).")
    parser.add_argument("--include-replies", action="store_true",
                        help="Sertakan balasan (reply), bukan hanya unggahan utama.")
    parser.add_argument("--demo", action="store_true",
                        help="Mode demo/offline: bangkitkan data sintetis, tanpa perlu API key.")
    parser.add_argument("--snscrape", action="store_true",
                        help="Gunakan snscrape sebagai alternatif tanpa X API.")
    args = parser.parse_args()

    if args.demo:
        print("⚠️  MODE DEMO/OFFLINE — data yang dihasilkan SINTETIS, hanya untuk menguji pipeline.")
        df = scrape_demo_offline()
    elif hasattr(args, "snscrape") and args.snscrape:
        print("⚠️ MODE SNSCRAPE — tanpa X API (lebih lambat tapi gratis).")
        df = scrape_via_snscrape(args.max_per_category)
    else:
        bearer_token = os.environ.get("X_BEARER_TOKEN")
        if not bearer_token:
            sys.exit(
                "❌ X_BEARER_TOKEN tidak ditemukan di environment variable.\n"
                "   Set dahulu: export X_BEARER_TOKEN='xxxxxxxxxxxx'\n"
                "   (dapatkan dari https://developer.x.com)\n"
                "   Atau jalankan dengan --demo untuk mode pengujian offline."
            )

        df = scrape_via_api(
            bearer_token=bearer_token,
            max_per_category=args.max_per_category,
            full_archive=args.full_archive,
            since_days=args.since_days,
            exclude_retweets=not args.include_replies,
        )

    if df.empty:
        sys.exit("❌ Tidak ada data terkumpul. Periksa koneksi/akses API atau kata kunci.")

    df = df.drop_duplicates(subset=["tweet_id"]).reset_index(drop=True)
    df.to_csv(args.output, index=False, quoting=csv.QUOTE_MINIMAL, encoding="utf-8")

    print(f"\n✅ Selesai. {len(df)} unggahan tersimpan di: {args.output}")
    print("\nDistribusi per kategori kata kunci (BUKAN label keparahan — masih perlu anotasi manual!):")
    print(df["matched_category"].value_counts())
    print(
        "\n➡️  LANGKAH SELANJUTNYA: gunakan 02_annotation_tool.py untuk melabeli "
        "manual setiap unggahan ke 4 kelas keparahan (Tidak Ada/Ringan/Sedang/Berat)."
    )


if __name__ == "__main__":
    main()
