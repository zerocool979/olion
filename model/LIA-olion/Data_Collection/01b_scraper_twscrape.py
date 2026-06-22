""" 01b_scraper_twscrape.py ─ PENGGANTI 01_scraper_x_phq9.py ===================================================================== Scraper unggahan publik X (Twitter) berbahasa Indonesia menggunakan 
library twscrape, yang memakai internal GraphQL/REST API yang sama dengan aplikasi web X.

MENGAPA SKRIP INI DIBUAT?
  Tier GRATIS X API v2 resmi (01_scraper_x_phq9.py) tidak lagi memiliki
  akses ke endpoint pencarian (error 402 Payment Required).
  twscrape mengakses data yang sama TANPA biaya — hanya memerlukan
  kredensial akun X biasa (username + password).

SYARAT:
  pip install twscrape

KELUARAN (identik dengan 01_scraper_x_phq9.py):
  CSV mentah BELUM BERLABEL → kolom: tweet_id, created_at, lang,
  matched_category, text
  Format ini langsung kompatibel dengan 02_annotation_tool.py.

ETIKA & PRIVASI:
  - Username/identitas penulis TIDAK disimpan.
  - Hanya teks publik yang dikumpulkan; simpan sesuai
    protokol etik penelitian Anda (komite etik/IRB).
  - Jaga kredensial akun; jangan dibagikan/di-commit ke repo publik.

CARA PAKAI:
  # Setup akun sekali saja:
  python 01b_scraper_twscrape.py --setup
      --username akun_x_anda
      --password kata_sandi
      --email email@domain.com
      --email-password password_email   # opsional, untuk verifikasi

  # Scraping:
  python 01b_scraper_twscrape.py --max-per-category 150 --output raw_scraped_posts.csv

  # Mode demo (tanpa akun X, data sintetis untuk uji pipeline):
  python 01b_scraper_twscrape.py --demo --output raw_scraped_posts.csv
=====================================================================
"""
from __future__ import annotations

import argparse
import asyncio
import csv
import os
import random
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from textwrap import dedent

import pandas as pd

# ─────────────────────────────────────────────────────────────────
# 0. KONSTANTA & KATA KUNCI PHQ-9
# ─────────────────────────────────────────────────────────────────
DB_PATH  = Path("twscrape_accounts.db")    # file database akun twscrape
SEED     = 42                              # konsisten dengan random_state notebook

# 9 domain PHQ-9 → kata kunci ekspresi kolokial Bahasa Indonesia
#
# CATATAN PENTING (hasil diagnostik 22 Jun 2026):
# Frasa panjang 4-6 kata yang sangat spesifik ("ngerasa hampa banget") TERBUKTI
# mengembalikan 0 hasil — baik dengan tanda kutip (exact phrase) MAUPUN tanpa
# kutip (AND beberapa kata sekaligus) — karena kombinasi kata sespesifik itu
# jarang benar-benar muncul bertepatan dalam tweet asli. Sebagai pembanding,
# kata kunci pendek & umum ("pusing", "indonesia") langsung mengembalikan
# puluhan hasil pada percobaan yang sama.
#
# Maka daftar di bawah ini disusun ULANG menjadi frasa 1-2 kata (kadang 3
# untuk idiom yang memang umum diucapkan utuh, mis. "udah gak kuat"), yang
# jauh lebih mungkin muncul verbatim di tweet nyata. Sebelum scraping besar,
# uji tiap kata kunci satu-per-satu dgn limit kecil (lihat mode --test-keywords)
# untuk memvalidasi bahwa kata kunci tsb memang menghasilkan tweet.
PHQ9_KEYWORDS: dict[str, list[str]] = {
    "anhedonia": [
        "gak semangat",
        "males banget",
        "hilang minat",
        "gak niat",
        "gabut mulu",
        "boring hidup",
        "gak ada gairah",
        "malas ngapain",
    ],
    "mood_sedih": [
        "sedih banget",
        "sedih mulu",
        "hampa",
        "putus asa",
        "down banget",
        "galau berat",
        "nangis mulu",
        "ngerasa kosong",
    ],
    "gangguan_tidur": [
        "susah tidur",
        "insomnia",
        "gak bisa tidur",
        "kebangun mulu",
        "tidur kurang",
        "susah merem",
    ],
    "kelelahan": [
        "capek banget",
        "lemes banget",
        "gak ada energi",
        "lelah banget",
        "capek terus",
        "capek mulu",
    ],
    "nafsu_makan": [
        "gak nafsu makan",
        "males makan",
        "berat badan turun",
        "makan berlebihan",
        "nafsu makan hilang",
    ],
    "rasa_bersalah": [
        "gak berharga",
        "ngerasa gagal",
        "jadi beban",
        "nyalahin diri sendiri",
        "minder banget",
        "ngerasa gagal terus",
    ],
    "konsentrasi": [
        "susah fokus",
        "gampang lupa",
        "pikiran berantakan",
        "susah konsentrasi",
        "gak fokus",
    ],
    "psikomotor": [
        "gelisah banget",
        "gak bisa diem",
        "lemot banget",
        "berat buat gerak",
        "gelisah terus",
    ],
    "ide_bunuh_diri": [
        "capek hidup",
        "pengen ngilang",
        "pengen menghilang",
        "udah gak kuat",
        "mending gak ada",
        "pengen berhenti",
    ],
}

