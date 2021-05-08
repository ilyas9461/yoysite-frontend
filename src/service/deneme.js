const data = [{
  "sonGunSonu": {
    "id": 11,
    "firma_web_id": 45,
    "toplam_satis": 635,
    "toplam_islem": 0,
    "toplam_ciro": 635,
    "nakit_para_tutar": 580,
    "kredi_karti_tutar": 0,
    "banka_tutar": 0,
    "masraf_tutar": 0,
    "gunluk_kasa": 580,
    "devreden_miktar": 580,
    "fark": -205,
    "tarih": "2021-04-27 19:56:16",
    "kasiyer_devreden": "k2",
    "kasiyer_devralan": "",
    "varsa_not": "jhjh",
    "islem_tur": "GUN SONU",
    "web_kayit": 1,
    "picc_stok": 0
  },
  "anlikGunSonu": [{
    "ad": "Toplam Nakit TL",
    "deger": 80
  }, {
    "ad": "Toplam KKartı  TL",
    "deger": 50
  }, {
    "ad": "",
    "deger": ""
  }, {
    "ad": "Kart Yükleme TL",
    "deger": null
  }, {
    "ad": "Deposit TL",
    "deger": null
  }, {
    "ad": "Deposit İade TL",
    "deger": null
  }, {
    "ad": "Kart Promasyon TL",
    "deger": null
  }, {
    "ad": "Satılan Kart Sayısı(Adet)",
    "deger": 0
  }, {
    "ad": "",
    "deger": ""
  }, {
    "ad": "Ürün Satış TL",
    "deger": null
  }, {
    "ad": "",
    "deger": ""
  }]
}];

const header = {
  host: '192.168.1.124:3000',
  connection: 'keep-alive',
  'content-length': '17',
  accept: 'application/json',
  'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
  token: '123456789',
  'content-type': 'application/json',
  origin: 'http://192.168.1.124:8080',
  referer: 'http://192.168.1.124:8080/',
  'accept-encoding': 'gzip, deflate',
  'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
}