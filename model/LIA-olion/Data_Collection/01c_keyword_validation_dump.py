"""
01c_keyword_validation_dump.py

Utility untuk menguji satu kategori kata kunci twscrape dan
menyimpan seluruh hasil tweet ke file TXT untuk inspeksi manual.
"""

import asyncio
import re
from twscrape import API
from twscrape.logger import set_log_level

set_log_level("WARNING")


async def main():
    api = API("twscrape_accounts.db")
    n = 0

    # === UBAH DI SINI ===
    category = "anhedonia"
    keywords = [
        "gak semangat",
        "males banget",
        "gabut mulu",
        "boring hidup",
        "gak ada gairah",
        "hilang minat",
        "kehilangan minat sama hobi",
        "udah gak excited sama apapun",
        "gak ada yang menyenangkan lagi",
        "males ngapa-ngapain banget",
        "gak ada minat ngapa-ngapain",
        "udah gak semangat ngapa-ngapain",
    ]
    limit = 400
    # ====================

    kws = ") OR (".join(keywords)
    query = f"(({kws})) lang:id -is:retweet"

    print(f"[{category.upper()}] Query → {query}")
    print("=" * 120)

    async for tweet in api.search(query, limit=limit):
        n += 1
        text = re.sub(r"\s+", " ", tweet.rawContent.strip())

        print(f"#{n}")
        print(f"ID      : {tweet.id}")
        print(f"Tanggal : {tweet.date}")
        print(f"User    : @{tweet.user.username} ({tweet.user.displayname})")
        print("Tweet   :")
        print(text)
        print("-" * 120)

    print("=" * 120)
    print(f"TOTAL {n} tweet untuk kategori {category}")


if __name__ == "__main__":
    asyncio.run(main())