CONTENT_WARNING_CATEGORIES = {"ide_bunuh_diri"}

MAX_QUERY_LEN = 480   # batas aman query X (< 512 char)
MAX_OR_TERMS  = 4     # pengaman tambahan: batasi jumlah suku OR per query


# ─────────────────────────────────────────────────────────────────
# 1. QUERY BUILDER
# ─────────────────────────────────────────────────────────────────

def build_queries(category: str, keywords: list[str]) -> list[str]:
    """Pecah kata kunci satu kategori menjadi query-query
    yang tidak melebihi batas panjang karakter X.

    PERUBAHAN PENTING (revisi ke-2): tanda kurung "( )" DIHAPUS TOTAL.
    Pencarian publik X (endpoint GraphQL yang dipakai twscrape — sama
    dengan kotak cari di x.com) TIDAK mendukung tanda kurung sebagai
    operator pengelompokan boolean seperti pada API v2 resmi/berbayar.
    Saat tanda kurung disisipkan, X memperlakukannya sebagai karakter
    literal (yang hampir tidak pernah ada di teks tweet asli) sehingga
    seluruh query gagal cocok dan mengembalikan 0 hasil — ini terbukti
    dari uji coba: kata tunggal tanpa kurung ("pusing") mengembalikan
    20 hasil, tapi begitu dibungkus kurung "(pusing)" hasilnya 0.

    Skema BARU (tanpa kurung sama sekali):
      - Frasa 1 kata    -> ditulis polos:      capek
      - Frasa multi-kata -> dibungkus KUTIP:    "susah tidur"
      - Semua kata kunci digabung dgn " OR " polos, TANPA kurung
        pembungkus luar.
      - Jumlah suku per query juga dibatasi (MAX_OR_TERMS) sebagai
        pengaman tambahan — query OR yang terlalu panjang/kompleks
        pada search publik X kadang juga diam-diam mengembalikan
        hasil kosong tanpa error.
    """
    suffix = " lang:id -is:retweet"
    queries: list[str] = []
    current: list[str] = []

    def assemble(terms: list[str]) -> str:
        # parts = [f'"{t}"' if " " in t else t for t in terms]
        # return " OR ".join(parts) + suffix
        parts = [f"({t})" for t in terms]
        return f"({' OR '.join(parts)})" + suffix

    for kw in keywords:
        trial = current + [kw]
        too_long = len(assemble(trial)) > MAX_QUERY_LEN
        too_many = len(trial) > MAX_OR_TERMS
        if (too_long or too_many) and current:
            queries.append(assemble(current))
            current = [kw]
        else:
            current = trial
    if current:
        queries.append(assemble(current))
    return queries


