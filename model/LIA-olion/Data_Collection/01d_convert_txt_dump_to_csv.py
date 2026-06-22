#!/usr/bin/env python3
"""
01d_convert_txt_dump_to_csv.py

Konversi seluruh file *.txt hasil
01d_keyword_validation_dump.py
menjadi CSV dengan skema:

tweet_id,created_at,lang,matched_category,text

Usage:
    python 01d_convert_txt_dump_to_csv.py

Output:
    raw_scraped_posts.csv
"""

from pathlib import Path
import pandas as pd
import re


OUTPUT_FILE = "raw_scraped_posts.csv"


def normalize_category(filename: str) -> str:
    category = Path(filename).stem

    if category.startswith("ide_bunuh_diri"):
        return "ide_bunuh_diri"

    return category


def clean_text(text: str) -> str:
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


rows = []

for txt_file in sorted(Path(".").glob("*.txt")):

    category = normalize_category(txt_file.name)

    print(f"[+] Processing {txt_file.name} -> {category}")

    with open(txt_file, encoding="utf-8", errors="ignore") as f:
        lines = [line.rstrip("\n") for line in f]

    i = 0

    while i < len(lines):

        line = lines[i]

        # Awal record tweet
        if re.match(r"^#\d+$", line):

            tweet_id = None
            created_at = None
            tweet_text = []

            i += 1

            while i < len(lines):

                current = lines[i]

                if current.startswith("ID"):
                    tweet_id = current.split(":", 1)[1].strip()

                elif current.startswith("Tanggal"):
                    created_at = current.split(":", 1)[1].strip()

                elif current.startswith("Tweet"):

                    i += 1

                    while i < len(lines):

                        text_line = lines[i]

                        if re.match(r"^-{20,}$", text_line):
                            break

                        tweet_text.append(text_line)
                        i += 1

                    break

                i += 1

            text = clean_text(" ".join(tweet_text))

            if tweet_id and text:

                rows.append(
                    {
                        "tweet_id": tweet_id,
                        "created_at": created_at,
                        "lang": "id",
                        "matched_category": category,
                        "text": text,
                    }
                )

        i += 1


df = pd.DataFrame(rows)

before = len(df)

df = df.drop_duplicates(subset=["tweet_id"])

after = len(df)

print(f"\nTotal records : {before}")
print(f"After dedup   : {after}")
print(f"Duplicates    : {before - after}")

df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8",
)

print(f"\n✅ Saved -> {OUTPUT_FILE}")

print("\nDistribusi kategori:")
print(df["matched_category"].value_counts())
