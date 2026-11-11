/* ÜRETİLİR: scripts/katalog-uret.py ← 00-yonetim/veri/katalog.json (katalog-v6 · fiyat v19.3 (K110) · 2026-11-11). Elle düzenlemeyin.
   Ülkeye göre fiyat (K110): js/ulke.js /api/ulke'den ülkeyi alır; TR ise sayfadaki $ tutarlarını bu eşlemeyle TL'ye çevirir,
   hesaplayıcı (bundle.js / bundle-v4.js) TR katalogla hesaplar. Diğer ülkeler ve bilinmeyen: sayfadaki $ aynen. Pay/komisyon yok (K78). */
window.VITROLO_ULKE_FIYAT = {
 "surum": "v19.3",
 "katalog_surum": "katalog-v6 · fiyat v19.3 (K110) · 2026-11-11",
 "varsayilan": "US",
 "kural": "K110: ülke TR → TL KDV dahil; diğer her ülke ve bilinmeyen → $ (sayfadaki basılı fiyat)",
 "ulkeler": {
  "TR": {
   "para": "TRY",
   "not": "Fiyatlar: Türkiye (TL, KDV dahil)",
   "kdv": "KDV dahil",
   "katalog": {
    "surum": "katalog-v6 · fiyat v19.3 (K110) · 2026-11-11",
    "para": "TRY",
    "kaynak": "00-yonetim/veri/katalog.json (TR, KDV dahil)",
    "urunler": [
     {
      "kod": "site",
      "ad": "Website (up to 5 pages)",
      "kisa": "Website",
      "goster": "Website",
      "fiyat": 30000,
      "aciklama": "A fast, phone-first business site with a contact form.",
      "aile": "web"
     },
     {
      "kod": "buyuk_site",
      "ad": "Large site (up to 10 pages, 2 languages)",
      "kisa": "Large site",
      "goster": "Large site",
      "fiyat": 59400,
      "aciklama": "Up to 10 pages in two languages for businesses with more to show.",
      "aile": "web"
     },
     {
      "kod": "qr",
      "ad": "QR menu",
      "kisa": "QR menu",
      "goster": "QR menu",
      "fiyat": 12000,
      "aciklama": "A menu customers open from the table code; prices change any time.",
      "aile": "menu"
     },
     {
      "kod": "logo",
      "ad": "Logo kit",
      "kisa": "Logo",
      "goster": "Logo kit",
      "fiyat": 6000,
      "aciklama": "A logo made for the business, with PNG, SVG and PDF files.",
      "aile": "tasarim"
     },
     {
      "kod": "sosyal",
      "ad": "Social media file set",
      "kisa": "Social set",
      "goster": "Social set",
      "fiyat": 9000,
      "aciklama": "Profile, cover and bio images, delivered as files.",
      "aile": "tasarim"
     },
     {
      "kod": "masa",
      "ad": "Table & tablet menu",
      "kisa": "Table menu",
      "goster": "Table & tablet menu",
      "fiyat": 15000,
      "aciklama": "Call the waiter, ask for the bill, plus a tablet mode.",
      "aile": "siparis"
     },
     {
      "kod": "siparis",
      "ad": "Online ordering / takeout",
      "kisa": "Online ordering",
      "goster": "Online ordering",
      "fiyat": 16800,
      "aciklama": "Order page, dashboard, product manager and WhatsApp alerts.",
      "aile": "siparis"
     },
     {
      "kod": "sadakat",
      "ad": "Loyalty points & membership",
      "kisa": "Loyalty",
      "goster": "Loyalty",
      "fiyat": 9600,
      "aciklama": "Points and membership that bring customers back.",
      "aile": "siparis"
     },
     {
      "kod": "odeme",
      "ad": "Online payment connection",
      "kisa": "Online payment",
      "goster": "Online payment",
      "fiyat": 6000,
      "aciklama": "Connects the business's own Stripe account; we never hold the money.",
      "aile": "siparis"
     }
    ],
    "birlikte_olmaz": [
     [
      "site",
      "buyuk_site"
     ]
    ],
    "eklentiler": [
     {
      "kod": "sube",
      "ad": "Extra location",
      "kisa": "Extra location",
      "fiyat": 7200,
      "en_cok": 20,
      "en_az_urun": 1,
      "urun_sayisina_girer": false,
      "indirim_alir": true,
      "aciklama": "Per extra location; not counted as an item, gets the same bundle discount."
     }
    ],
    "bakim": [
     {
      "kod": "site",
      "ad": "Site care",
      "fiyat": {
       "3": 8400,
       "6": 16200,
       "12": 31200
      },
      "gerekir": [
       "site",
       "buyuk_site"
      ]
     },
     {
      "kod": "qr",
      "ad": "QR care",
      "fiyat": {
       "3": 4500,
       "6": 8400,
       "12": 15600
      },
      "gerekir": [
       "qr"
      ]
     },
     {
      "kod": "siparis",
      "ad": "Ordering/table/loyalty care",
      "fiyat": {
       "3": 4500,
       "6": 8400,
       "12": 15000
      },
      "gerekir": [
       "masa",
       "siparis",
       "sadakat",
       "odeme"
      ],
      "dahil": {
       "ay": 3,
       "urunler": [
        "masa",
        "siparis",
        "sadakat"
       ],
       "ad": "First 3 months of care included (ordering/table/loyalty)",
       "sonra": "after the included 3 months"
      }
     }
    ],
    "birlesik_bakim": [
     {
      "kod": "restoran",
      "ad": "Restaurant care",
      "alt": "QR care and ordering care together",
      "fiyat": {
       "3": 6000,
       "6": 12000,
       "12": 21600
      },
      "yerine": [
       "qr",
       "siparis"
      ],
      "gerekir": [
       "qr"
      ],
      "ayrica": [
       "masa",
       "siparis",
       "sadakat",
       "odeme"
      ]
     }
    ],
    "aylar": [
     3,
     6,
     12
    ],
    "indirim": [
     {
      "adet": 2,
      "oran": 12
     },
     {
      "adet": 3,
      "oran": 17
     },
     {
      "adet": 5,
      "oran": 20
     }
    ],
    "indirim_bakima": false,
    "oneriler": [
     {
      "grup": "yemek",
      "ad": "Restaurants & cafés",
      "sepetler": [
       {
        "k": "menu",
        "ad": "Menu & table",
        "urunler": [
         "qr",
         "masa"
        ],
        "adet": 2,
        "oran": 12,
        "liste": 27000,
        "indirim": 3240,
        "toplam": 23760,
        "etiket": "2 items · 12% · 3.240 TL saved"
       },
       {
        "k": "masadan",
        "ad": "Table ordering + loyalty",
        "urunler": [
         "qr",
         "masa",
         "siparis",
         "sadakat"
        ],
        "adet": 4,
        "oran": 17,
        "liste": 53400,
        "indirim": 9078,
        "toplam": 44322,
        "etiket": "4 items · 17% · 9.078 TL saved"
       },
       {
        "k": "gorunur",
        "ad": "Get found",
        "urunler": [
         "site",
         "qr",
         "logo"
        ],
        "adet": 3,
        "oran": 17,
        "liste": 48000,
        "indirim": 8160,
        "toplam": 39840,
        "etiket": "3 items · 17% · 8.160 TL saved"
       },
       {
        "k": "tam",
        "ad": "Full digital restaurant",
        "urunler": [
         "site",
         "qr",
         "masa",
         "siparis",
         "sadakat",
         "odeme"
        ],
        "adet": 6,
        "oran": 20,
        "liste": 89400,
        "indirim": 17880,
        "toplam": 71520,
        "etiket": "6 items · 20% · 17.880 TL saved"
       }
      ]
     },
     {
      "grup": "sadakat",
      "ad": "Salons, barbers & gyms",
      "sepetler": [
       {
        "k": "basla",
        "ad": "Website + logo",
        "urunler": [
         "site",
         "logo"
        ],
        "adet": 2,
        "oran": 12,
        "liste": 36000,
        "indirim": 4320,
        "toplam": 31680,
        "etiket": "2 items · 12% · 4.320 TL saved"
       },
       {
        "k": "gorunum",
        "ad": "Complete look",
        "urunler": [
         "site",
         "logo",
         "sosyal"
        ],
        "adet": 3,
        "oran": 17,
        "liste": 45000,
        "indirim": 7650,
        "toplam": 37350,
        "etiket": "3 items · 17% · 7.650 TL saved"
       },
       {
        "k": "sadik",
        "ad": "Loyal customers",
        "urunler": [
         "site",
         "logo",
         "sadakat"
        ],
        "adet": 3,
        "oran": 17,
        "liste": 45600,
        "indirim": 7752,
        "toplam": 37848,
        "etiket": "3 items · 17% · 7.752 TL saved"
       },
       {
        "k": "buyuk",
        "ad": "Large site set",
        "urunler": [
         "buyuk_site",
         "logo",
         "sosyal"
        ],
        "adet": 3,
        "oran": 17,
        "liste": 74400,
        "indirim": 12648,
        "toplam": 61752,
        "etiket": "3 items · 17% · 12.648 TL saved"
       }
      ]
     },
     {
      "grup": "hizmet",
      "ad": "Service businesses",
      "sepetler": [
       {
        "k": "basla",
        "ad": "Website + logo",
        "urunler": [
         "site",
         "logo"
        ],
        "adet": 2,
        "oran": 12,
        "liste": 36000,
        "indirim": 4320,
        "toplam": 31680,
        "etiket": "2 items · 12% · 4.320 TL saved"
       },
       {
        "k": "gorunum",
        "ad": "Complete look",
        "urunler": [
         "site",
         "logo",
         "sosyal"
        ],
        "adet": 3,
        "oran": 17,
        "liste": 45000,
        "indirim": 7650,
        "toplam": 37350,
        "etiket": "3 items · 17% · 7.650 TL saved"
       },
       {
        "k": "odeme",
        "ad": "Website + online payment",
        "urunler": [
         "site",
         "logo",
         "odeme"
        ],
        "adet": 3,
        "oran": 17,
        "liste": 42000,
        "indirim": 7140,
        "toplam": 34860,
        "etiket": "3 items · 17% · 7.140 TL saved"
       },
       {
        "k": "buyuk",
        "ad": "Large site set",
        "urunler": [
         "buyuk_site",
         "logo",
         "sosyal"
        ],
        "adet": 3,
        "oran": 17,
        "liste": 74400,
        "indirim": 12648,
        "toplam": 61752,
        "etiket": "3 items · 17% · 12.648 TL saved"
       }
      ]
     }
    ],
    "yakinda": [
     {
      "kod": "eticaret",
      "ad": "Online store",
      "aciklama": "A store with products, cart, checkout and shipping."
     },
     {
      "kod": "mobil",
      "ad": "Store mobile app",
      "aciklama": "App Store and Google Play app; store fees paid by the customer."
     }
    ],
    "ornek": {
     "urunler": [
      "site",
      "qr",
      "logo"
     ],
     "sube": 0,
     "adet": 3,
     "oran": 17,
     "liste": 48000,
     "indirim": 8160,
     "toplam": 39840
    }
   },
   "esle": {
    "$0": "0 TL",
    "$54": "3.240 TL",
    "$72": "4.320 TL",
    "$75": "4.500 TL",
    "$100": "6.000 TL",
    "$119": "7.140 TL",
    "$120": "7.200 TL",
    "$127": "7.650 TL",
    "$129": "7.752 TL",
    "$136": "8.160 TL",
    "$140": "8.400 TL",
    "$144": "8.670 TL",
    "$150": "9.000 TL",
    "$151": "9.078 TL",
    "$160": "9.600 TL",
    "$200": "12.000 TL",
    "$211": "12.648 TL",
    "$240": "14.400 TL",
    "$250": "15.000 TL",
    "$260": "15.600 TL",
    "$270": "16.200 TL",
    "$280": "16.800 TL",
    "$298": "17.880 TL",
    "$360": "21.600 TL",
    "$396": "23.760 TL",
    "$450": "27.000 TL",
    "$480": "28.800 TL",
    "$500": "30.000 TL",
    "$520": "31.200 TL",
    "$528": "31.680 TL",
    "$581": "34.860 TL",
    "$600": "36.000 TL",
    "$623": "37.350 TL",
    "$631": "37.848 TL",
    "$664": "39.840 TL",
    "$700": "42.000 TL",
    "$706": "42.330 TL",
    "$720": "43.200 TL",
    "$739": "44.322 TL",
    "$750": "45.000 TL",
    "$760": "45.600 TL",
    "$800": "48.000 TL",
    "$840": "50.400 TL",
    "$850": "51.000 TL",
    "$890": "53.400 TL",
    "$960": "57.600 TL",
    "$990": "59.400 TL",
    "$1,029": "61.752 TL",
    "$1,080": "64.800 TL",
    "$1,192": "71.520 TL",
    "$1,200": "72.000 TL",
    "$1,240": "74.400 TL",
    "$1,320": "79.200 TL",
    "$1,440": "86.400 TL",
    "$1,490": "89.400 TL",
    "$1,560": "93.600 TL",
    "$1,680": "100.800 TL",
    "$1,800": "108.000 TL",
    "$1,920": "115.200 TL",
    "$2,040": "122.400 TL",
    "$2,160": "129.600 TL",
    "$2,280": "136.800 TL",
    "$2,400": "144.000 TL"
   }
  }
 }
};