# ─────────────────────────────────────────────────────────────────
# 2. PEMBERSIHAN & FILTER KUALITAS
# ─────────────────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    """Pembersihan ringan untuk penyimpanan mentah.
    Preprocessing NLP penuh tetap dilakukan di notebook (Bagian 4)."""
    text = re.sub(r"http\S+|www\S+", " ", text)   # hapus URL
    text = re.sub(r"\s+", " ", text).strip()
    return text


def is_valid(text: str, min_len: int = 15) -> bool:
    if len(text) < min_len:
        return False
    if text.startswith("RT @"):          # retweet sisa
        return False
    if re.fullmatch(r"[\W\d_]+", text):  # hanya simbol
        return False
    return True


# ─────────────────────────────────────────────────────────────────
# 2B. MODE VALIDASI KATA KUNCI (--test-keywords)
# ─────────────────────────────────────────────────────────────────

async def _test_keywords_async(sample_limit: int = 5) -> None:
    """Uji setiap kata kunci PHQ9_KEYWORDS SATU-PER-SATU (bukan OR-gabungan)
    dengan limit kecil, untuk memvalidasi mana yang benar-benar menghasilkan
    tweet sebelum menjalankan scraping penuh. Mencegah kejadian seperti pada
    log sebelumnya: 9 kategori x beberapa query OR, semuanya 0 hasil, tanpa
    tahu kata kunci mana yang jadi penyebabnya."""
    try:
        from twscrape import API
        from twscrape.logger import set_log_level
        set_log_level("WARNING")
    except ImportError:
        sys.exit("❌ twscrape belum terpasang. Jalankan: pip install twscrape")

    if not DB_PATH.exists():
        sys.exit(f"❌ '{DB_PATH}' tidak ditemukan. Jalankan --setup dahulu.")

    api = API(str(DB_PATH))
    accounts = await api.pool.accounts_info()
    if not any(getattr(a, "active", True) for a in accounts):
        sys.exit("❌ Tidak ada akun aktif. Jalankan --setup dahulu.")

    print("=" * 78)
    print(f"VALIDASI KATA KUNCI — limit={sample_limit} tweet per kata kunci")
    print("=" * 78)

    summary = []
    for category, kw_list in PHQ9_KEYWORDS.items():
        print(f"\n[{category}]")
        for kw in kw_list:
            q = f"{kw} lang:id -is:retweet"
            n = 0
            try:
                async for tweet in api.search(q, limit=sample_limit):
                    n += 1
            except Exception as exc:
                print(f"  ⚠️  '{kw}' -> ERROR: {exc}")
                continue
            mark = "✅" if n > 0 else "❌"
            print(f"  {mark} '{kw}' -> {n} hasil")
            summary.append((category, kw, n))
            await asyncio.sleep(1.0)   # jeda sopan antar-query

    zero_hit = [s for s in summary if s[2] == 0]
    print("\n" + "=" * 78)
    print(f"RINGKASAN: {len(summary) - len(zero_hit)}/{len(summary)} kata kunci punya hasil.")
    if zero_hit:
        print(f"⚠️  {len(zero_hit)} kata kunci BERIKUT TIDAK MENGHASILKAN APA-APA "
              f"(pertimbangkan diganti/dipersingkat lagi):")
        for cat, kw, _ in zero_hit:
            print(f"   - [{cat}] '{kw}'")
    print("=" * 78)


# ─────────────────────────────────────────────────────────────────
# 3. SCRAPING ASYNC (twscrape)
# ─────────────────────────────────────────────────────────────────

async def _scrape_async(
    max_per_category: int,
    sleep_between_queries: float,
) -> list[dict]:
    """Fungsi async inti — dipanggil via asyncio.run()."""
    try:
        from twscrape import API, gather
        from twscrape.logger import set_log_level
        set_log_level("WARNING")       # tahan log spam
    except ImportError:
        sys.exit("❌ twscrape belum terpasang. Jalankan: pip install twscrape")

    if not DB_PATH.exists():
        sys.exit(
            f"❌ File akun '{DB_PATH}' tidak ditemukan.\n"
            "   Jalankan setup akun terlebih dahulu:\n"
            "   python 01b_scraper_twscrape.py --setup "
            "--username NAMA --password PASS --email EMAIL"
        )

    api = API(str(DB_PATH))

    # Verifikasi ada akun aktif
    accounts = await api.pool.accounts_info()
    active = [a for a in accounts if getattr(a, "active", True)]
    if not active:
        sys.exit(
            "❌ Tidak ada akun aktif di database.\n"
            "   Tambahkan akun dengan: python 01b_scraper_twscrape.py --setup ..."
        )
    print(f"✅ {len(active)} akun aktif di pool.")

    rows: list[dict] = []
    seen_ids: set[int] = set()

    for category, kw_list in PHQ9_KEYWORDS.items():
        if category in CONTENT_WARNING_CATEGORIES:
            print(f"\n⚠️  [PERINGATAN KONTEN SENSITIF] Kategori: {category}")

        queries = build_queries(category, kw_list)
        for q in queries:
            print(f"  [{category}] Query: {q}")
            collected = 0
            try:
                async for tweet in api.search(q, limit=max_per_category):
                    # Filter bahasa
                    lang = getattr(tweet, "lang", None) or ""
                    if lang and lang != "id":
                        continue

                    raw_text = getattr(tweet, "rawContent", "") or ""
                    text = clean_text(raw_text)
                    if not is_valid(text):
                        continue

                    tid = tweet.id
                    if tid in seen_ids:
                        continue
                    seen_ids.add(tid)

                    created = tweet.date
                    if isinstance(created, datetime):
                        created_str = created.isoformat()
                    else:
                        created_str = str(created)

                    rows.append({
                        "tweet_id":         tid,
                        "created_at":       created_str,
                        "lang":             lang if lang else "id",
                        "matched_category": category,
                        "text":             text,
                        # TIDAK menyimpan username (privasi)
                    })
                    collected += 1

            except Exception as exc:
                # Tangkap rate-limit / error jaringan tanpa menghentikan seluruh proses
                err_str = str(exc)
                if "rate" in err_str.lower() or "429" in err_str:
                    print(f"    ⏳ Rate limit — jeda 60 detik …")
                    await asyncio.sleep(60)
                else:
                    print(f"    ⚠️  Error pada query ini: {exc}")

            print(f"    → {collected} unggahan baru terkumpul.")
            await asyncio.sleep(sleep_between_queries)

    return rows


# ─────────────────────────────────────────────────────────────────
# 4. SETUP AKUN (dipanggil dengan --setup)
# ─────────────────────────────────────────────────────────────────

async def _setup_account(username: str, password: str,
                         email: str, email_password: str,
                         cookies: str | None = None) -> None:
    """
    Dua jalur setup akun:

    1. COOKIES (DIREKOMENDASIKAN — lebih stabil, tidak memicu Cloudflare):
       Login manual ke x.com di browser, ambil cookie 'auth_token' dan
       'ct0' dari DevTools (F12 -> Application/Storage -> Cookies),
       lalu jalankan dengan --cookies "auth_token=xxx; ct0=yyy".
       Akun langsung AKTIF tanpa proses login otomatis sama sekali.

    2. USERNAME/PASSWORD (FALLBACK — sering diblokir Cloudflare 403,
       seperti pada log error 'Sorry, you have been blocked').
       twscrape akan mencoba login otomatis via endpoint web X, yang
       makin sering dianggap traffic bot oleh Cloudflare — terutama
       dari jaringan cloud/VPS/WSL.
    """
    from twscrape import API
    from twscrape.logger import set_log_level
    set_log_level("INFO")

    api = API(str(DB_PATH))
    await api.pool.add_account(
        username=username,
        password=password,
        email=email,
        email_password=email_password,
        cookies=cookies,   # jika diisi, twscrape akan set akun aktif langsung
    )

    if cookies:
        print(f"  → Akun @{username} ditambahkan via cookies (login otomatis dilewati).")
    else:
        print(f"  → Mencoba login akun @{username} (jalur password — bisa diblokir Cloudflare) …")
        await api.pool.login_all()

    accounts = await api.pool.accounts_info()
    for acc in accounts:
        status = "✅ AKTIF" if getattr(acc, "active", True) else "❌ GAGAL"
        print(f"  {status}  @{getattr(acc,'username',acc)}")

    if not cookies and any(not getattr(a, "active", True) for a in accounts):
        print(
            "\n⚠️  Login password gagal/diblokir Cloudflare (403 'Sorry, you have been "
            "blocked' adalah ciri khasnya).\n"
            "   Solusi tercepat: pakai jalur cookies, bukan username/password.\n"
            "   1) Login manual ke x.com di browser biasa.\n"
            "   2) F12 -> Application/Storage -> Cookies -> x.com -> salin nilai\n"
            "      'auth_token' dan 'ct0'.\n"
            "   3) Jalankan ulang setup:\n"
            "      python 01b_scraper_twscrape.py --setup --username "
            f"{username} --password x --email {email} \\\n"
            "          --cookies \"auth_token=ISI_AUTH_TOKEN; ct0=ISI_CT0\"\n"
        )


# ─────────────────────────────────────────────────────────────────
# 5. MODE DEMO — DATA SINTETIS (tanpa akun X)
# ─────────────────────────────────────────────────────────────────

def generate_demo_data(n_per_category: int = 15, seed: int = SEED) -> pd.DataFrame:
    """Data sintetis HANYA untuk menguji pipeline end-to-end.
    Tidak mewakili data nyata — jangan dipakai untuk klaim ilmiah."""
    rng = random.Random(seed)
    templates = {
        "anhedonia":      "udah lama banget gak ngerasa seneng, semua hambar aja",
        "mood_sedih":     "akhir-akhir ini sedih mulu padahal gatau kenapa",
        "gangguan_tidur": "tiap malem susah banget merem, kebangun mulu",
        "kelelahan":      "capek banget rasanya padahal gak ngapa-ngapain seharian",
        "nafsu_makan":    "udah beberapa hari ini males makan, berat badan turun",
        "rasa_bersalah":  "ngerasa jadi beban buat semua orang di sekitar",
        "konsentrasi":    "susah banget fokus kerja, pikiran kemana-mana",
        "psikomotor":     "gelisah terus gabisa diem dari tadi",
        "ide_bunuh_diri": "capek banget sama hidup, pengen menghilang aja rasanya",
    }
    fillers = ["", " btw", " sih", " :(", " huhu", " ya allah", " aduh"]
    rows, tid = [], 10000
    for category, base in templates.items():
        for _ in range(n_per_category):
            tid += 1
            rows.append({
                "tweet_id":         tid,
                "created_at":       datetime.now(timezone.utc).isoformat(),
                "lang":             "id",
                "matched_category": category,
                "text":             base + rng.choice(fillers),
            })
    return pd.DataFrame(rows)


# ─────────────────────────────────────────────────────────────────
# 6. MAIN
# ─────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Scraper X/Twitter berbahasa Indonesia via twscrape (tanpa biaya API).\n"
            "Output: CSV mentah BELUM BERLABEL — lanjutkan ke 02_annotation_tool.py."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    # Mode setup akun
    setup_g = parser.add_argument_group("Setup Akun (jalankan sekali)")
    setup_g.add_argument("--setup",          action="store_true",
                          help="Tambah & login akun X ke database twscrape.")
    setup_g.add_argument("--username",       help="Username akun X.")
    setup_g.add_argument("--password",       help="Password akun X.")
    setup_g.add_argument("--email",          help="Alamat email akun X.")
    setup_g.add_argument("--email-password", dest="email_password", default="",
                          help="Password email (opsional, untuk verifikasi OTP).")
    setup_g.add_argument("--cookies", default=None,
                          help="(DIREKOMENDASIKAN) Cookie 'auth_token' & 'ct0' dari browser, "
                               "format: \"auth_token=xxx; ct0=yyy\". Melewati login otomatis "
                               "yang sering diblokir Cloudflare (403).")

    # Mode scraping
    scrape_g = parser.add_argument_group("Scraping")
    scrape_g.add_argument("--output",            default="raw_scraped_posts.csv",
                           help="Path file CSV output (default: raw_scraped_posts.csv).")
    scrape_g.add_argument("--max-per-category",  type=int, default=150,
                           help="Maksimum tweet dikumpulkan per kategori PHQ-9 (default: 150).")
    scrape_g.add_argument("--sleep",             type=float, default=2.0,
                           help="Jeda (detik) antar query untuk menghindari rate-limit (default: 2).")
    scrape_g.add_argument("--demo",              action="store_true",
                           help="Mode demo: bangkitkan data sintetis tanpa perlu akun X.")
    scrape_g.add_argument("--test-keywords",     action="store_true",
                           help="Validasi tiap kata kunci PHQ9_KEYWORDS satu-per-satu "
                                "(limit kecil) SEBELUM scraping penuh. Memperlihatkan "
                                "kata kunci mana yang 0 hasil agar bisa diganti lebih awal.")
    scrape_g.add_argument("--sample-limit",      type=int, default=5,
                           help="Limit tweet per kata kunci saat --test-keywords (default: 5).")

    args = parser.parse_args()

    # ── SETUP MODE ──────────────────────────────────────────────
    if args.setup:
        if not args.cookies and not all([args.username, args.password, args.email]):
            parser.error("--setup memerlukan --username, --password, dan --email "
                         "(atau gunakan --cookies untuk jalur tanpa password).")
        if not args.username or not args.email:
            parser.error("--username dan --email tetap diperlukan sebagai identitas akun, "
                         "bahkan saat memakai --cookies.")
        print(f"Menambahkan akun @{args.username} ke {DB_PATH} …")
        asyncio.run(_setup_account(
            args.username, args.password or "cookie_login_unused",
            args.email, args.email_password or "",
            cookies=args.cookies,
        ))

        print("✅ Setup selesai.\n")

        print("=" * 70)
        print("Uji coba scraping")
        print("=" * 70)

        print(dedent("""
              Silahkan Uji coba scraping dengan:

              python3 -c "
              import asyncio
              from twscrape import API
              from twscrape.logger import set_log_level
              set_log_level('DEBUG')

              async def main():
                  api = API('twscrape_accounts.db')
                  n = 0
                  async for tweet in api.search('indonesia lang:id', limit=5):
                      n += 1
                      print(tweet.id, tweet.rawContent[:80])
                  print('TOTAL:', n)

              asyncio.run(main())
              "
              """))

        print("=" * 70)
        print(f"Jalankan scraping utama:\npython {sys.argv[0]} --max-per-category 150 --output raw_scraped_posts.csv")
        print("=" * 70)

        return

    # ── MODE VALIDASI KATA KUNCI ─────────────────────────────────
    if args.test_keywords:
        asyncio.run(_test_keywords_async(sample_limit=args.sample_limit))
        return

    # ── DEMO MODE ───────────────────────────────────────────────
    if args.demo:
        print("⚠️  MODE DEMO — data SINTETIS, hanya untuk menguji pipeline.")
        df = generate_demo_data(n_per_category=20)

    # ── SCRAPING MODE ───────────────────────────────────────────
    else:
        print(f"Memulai scraping ({args.max_per_category} tweet/kategori) …")
        rows = asyncio.run(_scrape_async(
            max_per_category=args.max_per_category,
            sleep_between_queries=args.sleep,
        ))
        if not rows:
            sys.exit(
                "❌ Tidak ada data terkumpul.\n"
                "   Kemungkinan penyebab:\n"
                "   1. Akun belum di-setup  → python 01b_scraper_twscrape.py --setup ...\n"
                "   2. Login gagal / akun terkunci  → coba login ulang via --setup\n"
                "   3. Rate limit total    → tunggu 15-30 menit lalu coba lagi\n"
                "   Untuk menguji pipeline tanpa akun, gunakan: --demo"
            )
        df = pd.DataFrame(rows)

    # Hapus duplikat & simpan
    df = df.drop_duplicates(subset=["tweet_id"]).reset_index(drop=True)
    df.to_csv(args.output, index=False, quoting=csv.QUOTE_MINIMAL, encoding="utf-8")

    print(f"\n✅ {len(df)} unggahan tersimpan → {args.output}")
    print("\nDistribusi per kategori (BUKAN label keparahan — masih perlu anotasi manual!):")
    print(df["matched_category"].value_counts().to_string())
    print(
        f"\n⚠️  PERINGATAN KESEJAHTERAAN ANNOTATOR:\n"
        f"   Sebagian konten mungkin mengandung ekspresi tekanan emosional berat.\n"
        f"   Pastikan annotator mendapat briefing, istirahat berkala, dan akses\n"
        f"   ke dukungan kesehatan mental sebelum memulai anotasi.\n"
        f"\n➡️  LANGKAH SELANJUTNYA:\n"
        f"   python 02_annotation_tool.py --input {args.output} --annotator NAMA_ANDA"
    )


if __name__ == "__main__":
    main()
