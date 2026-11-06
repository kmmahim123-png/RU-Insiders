export interface TouristSpot {
  id: string;
  rankNo: string;
  nameBn: string;
  nameEn: string;
  districtBn: string;
  districtId: string;
  locationBn: string;
  descriptionBn: string;
  imageUrl: string;
  images?: string[];
  mapPlaceId?: string;
  mapRegion?: 'ru' | 'rcc' | 'rajshahi';
  portalUrl?: string;
  tags?: string[];
}

export interface DistrictInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  spotCount: number;
  portalUrl: string;
  color: string;
}

export const RAJSHAHI_DIVISION_DISTRICTS: DistrictInfo[] = [
  {
    "id": "rajshahi",
    "nameBn": "০১. রাজশাহী জেলা",
    "nameEn": "Rajshahi District",
    "spotCount": 9,
    "portalUrl": "https://rajshahi.gov.bd/pages/tourist-spot",
    "color": "#15803d"
  },
  {
    "id": "sirajganj",
    "nameBn": "০২. সিরাজগঞ্জ জেলা",
    "nameEn": "Sirajganj District",
    "spotCount": 16,
    "portalUrl": "https://sirajganj.gov.bd/pages/static-pages/697fbb0c35ce18e1c06cbb3a",
    "color": "#0284c7"
  },
  {
    "id": "pabna",
    "nameBn": "০৩. পাবনা জেলা",
    "nameEn": "Pabna District",
    "spotCount": 18,
    "portalUrl": "https://pabna.gov.bd/pages/tourist-spot",
    "color": "#7c3aed"
  },
  {
    "id": "bogura",
    "nameBn": "০৪. বগুড়া জেলা",
    "nameEn": "Bogura District",
    "spotCount": 9,
    "portalUrl": "https://bogura.gov.bd/pages/tourist-spot",
    "color": "#b45309"
  },
  {
    "id": "natore",
    "nameBn": "০৫. নাটোর জেলা",
    "nameEn": "Natore District",
    "spotCount": 11,
    "portalUrl": "https://natore.gov.bd/pages/tourist-spot",
    "color": "#db2777"
  },
  {
    "id": "joypurhat",
    "nameBn": "০৬. জয়পুরহাট জেলা",
    "nameEn": "Joypurhat District",
    "spotCount": 8,
    "portalUrl": "https://joypurhat.gov.bd/pages/tourist-spot",
    "color": "#4f46e5"
  },
  {
    "id": "chapainawabganj",
    "nameBn": "০৭. চাঁপাইনবাবগঞ্জ জেলা",
    "nameEn": "Chapainawabganj District",
    "spotCount": 13,
    "portalUrl": "https://chapainawabganj.gov.bd/pages/tourist-spot",
    "color": "#ea580c"
  },
  {
    "id": "naogaon",
    "nameBn": "০৮. নওগাঁ জেলা",
    "nameEn": "Naogaon District",
    "spotCount": 11,
    "portalUrl": "https://naogaon.gov.bd/pages/tourist-spot",
    "color": "#0d9488"
  }
];

export const DIVISION_ALL_95_SPOTS: TouristSpot[] = [
  {
    "id": "spot-rj-zoo",
    "rankNo": "০১",
    "nameBn": "রাজশাহী কেন্দ্রীয় বোটানিক্যাল গার্ডেন ও চিড়িয়াখানা",
    "nameEn": "Rajshahi Central Botanic Garden & Zoo",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "রাজপাড়া ও কোর্ট এলাকা, রাজশাহী মহানগর",
    "descriptionBn": "পদ্মা নদীর তীরে অবস্থিত শহীদ এ.এইচ.এম কামারুজ্জামান কেন্দ্রীয় উদ্যান ও চিড়িয়াখানা। বিশাল কৃত্রিম লেক, হরিণ, বাঘ, বানর ও দুর্লভ বোটানিক্যাল বৃক্ষরাজি।",
    "imageUrl": "https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_kamruzzaman_park",
    "mapRegion": "rcc",
    "tags": [
      "চিড়িয়াখানা",
      "বোটানিক্যাল গার্ডেন",
      "লেক"
    ]
  },
  {
    "id": "spot-rj-padma",
    "rankNo": "০২",
    "nameBn": "পদ্মার পাড় (টি-বাঁধ, লালনশাহ মুক্তমঞ্চ ও বড়কুঠি রিভারভিউ)",
    "nameEn": "Padma Riverbank & T-Groin Promenade",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "জিরো পয়েন্ট থেকে কোর্ট সড়ক বরাবর পদ্মা তীর",
    "descriptionBn": "রাজশাহীর প্রাণকেন্দ্র পদ্মা নদীর তীরবর্তী টি-বাঁধ, আই-বাঁধ, লালনশাহ মঞ্চ এবং বড়কুঠি সংলগ্ন মনোরম রিভারভিউ ওয়াকওয়ে। সূর্যাস্ত ও মুক্ত বাতাসের অন্যতম কেন্দ্র।",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_padma_t_bandh",
    "mapRegion": "rcc",
    "tags": [
      "পদ্মা পাড়",
      "টি-বাঁধ",
      "সূর্যাস্ত"
    ]
  },
  {
    "id": "spot-rj-puthia",
    "rankNo": "০৩",
    "nameBn": "পুঠিয়া শিবমন্দির ও রাজবাড়ি চত্বর",
    "nameEn": "Puthia Shiva Temple & Palace Complex",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "পুঠিয়া উপজেলা সদর, রাজশাহী",
    "descriptionBn": "১৮২৩ সালে রাণী ভুবনময়ী দেবী নির্মিত বাংলাদেশের বৃহত্তম শিব মন্দির এবং পঞ্চরত্ন গোবিন্দ মন্দির ও সুবিশাল পুঠিয়া রাজবাড়ি। টেরাকোটা ও পাথুরে অলংকরণ সমৃদ্ধ।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_puthia_rajbari",
    "mapRegion": "rajshahi",
    "tags": [
      "শিবমন্দির",
      "টেরাকোটা",
      "পুঠিয়া রাজবাড়ি"
    ]
  },
  {
    "id": "spot-rj-bagha",
    "rankNo": "০৪",
    "nameBn": "বাঘা মসজিদ (১৫২৩ খ্রিষ্টাব্দ)",
    "nameEn": "Historical Bagha Shahi Mosque (1523 AD)",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "বাঘা উপজেলা, রাজশাহী সদর থেকে ৪১ কিমি দক্ষিণ-পূর্বে",
    "descriptionBn": "সুলতান নসরত শাহ নির্মিত সুবিখ্যাত ঐতিহাসিক দশ গম্বুজ বাঘা মসজিদ। অপূর্ব পোড়ামাটির টেরাকোটা নকশা ও ৫০ বিঘার সুবৃহৎ বাঘা দিঘী। ৫০ টাকার নোটে এর চিত্র মুদ্রিত।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_bagha_mosque",
    "mapRegion": "rajshahi",
    "tags": [
      "সুলতানি আমল",
      "টেরাকোটা নকশা",
      "ঐতিহাসিক দিঘী"
    ]
  },
  {
    "id": "spot-rj-varendra",
    "rankNo": "০৫",
    "nameBn": "বরেন্দ্র গবেষণা জাদুঘর",
    "nameEn": "Varendra Research Museum",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "হেতেম খাঁ, রাজশাহী মহানগর",
    "descriptionBn": "১৯১০ সালে প্রতিষ্ঠিত দক্ষিণ এশিয়ার অন্যতম প্রাচীন প্রত্নতাত্ত্বিক গবেষণা জাদুঘর। পাল, সেন ও মধ্যযুগের দুর্লভ ভাস্কর্য ও শিলালিপির অমূল্য ভাণ্ডার।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_varendra_museum",
    "mapRegion": "rcc",
    "tags": [
      "জাদুঘর",
      "পাল-সেন ভাস্কর্য",
      "ঐতিহাসিক প্রত্নতত্ত্ব"
    ]
  },
  {
    "id": "spot-rj-library",
    "rankNo": "০৬",
    "nameBn": "রাজশাহী সাধারণ গ্রন্থাগার (১৮৮৪)",
    "nameEn": "Rajshahi Public Library (1884)",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "মিঞাপাড়া, সাহেব বাজার",
    "descriptionBn": "১৮৮৪ সালে রাজা আনন্দনাথ রায়ের পৃষ্ঠপোষকতায় প্রতিষ্ঠিত দেশের অন্যতম প্রাচীন গণগ্রন্থাগার। দুর্লভ পান্ডুলিপি ও ব্রিটিশ আমলের ঐতিহাসিক নথিপত্রের আধার।",
    "imageUrl": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_public_library",
    "mapRegion": "rcc",
    "tags": [
      "১৮৮৪ সাল",
      "দুর্লভ পান্ডুলিপি",
      "হেরিটেজ"
    ]
  },
  {
    "id": "spot-rj-dargah",
    "rankNo": "০৭",
    "nameBn": "শাহ্ মখদুমের মাজার শরীফ ও দরগাপাড়া",
    "nameEn": "Hazrat Shah Makhdum Ruposh Shrine",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "দরগাপাড়া, পদ্মা নদীর তীর, রাজশাহী",
    "descriptionBn": "ত্রয়োদশ শতাব্দীর সুফি সাধক হযরত শাহ্ মখদুম রূপোশ (রহ.)-এর মাজার। প্রতি বছর দূর-দূরান্ত থেকে হাজারো ভক্তের আগমন ঘটে। সংলগ্ন পদ্মা নদীর দৃশ্য অত্যন্ত শান্তিময়।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_shah_makhdum",
    "mapRegion": "rcc",
    "tags": [
      "সুফি মাজার",
      "পদ্মা তীর",
      "দরগাপাড়া"
    ]
  },
  {
    "id": "spot-rj-ru",
    "rankNo": "০৮",
    "nameBn": "রাজশাহী বিশ্ববিদ্যালয় (মতিহারের সবুজ চত্বর ও প্যারিস রোড)",
    "nameEn": "Rajshahi University Campus & Paris Road",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "মতিহার, রাজশাহী-৬২০৫",
    "descriptionBn": "৭৫৩ একরের সুবিশাল সবুজ ক্যাম্পাস, সুউচ্চ গগনশিরীষ বৃক্ষশোভিত নান্দনিক প্যারিস রোড, সাবাস বাংলাদেশ ভাস্কর্য, শহীদ স্মৃতি সংগ্রহশালা ও বধ্যভূমি স্মৃতিস্তম্ভ।",
    "imageUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_ru_campus_zone",
    "mapRegion": "ru",
    "tags": [
      "প্যারিস রোড",
      "সাবাস বাংলাদেশ",
      "৪২ টেরিটরি"
    ]
  },
  {
    "id": "spot-rj-college",
    "rankNo": "০৯",
    "nameBn": "ঐতিহ্যবাহী রাজশাহী কলেজ ও লাল ভবন (১৮৭৩)",
    "nameEn": "Historic Rajshahi College & Red Heritage Building",
    "districtBn": "রাজশাহী",
    "districtId": "rajshahi",
    "locationBn": "সাহেব বাজার, রাজশাহী সদর",
    "descriptionBn": "১৮৭৩ সালে প্রতিষ্ঠিত বাংলাদেশের তৃতীয় প্রাচীনতম শিক্ষাপ্রতিষ্ঠান। ব্রিটিশ আমলের মনোরম লাল ইট স্থাপত্য, ফুলার ভবন এবং ১৯৫২ সালের স্মৃতিবাহী দেশের প্রথম শহীদ মিনার।",
    "imageUrl": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "mapPlaceId": "rj_rajshahi_college",
    "mapRegion": "rcc",
    "tags": [
      "১৮৭৩ সাল",
      "ব্রিটিশ লাল ভবন",
      "প্রথম শহীদ মিনার"
    ]
  },
  {
    "id": "spot-siraj-01",
    "rankNo": "০১",
    "nameBn": "হার্ডপয়েন্ট ও যমুনা রিভারভিউ",
    "nameEn": "Sirajganj Hardpoint Riverview",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "সিরাজগঞ্জ শহর রক্ষা বাঁধ, যমুনা তীর",
    "descriptionBn": "যমুনার উত্তাল ঢেউ ও নৈসর্গিক সৌন্দর্য উপভোগের প্রধান পর্যটন কেন্দ্র। নদী তীরের সুদীর্ঘ পাথুরে বাঁধ ও সূর্যাস্তের অসাধারণ দৃশ্য।",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "যমুনা নদী",
      "হার্ডপয়েন্ট",
      "রিভারভিউ"
    ]
  },
  {
    "id": "spot-siraj-02",
    "rankNo": "০২",
    "nameBn": "যমুনা বহুমুখী সেতু (বঙ্গবন্ধু সেতু)",
    "nameEn": "Jamuna Multipurpose Bridge",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "সিরাজগঞ্জ-টাঙ্গাইল যমুনা নদী",
    "descriptionBn": "৪.৮ কিমি দীর্ঘ বাংলাদেশের উত্তরাঞ্চলের প্রবেশদ্বার। যমুনা নদীর ওপর নির্মিত স্থাপত্যশৈলীর অন্যতম বিস্ময় ও দেশের প্রধান সংযোগ সেতু।",
    "imageUrl": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "যমুনা সেতু",
      "বঙ্গবন্ধু সেতু",
      "মেগাস্ট্রাকচার"
    ]
  },
  {
    "id": "spot-siraj-03",
    "rankNo": "০৩",
    "nameBn": "ঐতিহাসিক ইলিয়ট ব্রীজ",
    "nameEn": "Historic Elliot Bridge",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "কাটাখালী নদী, সিরাজগঞ্জ শহর",
    "descriptionBn": "১৮৯৮ সালে ব্রিটিশ আমলে নির্মিত ধনুকাকৃতি লোহার সেতু। কোনো স্তম্ভ ছাড়া নির্মিত এ সেতুর স্থাপত্যশৈলী অত্যন্ত আকর্ষণীয়।",
    "imageUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "১৮৯৮ সাল",
      "ব্রিটিশ সেতু",
      "লোহার আর্চ"
    ]
  },
  {
    "id": "spot-siraj-04",
    "rankNo": "০৪",
    "nameBn": "মখদুম শাহের মাজার শরীফ",
    "nameEn": "Makhdum Shah Shrine",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "শাহজাদপুর, সিরাজগঞ্জ",
    "descriptionBn": "হযরত মখদুম শাহ দৌলা শহীদ (রহ.) এর ঐতিহাসিক মাজার শরীফ ও প্রাচীন ইসলামী ঐতিহ্যবাহী তীর্থস্থান।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "সুফি মাজার",
      "শাহজাদপুর",
      "ইতিহাস"
    ]
  },
  {
    "id": "spot-siraj-05",
    "rankNo": "০৫",
    "nameBn": "রবীন্দ্র-কাচারিবাড়ি",
    "nameEn": "Rabindra Kachharibari, Shahjadpur",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "শাহজাদপুর উপজেলা",
    "descriptionBn": "বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের স্মৃতিবিজড়িত দ্বিতল ঐতিহাসিক কাচারিবাড়ি ও জাদুঘর। এখানে কবি বহু কালজয়ী কবিতা, নাটক ও গল্প রচনা করেছিলেন।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "রবীন্দ্রনাথ ঠাকুর",
      "কাচারিবাড়ি",
      "সাহিত্য ঐতিহ্য"
    ]
  },
  {
    "id": "spot-siraj-06",
    "rankNo": "০৬",
    "nameBn": "শাহজাদপুর মসজিদ (দরগাহ মসজিদ)",
    "nameEn": "Historic Shahjadpur Dargah Mosque",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "শাহজাদপুর",
    "descriptionBn": "মধ্যযুগীয় ইসলামী স্থাপত্যের নিদর্শন। ১৫টি গম্বুজ বিশিষ্ট অতি প্রাচীন পাথুরে স্তম্ভের মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "প্রাচীন মসজিদ",
      "শাহজাদপুর",
      "মধ্যযুগ"
    ]
  },
  {
    "id": "spot-siraj-07",
    "rankNo": "০৭",
    "nameBn": "নবরত্ন মন্দির (উল্লাপাড়া)",
    "nameEn": "Navaratna Temple, Ullapara",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "হাটিকুমরুল, উল্লাপাড়া",
    "descriptionBn": "মধ্যযুগে নির্মিত নয়টি চূড়া বিশিষ্ট দৃষ্টিনন্দন পোড়ামাটির অলংকরণসমৃদ্ধ নবরত্ন হিন্দু মন্দির।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "নবরত্ন মন্দির",
      "হাটিকুমরুল",
      "টেরাকোটা"
    ]
  },
  {
    "id": "spot-siraj-08",
    "rankNo": "০৮",
    "nameBn": "পোতাজিয়া নবরত্ন মন্দির",
    "nameEn": "Potajia Navaratna Temple",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "পোতাজিয়া, শাহজাদপুর",
    "descriptionBn": "পোতাজিয়া গ্রামের শতাব্দী প্রাচীন নান্দনিক হিন্দু মন্দির ও প্রত্নতাত্ত্বিক স্থাপত্যকীর্তি।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "পোতাজিয়া",
      "মন্দির",
      "হেরিটেজ"
    ]
  },
  {
    "id": "spot-siraj-09",
    "rankNo": "০৯",
    "nameBn": "মহকুমার হিন্দু তীর্থ ও দর্শনীয় স্থান",
    "nameEn": "Subdivisional Hindu Pilgrimage Sites",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "সিরাজগঞ্জ সদর ও সংলগ্ন এলাকা",
    "descriptionBn": "প্রাচীন সিরাজগঞ্জ মহকুমার ঐতিহ্যবাহী মন্দির, ঘাট এবং হিন্দু ধর্মাবলম্বীদের ঐতিহাসিক তীর্থ কেন্দ্র।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "তীর্থস্থান",
      "ঐতিহাসিক মন্দির"
    ]
  },
  {
    "id": "spot-siraj-10",
    "rankNo": "১০",
    "nameBn": "মিল্কভিটা কেন্দ্রীয় দুগ্ধ কারখানা",
    "nameEn": "Milkvita Central Dairy Plant",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "বাঘাবাড়ি, শাহজাদপুর",
    "descriptionBn": "বাংলাদেশের বৃহত্তম দুগ্ধ প্রক্রিয়াজাতকরণ কারখানা ও সমবায়ী দুগ্ধ খামার অঞ্চল।",
    "imageUrl": "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "মিল্কভিটা",
      "বাঘাবাড়ি",
      "দুগ্ধ শিল্প"
    ]
  },
  {
    "id": "spot-siraj-11",
    "rankNo": "১১",
    "nameBn": "বাঘাবাড়ি নদী বন্দর",
    "nameEn": "Baghabari River Port",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "বাঘাবাড়ি, শাহজাদপুর",
    "descriptionBn": "উত্তরবঙ্গের অন্যতম প্রধান নদী বন্দর ও সার, জ্বালানি তেল সরবরাহের গুরুত্বপূর্ণ বাণিজ্যিক কেন্দ্র।",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "নদী বন্দর",
      "বাঘাবাড়ি",
      "বাণিজ্য"
    ]
  },
  {
    "id": "spot-siraj-12",
    "rankNo": "১২",
    "nameBn": "চলন বিল (সিরাজগঞ্জ অংশ)",
    "nameEn": "Chalan Beel (Sirajganj Part)",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "তাড়াশ ও উল্লাপাড়া উপজেলা",
    "descriptionBn": "বাংলাদেশের সর্ববৃহৎ প্রাকৃতিক জলাভূমি চলন বিলের নয়নাভিরাম জলরাশি ও বর্ষার প্লাবনভূমি।",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "চলন বিল",
      "জলরাশি",
      "নৌভ্রমণ"
    ]
  },
  {
    "id": "spot-siraj-13",
    "rankNo": "১৩",
    "nameBn": "হুড়াসাগর নদী ও মোহনা",
    "nameEn": "Hurasagar River & Confluence",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "শাহজাদপুর ও বেলকুচি",
    "descriptionBn": "যমুনার সাথে মিলিত হওয়া শান্ত জলরাশির নদী ও ঐতিহ্যবাহী নৌপথ।",
    "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "হুড়াসাগর",
      "নদী",
      "প্রকৃতি"
    ]
  },
  {
    "id": "spot-siraj-14",
    "rankNo": "১৪",
    "nameBn": "জয়সাগর দিঘী",
    "nameEn": "Joysagar Dighi",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "রায়গঞ্জ উপজেলা",
    "descriptionBn": "সেন বংশের রাজা জয়সেনের স্মৃতিবিজড়িত ঐতিহাসিক সুবিশাল দিঘী। শীতকালে অতিথি পাখির কলকাকলিতে মুখরিত থাকে।",
    "imageUrl": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "দিঘী",
      "রায়গঞ্জ",
      "ঐতিহাসিক"
    ]
  },
  {
    "id": "spot-siraj-15",
    "rankNo": "১৫",
    "nameBn": "রাউতারা বাঁধ ও স্লুইসগেট",
    "nameEn": "Rautara Dam & Sluice Gate",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "শাহজাদপুর উপজেলা",
    "descriptionBn": "বর্ষা মৌসুমে বিশাল জলরাশি ও স্লুইসগেটের গর্জন দেখতে দূর-দূরান্ত থেকে পর্যটকরা ভিড় জমান।",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "স্লুইসগেট",
      "জলপ্রপাত সদৃশ",
      "শাহজাদপুর"
    ]
  },
  {
    "id": "spot-siraj-16",
    "rankNo": "১৬",
    "nameBn": "ঐতিহ্যবাহী তাঁত শিল্প ও তাঁতপল্লী",
    "nameEn": "Traditional Handloom Weaving Village",
    "districtBn": "সিরাজগঞ্জ",
    "districtId": "sirajganj",
    "locationBn": "বেলকুচি ও এনায়েতপুর",
    "descriptionBn": "বিশ্ববিখ্যাত সিরাজগঞ্জের তাঁতের শাড়ি, লুঙ্গি ও গামছার জীবন্ত উৎপাদন কেন্দ্র ও হাজারো হস্তচালিত তাঁতের খটখট শব্দমুখর পল্লী।",
    "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "তাঁত শিল্প",
      "বেলকুচি",
      "হস্তশিল্প"
    ]
  },
  {
    "id": "spot-pabna-01",
    "rankNo": "০১",
    "nameBn": "আটঘরিয়া বংশীপাড়া গ্রামের চন্দ্রাবতীর ঘাট",
    "nameEn": "Chandrabati Ghat, Atgharia",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "আটঘরিয়া উপজেলা, বংশীপাড়া",
    "descriptionBn": "ঐতিহাসিক চন্দ্রাবতী নদীর পাড় ও লোকগাঁথার ঐতিহ্যবাহী নান্দনিক প্রাকৃতিক ঘাট।",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "চন্দ্রাবতী ঘাট",
      "আটঘরিয়া",
      "লোকঐতিহ্য"
    ]
  },
  {
    "id": "spot-pabna-02",
    "rankNo": "০২",
    "nameBn": "ঈশ্বরদী রেল জংশন",
    "nameEn": "Ishwardi Railway Junction",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "ঈশ্বরদী উপজেলা",
    "descriptionBn": "ব্রিটিশ আমলে ১৮৮৪ সালে প্রতিষ্ঠিত উত্তর ও দক্ষিণবঙ্গের অন্যতম বৃহত্তম ও প্রাচীনতম রেল জংশন।",
    "imageUrl": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "রেল জংশন",
      "ঈশ্বরদী",
      "ব্রিটিশ স্থাপত্য"
    ]
  },
  {
    "id": "spot-pabna-03",
    "rankNo": "০৩",
    "nameBn": "তাঁতীবন্দ জমিদার বাড়ী",
    "nameEn": "Tatibandha Zamindar Bari",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "সুজানগর উপজেলা, তাঁতীবন্দ",
    "descriptionBn": "সুজানগরের প্রাচীন জমিদার বংশের দৃষ্টিনন্দন কারুকার্যখচিত শতাব্দী প্রাচীন প্রাসাদ ও নাটমন্দির।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "জমিদার বাড়ি",
      "সুজানগর",
      "টেরাকোটা"
    ]
  },
  {
    "id": "spot-pabna-04",
    "rankNo": "০৪",
    "nameBn": "সুজানগর আজিম চৌধুরী জমিদার বাড়ী",
    "nameEn": "Azim Chowdhury Zamindar Bari",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "দুলাই, সুজানগর",
    "descriptionBn": "দুলাই গ্রামের ঐতিহাসিক আজিম চৌধুরীর সুরম্য জমিদার প্রাসাদ ও প্রাচীন সিংহদ্বার।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "জমিদার প্রাসাদ",
      "দুলাই"
    ]
  },
  {
    "id": "spot-pabna-05",
    "rankNo": "০৫",
    "nameBn": "গজনার বিল",
    "nameEn": "Gojnar Beel Wetland",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "সুজানগর উপজেলা",
    "descriptionBn": "পাবনার বৃহত্তম প্রাকৃতিক জলাভূমি। সুবিশাল জলরাশি, পদ্মবন ও শীতকালে পরিযায়ী পাখির অভয়ারণ্য।",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "গজনার বিল",
      "জলরাশি",
      "পাখির অভয়ারণ্য"
    ]
  },
  {
    "id": "spot-pabna-06",
    "rankNo": "০৬",
    "nameBn": "চাটমোহর শাহী মসজিদ (১৫৮১ খ্রি.)",
    "nameEn": "Historical Chatmohar Shahi Mosque",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "চাটমোহর উপজেলা সদর",
    "descriptionBn": "মোঘল সুবেদার মাসুম খাঁ কাবুলী ১৫৮১ সালে নির্মিত ঐতিহাসিক তিন গম্বুজবিশিষ্ট প্রাচীন শাহী মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "মোঘল স্থাপত্য",
      "১৫৮১ সাল",
      "চাটমোহর"
    ]
  },
  {
    "id": "spot-pabna-07",
    "rankNo": "০৭",
    "nameBn": "লালন শাহ সেতু",
    "nameEn": "Lalon Shah Bridge, Paksey",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "পাকশী, ঈশ্বরদী",
    "descriptionBn": "পদ্মা নদীর ওপর নির্মিত ১.৮ কিমি দীর্ঘ দৃষ্টিনন্দন সড়ক সেতু যা উত্তর ও দক্ষিণ-পশ্চিম বাংলাদেশকে যুক্ত করেছে।",
    "imageUrl": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "লালন শাহ সেতু",
      "পাকশী",
      "পদ্মা নদী"
    ]
  },
  {
    "id": "spot-pabna-08",
    "rankNo": "০৮",
    "nameBn": "প্রমথ চৌধুরীর পৈত্রিক নিবাস",
    "nameEn": "Ancestral Home of Pramatha Chaudhuri",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "হরিপুর, চাটমোহর",
    "descriptionBn": "বাংলা চলিত গদ্যরীতির প্রবর্তক ও বিখ্যাত সাহিত্যিক প্রমথ চৌধুরীর ঐতিহাসিক পৈতৃক বাড়ি।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "প্রমথ চৌধুরী",
      "সাহিত্যিক বাড়ি",
      "চাটমোহর"
    ]
  },
  {
    "id": "spot-pabna-09",
    "rankNo": "০৯",
    "nameBn": "কিংবদন্তী নায়িকা সুচিত্রা সেনের স্মৃতি সংগ্রহশালা",
    "nameEn": "Suchitra Sen Memorial Museum",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "গোপালপুর, পাবনা শহর",
    "descriptionBn": "উপমহাদেশের অবিসংবাদিত রূপালী পর্দার মহানায়িকা সুচিত্রা সেনের শৈশবের স্মৃতিঘেরা পৈতৃক বাড়ি ও স্মৃতি সংগ্রহশালা।",
    "imageUrl": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "সুচিত্রা সেন",
      "স্মৃতি সংগ্রহশালা",
      "পাবনা শহর"
    ]
  },
  {
    "id": "spot-pabna-10",
    "rankNo": "১০",
    "nameBn": "এডরুক লিমিটেড, পাবনা (১৯৪৮)",
    "nameEn": "Edruc Limited Heritage Plant",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "পাবনা সদর",
    "descriptionBn": "১৯৪৮ সালে প্রতিষ্ঠিত বাংলাদেশের ওষুধ শিল্পের অন্যতম পথিকৃৎ ঐতিহাসিক প্রতিষ্ঠান।",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "এডরুক",
      "ফার্মাসিউটিক্যাল ঐতিহ্য"
    ]
  },
  {
    "id": "spot-pabna-11",
    "rankNo": "১১",
    "nameBn": "পাবনা মানসিক হাসপাতাল (১৯৫৭)",
    "nameEn": "Pabna Mental Hospital (Est. 1957)",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "হেমায়েতপুর, পাবনা সদর",
    "descriptionBn": "১৯৫৭ সালে প্রতিষ্ঠিত উপমহাদেশের বিখ্যাত ও বাংলাদেশের একমাত্র পূর্ণাঙ্গ বিশেষায়িত মানসিক স্বাস্থ্য ইনস্টিটিউট। মনোরম সুবৃক্ষশোভিত ক্যাম্পাস।",
    "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "হেমায়েতপুর",
      "মানসিক হাসপাতাল",
      "ঐতিহাসিক"
    ]
  },
  {
    "id": "spot-pabna-12",
    "rankNo": "১২",
    "nameBn": "পাবনার ঐতিহ্যবাহী তাঁতশিল্প",
    "nameEn": "Traditional Handloom Heritage of Pabna",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "দোগাছী ও আতাইকুলা",
    "descriptionBn": "পাবনার বিশ্বখ্যাত সুতি ও জামদানি শাড়ির সূতিকাগার। কারিগরদের নিপুণ বুননশিল্প ও তাঁতপল্লী।",
    "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "তাঁতশিল্প",
      "দোগাছী শাড়ি",
      "ঐতিহ্য"
    ]
  },
  {
    "id": "spot-pabna-13",
    "rankNo": "১৩",
    "nameBn": "শ্রী শ্রী ঠাকুর অনুকূল চন্দ্রের সৎসঙ্গ (আশ্রম-মন্দির)",
    "nameEn": "Satsang Ashram of Thakur Anukulchandra",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "হেমায়েতপুর, পদ্মা তীর",
    "descriptionBn": "যুগপুরুষোত্তম শ্রী শ্রী ঠাকুর অনুকূল চন্দ্রের জন্মভূমি ও বিশ্ববিখ্যাত আন্তর্জাতিক সৎসঙ্গ আশ্রম মন্দির।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "অনুকূল ঠাকুর",
      "সৎসঙ্গ আশ্রম",
      "হেমায়েতপুর"
    ]
  },
  {
    "id": "spot-pabna-14",
    "rankNo": "১৪",
    "nameBn": "তাড়াশ জমিদার ভবন",
    "nameEn": "Tarash Palace, Pabna Town",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "পাবনা শহরের প্রাণকেন্দ্র",
    "descriptionBn": "তাড়াশের প্রতাপশালী জমিদারদের নির্মিত দৃষ্টিনন্দন ইউরোপীয় রীতির রাজপ্রাসাদ।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "তাড়াশ রাজপ্রাসাদ",
      "ইউরোপীয় স্থাপত্য"
    ]
  },
  {
    "id": "spot-pabna-15",
    "rankNo": "১৫",
    "nameBn": "জোড় বাংলা মন্দির (১৮ শতক)",
    "nameEn": "Jor Bangla Hindu Temple",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "জোড় বাংলা পাড়া, পাবনা সদর",
    "descriptionBn": "অষ্টাদশ শতকে নির্মিত দুটি দোচালা ঘরের সমন্বয়ে অনন্য স্থাপত্যরীতির প্রত্নতাত্ত্বিক জোড় বাংলা মন্দির।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "জোড় বাংলা",
      "প্রাচীন মন্দির",
      "টেরাকোটা"
    ]
  },
  {
    "id": "spot-pabna-16",
    "rankNo": "১৬",
    "nameBn": "ভাড়ারা শাহী মসজিদ",
    "nameEn": "Bharara Shahi Mosque",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "ভাড়ারা ইউনিয়ন, পাবনা সদর",
    "descriptionBn": "১৭৫৭ সালে নির্মিত ঐতিহাসিক মোঘল স্থাপত্যের তিন গম্বুজবিশিষ্ট প্রত্নতাত্ত্বিক মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ভাড়ারা মসজিদ",
      "মোঘল স্থাপত্য"
    ]
  },
  {
    "id": "spot-pabna-17",
    "rankNo": "১৭",
    "nameBn": "পাকশীস্থ হার্ডিঞ্জ ব্রিজ (১৯১৫)",
    "nameEn": "Historic Hardinge Bridge (1915)",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "পাকশী, ঈশ্বরদী, পদ্মা নদী",
    "descriptionBn": "১৯১৫ সালে লর্ড হার্ডিঞ্জ কর্তৃক উন্মুক্ত শতবর্ষী ঐতিহাসিক রেল সেতু। স্টিল ট্রাস ইঞ্জিনিয়ারিংয়ের এক অনুপম নিদর্শন।",
    "imageUrl": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "হার্ডিঞ্জ ব্রিজ",
      "শতবর্ষী সেতু",
      "পাকশী"
    ]
  },
  {
    "id": "spot-pabna-18",
    "rankNo": "১৮",
    "nameBn": "ক্ষেতুপাড়া জমিদার বাড়ী",
    "nameEn": "Khetupara Zamindar Bari",
    "districtBn": "পাবনা",
    "districtId": "pabna",
    "locationBn": "সাঁথিয়া উপজেলা, ক্ষেতুপাড়া",
    "descriptionBn": "সাঁথিয়া উপজেলার প্রাচীন জমিদার বংশের সুরম্য কারুকার্যখচিত অট্টালিকা ও দৃষ্টিনন্দন দীঘি।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ক্ষেতুপাড়া",
      "জমিদার বাড়ি",
      "সাঁথিয়া"
    ]
  },
  {
    "id": "spot-bogura-01",
    "rankNo": "০১",
    "nameBn": "ঐতিহাসিক যোগীর ভবনের মন্দির",
    "nameEn": "Yogir Bhaban Ancient Temple Complex",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "কাহালু উপজেলা",
    "descriptionBn": "নাথ সম্প্রদায়ের প্রাচীন সাধকদের আস্তানা ও প্রায় সহস্র বছরের প্রাচীন সনাতন মন্দির চত্বর।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "যোগীর ভবন",
      "কাহালু",
      "নাথ মন্দির"
    ]
  },
  {
    "id": "spot-bogura-02",
    "rankNo": "০২",
    "nameBn": "পাঁচপীর মাজার কাহালু",
    "nameEn": "Panchpeer Shrine, Kahaloo",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "কাহালু উপজেলা",
    "descriptionBn": "পাঁচজন সুফি পীর আউলিয়ার ঐতিহাসিক যৌথ মাজার শরীফ ও ধর্মীয় সম্প্রীতির পুণ্যভূমি।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "পাঁচপীর মাজার",
      "কাহালু"
    ]
  },
  {
    "id": "spot-bogura-03",
    "rankNo": "০৩",
    "nameBn": "সারিয়াকান্দির যমুনা নদী ও পানি বন্দর",
    "nameEn": "Sariakandi Jamuna River Port",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "সারিয়াকান্দি উপজেলা",
    "descriptionBn": "যমুনার খরস্রোতা রূপ, চরাঞ্চলের বালুকাভূমি ও নৌভ্রমণের জন্য বগুড়ার প্রধান আকর্ষণ।",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "সারিয়াকান্দি",
      "যমুনা চর",
      "নদী বন্দর"
    ]
  },
  {
    "id": "spot-bogura-04",
    "rankNo": "০৪",
    "nameBn": "সান্তাহার সাইলো (শস্য গুদাম)",
    "nameEn": "Santahar Grain Silo",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "আদমদীঘি উপজেলা, সান্তাহার",
    "descriptionBn": "১৯৬৯ সালে মার্কিন সহায়তায় নির্মিত দেশের বৃহত্তম আধুনিক স্বয়ংক্রিয় খাদ্যশস্য সংরক্ষণাগার।",
    "imageUrl": "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "সান্তাহার সাইলো",
      "ঐতিহাসিক স্থাপনা"
    ]
  },
  {
    "id": "spot-bogura-05",
    "rankNo": "০৫",
    "nameBn": "মহাস্থানগড় (প্রাচীন পুণ্ড্রনগর)",
    "nameEn": "Mahasthangarh (Ancient Pundranagara)",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "শিবগঞ্জ উপজেলা, করতোয়া তীর",
    "descriptionBn": "খ্রিষ্টপূর্ব তৃতীয় শতকের প্রাচীন পুণ্ড্রবর্ধন রাজ্যের রাজধানী। বাংলাদেশের প্রাচীনতম সুউচ্চ দুর্গনগরী, জাদুঘর ও বৈরাগীর ভিটা।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "পুণ্ড্রনগর",
      "মহাস্থানগড়",
      "খ্রিস্টপূর্ব ৩য় শতক"
    ]
  },
  {
    "id": "spot-bogura-06",
    "rankNo": "০৬",
    "nameBn": "বেহুলা লক্ষ্মীন্দর (গোকুল মেধ)",
    "nameEn": "Gokul Medh (Behula-Lakshmindar Bastion)",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "গোকুল, বগুড়া সদর",
    "descriptionBn": "লোকগাথা বেহুলা-লক্ষ্মীন্দরের বাসরঘর হিসেবে খ্যাত ষষ্ঠ শতকের সুবিশাল বৌদ্ধ স্তূপ ও টেরাকোটা স্তম্ভ।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "বেহুলার বাসরঘর",
      "গোকুল মেধ",
      "স্তূপ"
    ]
  },
  {
    "id": "spot-bogura-07",
    "rankNo": "০৭",
    "nameBn": "দেওতা খানকাহ্ মাজার শরিফ, নন্দীগ্রাম",
    "nameEn": "Deota Khanqah Shrine, Nandigram",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "নন্দীগ্রাম উপজেলা",
    "descriptionBn": "প্রাচীন সুফি সাধকদের স্মৃতিধন্য ধর্মীয় সাধনালয় ও ঐতিহাসিক খানকাহ্ চত্বর।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "দেওতা খানকাহ্",
      "নন্দীগ্রাম"
    ]
  },
  {
    "id": "spot-bogura-08",
    "rankNo": "০৮",
    "nameBn": "বাবুর পুকুর গণকবর, শাজাহানপুর",
    "nameEn": "Babur Pukur Mass Grave Memorial",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "শাজাহানপুর উপজেলা",
    "descriptionBn": "১৯৭১ সালের মহান মুক্তিযুদ্ধে পাকিস্তানি হানাদার বাহিনীর নির্মম গণহত্যার স্মারক ঐতিহাসিক গণকবর।",
    "imageUrl": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "গণকবর",
      "মুক্তিযুদ্ধ",
      "শাজাহানপুর"
    ]
  },
  {
    "id": "spot-bogura-09",
    "rankNo": "০৯",
    "nameBn": "জয়পীরের মাজার, দুপচাঁচিয়া",
    "nameEn": "Joypeer Shrine, Dupchanchia",
    "districtBn": "বগুড়া",
    "districtId": "bogura",
    "locationBn": "দুপচাঁচিয়া উপজেলা",
    "descriptionBn": "দুপচাঁচিয়ার শতবর্ষী সুফি আউলিয়া জয়পীরের ঐতিহাসিক মাজার ও বার্ষিক ওরশ মাহফিল কেন্দ্র।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "জয়পীর",
      "দুপচাঁচিয়া",
      "মাজার"
    ]
  },
  {
    "id": "spot-natore-01",
    "rankNo": "০১",
    "nameBn": "উত্তরা গণভবন (দিঘাপতিয়া রাজবাড়ি)",
    "nameEn": "Uttara Gonobhaban (Dighapatia Palace)",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "নাটোর সদর থেকে ২.৫ কিমি উত্তরে",
    "descriptionBn": "১৭৩৪ সালে দয়ারাম রায় প্রতিষ্ঠিত দিঘাপতিয়া রাজবাড়ি। বর্তমানে উত্তরবঙ্গে সরকারপ্রধান ও রাষ্ট্রপতির সরকারি বাসভবন। মনোরম ঘড়িঘর ও ইতালিয়ান মার্বেল ভাস্কর্য।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "উত্তরা গণভবন",
      "দিঘাপতিয়া",
      "রাজপ্রাসাদ"
    ]
  },
  {
    "id": "spot-natore-02",
    "rankNo": "০২",
    "nameBn": "রাণী ভবানী রাজবাড়ী (নাটোর রাজবাড়ি)",
    "nameEn": "Rani Bhabani Palace Complex",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "নাটোর শহরের প্রাণকেন্দ্র",
    "descriptionBn": "অষ্টাদশ শতকের মহীয়সী নারী নাটোরের রাণী ভবানীর সুরম্য রাজপ্রাসাদ, শ্যামসুন্দর মন্দির, আনন্দ ভবন ও প্রাচীন দীঘি।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "রাণী ভবানী",
      "নাটোর রাজবাড়ি",
      "ঐতিহাসিক"
    ]
  },
  {
    "id": "spot-natore-03",
    "rankNo": "০৩",
    "nameBn": "ধরাইল জমিদার বাড়ি",
    "nameEn": "Dharail Zamindar Bari",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "ধরাইল, নাটোর সদর",
    "descriptionBn": "ধরাইলের প্রাচীন জমিদারদের দৃষ্টিনন্দন কারুকার্যময় বাসভবন ও প্রাচীন নাটমণ্ডপ।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ধরাইল",
      "জমিদার বাড়ি"
    ]
  },
  {
    "id": "spot-natore-04",
    "rankNo": "০৪",
    "nameBn": "চলন বিল জাদুঘর",
    "nameEn": "Chalan Beel Folk Museum",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "গুরুদাসপুর উপজেলা, খুবজীপুর",
    "descriptionBn": "১৯৭৮ সালে স্থানীয় সংস্কৃতি সংগ্রাহক আব্দুল হামিদ প্রতিষ্ঠিত চলন বিলের মাছ, সংস্কৃতি ও প্রাচীন লোকজ নিদর্শনসমৃদ্ধ জাদুঘর।",
    "imageUrl": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "চলন বিল জাদুঘর",
      "গুরুদাসপুর",
      "লোকজ"
    ]
  },
  {
    "id": "spot-natore-05",
    "rankNo": "০৫",
    "nameBn": "চাপিলা শাহী মসজিদ",
    "nameEn": "Chapila Shahi Mosque",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "গুরুদাসপুর উপজেলা, চাপিলা",
    "descriptionBn": "সুপ্রাচীন মোঘল স্থাপত্যে নির্মিত গম্বুজ ও খিলানযুক্ত ঐতিহাসিক শাহী জামে মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "চাপিলা মসজিদ",
      "মোঘল"
    ]
  },
  {
    "id": "spot-natore-06",
    "rankNo": "০৬",
    "nameBn": "চলন বিল ও তিশিখালী ঘাট",
    "nameEn": "Chalan Beel Waterway, Natore",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "সিংড়া ও গুরুদাসপুর",
    "descriptionBn": "বর্ষায় থৈ থৈ জলরাশির জলপ্রপাত সদৃশ তিশিখালী ও চলনবিল পর্যটন সেতু। নৌকাভ্রমণ ও তাজা মাছের জন্য খ্যাত।",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "চলন বিল",
      "তিশিখালী",
      "সিংড়া"
    ]
  },
  {
    "id": "spot-natore-07",
    "rankNo": "০৭",
    "nameBn": "বনপাড়া লুর্দের রাণী মা মারিয়া ধর্মপল্লী",
    "nameEn": "Lourdes Queen Mother Mary Catholic Shrine",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "বনপাড়া, বড়াইগ্রাম",
    "descriptionBn": "১৯৫৮ সালে প্রতিষ্ঠিত এশিয়ার অন্যতম বড় ক্যাথলিক খ্রিষ্টধর্মীয় উপাসনালয় ও লুর্দের রাণী মা মারিয়ার গির্জা।",
    "imageUrl": "https://images.unsplash.com/photo-1548625361-19e482bf7906?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "বনপাড়া চার্চ",
      "খ্রিষ্টধর্মীয় পল্লী"
    ]
  },
  {
    "id": "spot-natore-08",
    "rankNo": "০৮",
    "nameBn": "দয়ারামপুর রাজবাড়ি",
    "nameEn": "Dayarampur Rajbari",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "দয়ারামপুর, বাগাতিপাড়া",
    "descriptionBn": "দিঘাপতিয়া রাজবংশের ছোট তরফের কুমার শরৎ কুমার রায়ের ঐতিহাসিক সুদৃশ্য বাসভবন। বর্তমানে বাংলাদেশ আর্মি ইউনিভার্সিটি ক্যাম্পাস সংলগ্ন।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "দয়ারামপুর",
      "বাগাতিপাড়া",
      "রাজবাড়ি"
    ]
  },
  {
    "id": "spot-natore-09",
    "rankNo": "০৯",
    "nameBn": "ফকিরচাঁদ বৈষ্ণব গোঁসাইজির আশ্রম",
    "nameEn": "Fakirchand Vaishnav Gosai Ashram",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "বাগাতিপাড়া উপজেলা",
    "descriptionBn": "শতাব্দী প্রাচীন বৈষ্ণব বাউল সাধক ফকিরচাঁদ গোঁসাইয়ের স্মৃতিবিজড়িত মিলনমেলা ও আশ্রম।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ফকিরচাঁদ আশ্রম",
      "বাগাতিপাড়া"
    ]
  },
  {
    "id": "spot-natore-10",
    "rankNo": "১০",
    "nameBn": "শহীদ সাগর (গোপালপুর গণহত্যা স্মৃতি)",
    "nameEn": "Shaheed Sagar Memorial Lake",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "গোপালপুর নর্থ বেঙ্গল সুগার মিলস, লালপুর",
    "descriptionBn": "১৯৭১ সালের ৫ মে নর্থ বেঙ্গল সুগার মিলের জেনারেল ম্যানেজার লে. কমান্ডার আনোয়ার পাশাসহ শতাধিক কর্মকর্তা-কর্মচারীকে যেখানে হত্যা করা হয়েছিল।",
    "imageUrl": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "শহীদ সাগর",
      "মুক্তিযুদ্ধ",
      "লালপুর"
    ]
  },
  {
    "id": "spot-natore-11",
    "rankNo": "১১",
    "nameBn": "হালতি বিল ও মিনি কক্সবাজার (পাটুল)",
    "nameEn": "Halti Beel & Mini Cox's Bazar Patul",
    "districtBn": "নাটোর",
    "districtId": "natore",
    "locationBn": "নলডাঙ্গা উপজেলা, পাটুল",
    "descriptionBn": "বর্ষাকালে হালতি বিলের দিগন্ত বিস্তৃত উত্তাল জলরাশি ও ডুবন্ত সড়কের সৌন্দর্য। উত্তরবঙ্গের পর্যটকদের কাছে এটি \"মিনি কক্সবাজার\" নামে অত্যন্ত জনপ্রিয়।",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "হালতি বিল",
      "মিনি কক্সবাজার",
      "পাটুল"
    ]
  },
  {
    "id": "spot-joypur-01",
    "rankNo": "০১",
    "nameBn": "আছরাঙ্গা দিঘী",
    "nameEn": "Asranga Dighi Historic Lake",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "ক্ষেতলাল উপজেলা",
    "descriptionBn": "তাহিরপুর রাজপরিবারের খননকৃত বিশাল আয়তনের প্রাচীন দিঘী। শীতকালে হাজারো অতিথি পাখির পদচারণায় মুখরিত থাকে।",
    "imageUrl": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "আছরাঙ্গা দিঘী",
      "ক্ষেতলাল"
    ]
  },
  {
    "id": "spot-joypur-02",
    "rankNo": "০২",
    "nameBn": "গোপীনাথপুর মন্দির",
    "nameEn": "Gopinathpur Historic Temple",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "আক্কেলপুর উপজেলা",
    "descriptionBn": "১৫ শতকে নির্মিত শ্রী শ্রী গোপীনাথ জিউর প্রাচীন মন্দির। প্রতি বছর দোল পূর্ণিমায় শতাব্দী প্রাচীন দোল মেলা অনুষ্ঠিত হয়।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "গোপীনাথপুর",
      "দোলমেলা",
      "মন্দির"
    ]
  },
  {
    "id": "spot-joypur-03",
    "rankNo": "০৩",
    "nameBn": "হিন্দা-কসবা শাহী জামে মসজিদ",
    "nameEn": "Hinda-Kasba Shahi Mosque",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "ক্ষেতলাল উপজেলা",
    "descriptionBn": "ইসলামী অনুশাসন ও মোঘল ঐতিহ্যের ছোঁয়ায় নির্মিত চমৎকার শুভ্র মার্বেল কারুকার্যমণ্ডিত পাঁচ গম্বুজ মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "হিন্দা কসবা",
      "মার্বেল মসজিদ",
      "ক্ষেতলাল"
    ]
  },
  {
    "id": "spot-joypur-04",
    "rankNo": "০৪",
    "nameBn": "ঐতিহাসিক নান্দাইল দিঘী",
    "nameEn": "Nandail Dighi Ancient Reservoir",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "কালাই উপজেলা",
    "descriptionBn": "রাজা নন্দলাল ১৬১০ সালে খরা দূর করার জন্য এই সুবিশাল দিঘী খনন করেন। উত্তরবঙ্গের অন্যতম বৃহত্তম জলাধার।",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "নান্দাইল দিঘী",
      "কালাই",
      "১৬১০ সাল"
    ]
  },
  {
    "id": "spot-joypur-05",
    "rankNo": "০৫",
    "nameBn": "লাকমা রাজবাড়ি",
    "nameEn": "Lakma Rajbari Palace",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "পাঁচবিবি উপজেলা, পশ্চিম কড়িয়া",
    "descriptionBn": "ভারত সীমান্ত সংলগ্ন পাঁচবিবি উপজেলায় অবস্থিত শতবর্ষী লাকমা রাজবাড়ির চমৎকার স্থাপত্যিক ধ্বংসাবশেষ।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "লাকমা রাজবাড়ি",
      "পাঁচবিবি",
      "সীমান্তবর্তী"
    ]
  },
  {
    "id": "spot-joypur-06",
    "rankNo": "০৬",
    "nameBn": "নিমাই পিরের মাজার শরীফ",
    "nameEn": "Nimai Pir Shrine",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "পাঁচবিবি উপজেলা",
    "descriptionBn": "মধ্যযুগের আধ্যাত্মিক সুফি সাধক হযরত নিমাই পীরের মাজার ও ঐতিহাসিক ভক্ত সম্মিলন কেন্দ্র।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "নিমাই পির",
      "পাঁচবিবি",
      "মাজার"
    ]
  },
  {
    "id": "spot-joypur-07",
    "rankNo": "০৭",
    "nameBn": "বার শিবালয় মন্দির (বেলআমলা)",
    "nameEn": "Baro Shivalaya Mandir, Belamla",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "জয়পুরহাট সদর, বেলআমলা",
    "descriptionBn": "একত্রে সারিবদ্ধভাবে নির্মিত বারোটি প্রাচীন শিব মন্দির। ছোট যমুনা নদীর তীরে অপূর্ব প্রাচীন স্থাপত্য।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "বার শিবালয়",
      "১২ মন্দির",
      "বেলআমলা"
    ]
  },
  {
    "id": "spot-joypur-08",
    "rankNo": "০৮",
    "nameBn": "প্রাচীন সভ্যতার লীলাভূমি পাথরঘাটা",
    "nameEn": "Ancient Heritage Site Pathorghata",
    "districtBn": "জয়পুরহাট",
    "districtId": "joypurhat",
    "locationBn": "পাঁচবিবি উপজেলা, তুলসীগঙ্গা তীর",
    "descriptionBn": "পাল আমলের বহু প্রত্নতাত্ত্বিক ইট ও পাথরের ধ্বংসাবশেষ ও প্রাচীন বৌদ্ধ সভ্যতার ঐতিহাসিক প্রত্নস্থল।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "পাথরঘাটা",
      "তুলসীগঙ্গা",
      "পাল আমল"
    ]
  },
  {
    "id": "spot-chap-01",
    "rankNo": "০১",
    "nameBn": "তেভাগা আন্দোলনের ইলা মিত্র স্মৃতিসৌধ",
    "nameEn": "Ila Mitra Tebhaga Movement Memorial",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "নাচোল উপজেলা, রাউতারা",
    "descriptionBn": "ঐতিহাসিক কৃষক তেভাগা আন্দোলনের নেত্রী \"রাণীমা\" ইলা মিত্রের সংগ্রামী স্মৃতিসৌধ ও নাচোলের ইতিহাস।",
    "imageUrl": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ইলা মিত্র",
      "নাচোল",
      "তেভাগা আন্দোলন"
    ]
  },
  {
    "id": "spot-chap-02",
    "rankNo": "০২",
    "nameBn": "ঐতিহাসিক আলী শাহপুর মসজিদ",
    "nameEn": "Historic Ali Shahpur Mosque",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "ভোলাহাট উপজেলা",
    "descriptionBn": "সুলতানি আমলের অনিন্দ্য পোড়ামাটির ইটের গাঁথুনি বিশিষ্ট প্রাচীন মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "আলী শাহপুর",
      "ভোলাহাট",
      "সুলতানি আমল"
    ]
  },
  {
    "id": "spot-chap-03",
    "rankNo": "০৩",
    "nameBn": "ঐতিহাসিক ষাঁড়বুরুজ",
    "nameEn": "Sharburuj Ancient Fortress Mound",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "শিবগঞ্জ উপজেলা, গৌড় অঞ্চল",
    "descriptionBn": "প্রাচীন বাংলার রাজধানী গৌড়ের প্রতিরক্ষা প্রাচীর ও ঐতিহাসিক ওয়াচটাওয়ার ঢিবি।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ষাঁড়বুরুজ",
      "গৌড় প্রাচীর",
      "শিবগঞ্জ"
    ]
  },
  {
    "id": "spot-chap-04",
    "rankNo": "০৪",
    "nameBn": "দারসবাড়ী মসজিদ ও মাদ্রাসা (১৪৭৯ খ্রি.)",
    "nameEn": "Darasbari Mosque & Ancient Madrasa",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "শিবগঞ্জ উপজেলা, সীমান্ত এলাকা",
    "descriptionBn": "সুলতান শামসুদ্দীন ইউসুফ শাহের আমলে নির্মিত অবিভক্ত বাংলার প্রাচীনতম উচ্চশিক্ষা প্রতিষ্ঠান ও টেরাকোটা মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "দারসবাড়ী",
      "১৪৭৯ সাল",
      "টেরাকোটা"
    ]
  },
  {
    "id": "spot-chap-05",
    "rankNo": "০৫",
    "nameBn": "ছোট সোনা মসজিদ (১৪৯৩-১৫১৯ খ্রি.)",
    "nameEn": "Choto Sona Mosque (Gaur Gem)",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "শিবগঞ্জ উপজেলা, পিরোজপুর",
    "descriptionBn": "সুলতান আলাউদ্দিন হোসেন শাহের আমলে নির্মিত বাংলার ইসলামী স্থাপত্যের রত্ন। ১৫টি গম্বুজ সোনালি পাতে মোড়ানো ছিল বলে একে ছোট সোনা মসজিদ বলা হয়।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ছোট সোনা মসজিদ",
      "গৌড়ের রত্ন",
      "১৫ গম্বুজ"
    ]
  },
  {
    "id": "spot-chap-06",
    "rankNo": "০৬",
    "nameBn": "বাবু ডাইং প্রাকৃতিক বন ও লাল মাটির টিলা",
    "nameEn": "Babu Dying Nature Spot & Red Ridges",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "ঝিলিম ইউনিয়ন, সদর",
    "descriptionBn": "বরেন্দ্র অঞ্চলের লাল মাটির ছোট ছোট টিলা, প্রাকৃতিক নির্ঝরিণী ও ছায়াশীতল পিকনিক স্পট।",
    "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "বাবু ডাইং",
      "লাল মাটির টিলা",
      "প্রকৃতি"
    ]
  },
  {
    "id": "spot-chap-07",
    "rankNo": "০৭",
    "nameBn": "তিন গম্বুজ মসজিদ",
    "nameEn": "Three Domed Historical Mosque",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "শিবগঞ্জ, ছোট সোনা সংলগ্ন",
    "descriptionBn": "মুঘল আমলের ঐতিহ্যবাহী তিন গম্বুজ বিশিষ্ট সুষম খিলানের শৈল্পিক মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "তিন গম্বুজ",
      "মুঘল আমল"
    ]
  },
  {
    "id": "spot-chap-08",
    "rankNo": "০৮",
    "nameBn": "শাহ্ সুজার তাহখানা কমপ্লেক্স ও হাম্মামখানা",
    "nameEn": "Shah Shuja Tahakhana Palace & Hammam",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "পিরোজপুর, শিবগঞ্জ",
    "descriptionBn": "১৬৫৫ সালে মুঘল সুবেদার শাহ সুজা কর্তৃক নির্মিত শীতাতপ নিয়ন্ত্রিত দ্বিতল গ্রীষ্মকালীন বিশ্রামাগার, হাম্মামখানা ও দিঘী।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "তাহখানা",
      "শাহ সুজা",
      "১৬৫৫ সাল"
    ]
  },
  {
    "id": "spot-chap-09",
    "rankNo": "০৯",
    "nameBn": "চামচিকা মসজিদ ও ঢিবি",
    "nameEn": "Chamchika Ancient Mosque Mound",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "গৌড় এলাকা, শিবগঞ্জ",
    "descriptionBn": "গৌড়ের প্রাচীন লোকালয়ের ঐতিহাসিক ধ্বংসাবশেষ ও মধ্যযুগীয় এক গম্বুজ মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "চামচিকা মসজিদ",
      "গৌড়"
    ]
  },
  {
    "id": "spot-chap-10",
    "rankNo": "১০",
    "nameBn": "খঞ্জনদীঘির মসজিদ (ধানচাকী মসজিদ)",
    "nameEn": "Khanjan Dighi (Dhanchaki) Mosque",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "ছোট সোনা মসজিদের কাছে",
    "descriptionBn": "খঞ্জনদীঘির পাড়ে অবস্থিত সুরম্য পোড়ামাটির শিল্পমণ্ডিত প্রাচীন গম্বুজযুক্ত মসজিদ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "খঞ্জনদীঘি",
      "ধানচাকী মসজিদ"
    ]
  },
  {
    "id": "spot-chap-11",
    "rankNo": "১১",
    "nameBn": "বীরশ্রেষ্ঠ শহীদ ক্যাপ্টেন মহিউদ্দিন জাহাঙ্গীরের সমাধি",
    "nameEn": "Bir Shreshtho Captain Mohiuddin Jahangir Mausoleum",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "ছোট সোনা মসজিদ প্রাঙ্গণ",
    "descriptionBn": "১৯৭১ সালের ১৪ ডিসেম্বর শহীদ হওয়া বীরশ্রেষ্ঠ ক্যাপ্টেন মহিউদ্দিন জাহাঙ্গীরের অন্তিম শয়ানস্থল। বীরত্বের চিরভাস্বর স্মৃতি।",
    "imageUrl": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "বীরশ্রেষ্ঠ",
      "মহিউদ্দিন জাহাঙ্গীর",
      "স্মৃতিসৌধ"
    ]
  },
  {
    "id": "spot-chap-12",
    "rankNo": "১২",
    "nameBn": "কোতোয়ালী দরওয়াজা (গৌড়ের সিংহদ্বার)",
    "nameEn": "Kotwali Darwaza (Ancient City Gate of Gaur)",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "বাংলাদেশ-ভারত সীমান্ত, শিবগঞ্জ",
    "descriptionBn": "প্রাচীন বাংলার রাজধানী গৌড় নগরের প্রধান প্রবেশদ্বার। বিশাল উঁচু খিলানযুক্ত ঐতিহাসিক প্রতিরক্ষা সিংহদ্বার।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "কোতোয়ালী দরওয়াজা",
      "গৌড় তোরণ",
      "ঐতিহাসিক"
    ]
  },
  {
    "id": "spot-chap-13",
    "rankNo": "১৩",
    "nameBn": "শাহ্ নেয়ামতউল্লাহ (রহঃ) এর মাজার শরীফ",
    "nameEn": "Hazrat Shah Niamatullah Shrine",
    "districtBn": "চাঁপাইনবাবগঞ্জ",
    "districtId": "chapainawabganj",
    "locationBn": "তাহখানা চত্বর, শিবগঞ্জ",
    "descriptionBn": "মুঘল সুবেদার শাহ সুজার আধ্যাত্মিক পীর হযরত শাহ্ নেয়ামতউল্লাহ (রহ.) এর মাজার ও সংলগ্ন সুবিশাল তাহখানা দিঘী।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "শাহ নেয়ামতউল্লাহ",
      "তাহখানা",
      "মাজার"
    ]
  },
  {
    "id": "spot-nao-01",
    "rankNo": "০১",
    "nameBn": "রক্তদহ বিল পর্যটন এলাকা ও পাখি পল্লী",
    "nameEn": "Roktodaho Beel & Bird Sanctuary",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "রাণীনগর উপজেলা",
    "descriptionBn": "প্রাকৃতিক জলাভূমি ও পরিযায়ী পাখির স্বর্গরাজ্য। নৌকাভ্রমণ ও গ্রামীণ নৈসর্গিক রূপের জন্য পরিচিত।",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "রক্তদহ বিল",
      "পাখি পল্লী",
      "রাণীনগর"
    ]
  },
  {
    "id": "spot-nao-02",
    "rankNo": "০২",
    "nameBn": "ঐতিহাসিক কুসুম্বা মসজিদ (১৫৫৮ খ্রি.)",
    "nameEn": "Kusumba Stone Mosque (1558 AD)",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "মান্দা উপজেলা, আত্রাই নদীর পশ্চিম তীর",
    "descriptionBn": "কালো পাথরে নির্মিত \"কালা পাহাড়\" খ্যাত অবিস্মরণীয় ঐতিহাসিক মসজিদ। পাঁচ টাকার নোটে মুদ্রিত বিখ্যাত পাথুরে খোদাইকর্ম সমৃদ্ধ।",
    "imageUrl": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "কুসুম্বা মসজিদ",
      "কালো পাথর",
      "মান্দা"
    ]
  },
  {
    "id": "spot-nao-03",
    "rankNo": "০৩",
    "nameBn": "বলিহার রাজবাড়ী",
    "nameEn": "Bolihar Rajbari Palace",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "নওগাঁ সদর উপজেলা, বলিহার",
    "descriptionBn": "মুঘল সম্রাট আওরঙ্গজেবের সনদপ্রাপ্ত বলিহারের প্রাচীন জমিদারদের কারুকার্যময় রাজপ্রাসাদ ও নাটমন্দির।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "বলিহার রাজবাড়ী",
      "নওগাঁ সদর"
    ]
  },
  {
    "id": "spot-nao-04",
    "rankNo": "০৪",
    "nameBn": "জবাইবিল প্রাকৃতিক পর্যটন কেন্দ্র",
    "nameEn": "Jobai Beel Wetland",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "সাপাহার উপজেলা",
    "descriptionBn": "সাপাহারের বিখ্যাত মিষ্টি জলের বিশাল জলাভূমি। হাজার হাজার সাইবেরিয়ান পরিযায়ী পাখির অন্যতম প্রধান বিচরণস্থল।",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "জবাইবিল",
      "সাপাহার",
      "অতিথি পাখি"
    ]
  },
  {
    "id": "spot-nao-05",
    "rankNo": "০৫",
    "nameBn": "রবীন্দ্রনাথ ঠাকুরের পতিসর কাচারীবাড়ী",
    "nameEn": "Rabindranath Tagore Patisar Palace",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "আত্রাই উপজেলা, পতিসর",
    "descriptionBn": "নাগর নদীর তীরে বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের জমিদারি কাচারিবাড়ি ও সংগ্রহশালা। এখানে রচিত হয়েছে বিখ্যাত বহু কবিতা ও সঙ্গীত।",
    "imageUrl": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "পতিসর",
      "রবীন্দ্রনাথ ঠাকুর",
      "আত্রাই"
    ]
  },
  {
    "id": "spot-nao-06",
    "rankNo": "০৬",
    "nameBn": "সোমপুর মহাবিহার (পাহাড়পুর বৌদ্ধ বিহার - UNESCO)",
    "nameEn": "Somapura Mahavihara, Paharpur (UNESCO World Heritage)",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "বদলগাছী উপজেলা, পাহাড়পুর",
    "descriptionBn": "অষ্টম শতকে পাল সম্রাট ধর্মপাল নির্মিত ইউনেস্কো বিশ্ব ঐতিহ্য সোমপুর মহাবিহার। হিমালয়ের দক্ষিণে অবস্থিত প্রাচীন বিশ্বের বৃহত্তম আবাসিক বিশ্ববিদ্যালয়।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ইউনেস্কো",
      "পাহাড়পুর",
      "সোমপুর বিহার"
    ]
  },
  {
    "id": "spot-nao-07",
    "rankNo": "০৭",
    "nameBn": "ঐতিহাসিক আলতাদিঘী জাতীয় উদ্যান",
    "nameEn": "Altadighi National Park & Lake",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "ধামইরহাট উপজেলা",
    "descriptionBn": "শালবন বেষ্টিত বিশাল আয়তনের প্রাচীন আলতাদিঘী। জীববৈচিত্র্য, দুর্লভ বৃক্ষ ও বানর ও পাখির প্রাকৃতিক আবাসভূমি।",
    "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "আলতাদিঘী",
      "শালবন",
      "জাতীয় উদ্যান"
    ]
  },
  {
    "id": "spot-nao-08",
    "rankNo": "০৮",
    "nameBn": "মাহি সন্তোষ দরগাহ ও প্রত্নস্থল",
    "nameEn": "Mahi Santosh Historic Dargah & Ruins",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "ধামইরহাট উপজেলা",
    "descriptionBn": "সুলতানি আমলের বরেন্দ্র অঞ্চলের প্রাচীন রাজধানী সান্তোষপুর ও বিখ্যাত সুফি সন্ত হযরত মাহি সন্তোষের পুণ্যভূমি।",
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "মাহি সন্তোষ",
      "ধামইরহাট",
      "ইতিহাস"
    ]
  },
  {
    "id": "spot-nao-09",
    "rankNo": "০৯",
    "nameBn": "কৈবর্ত নেতা দিব্যক জয় স্তম্ভ",
    "nameEn": "Kaivarta Chief Divyok Victory Pillar",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "পত্নীতলা উপজেলা, দিবর দিঘী",
    "descriptionBn": "একাদশ শতকে কৈবর্ত বিদ্রোহের মহানায়ক দিব্যকের বিজয়ের স্মারক হিসেবে দিঘীর মাঝখানে স্থাপিত একখণ্ডের গ্রানাইট পাথরের সুউচ্চ জয়স্তম্ভ।",
    "imageUrl": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "দিব্যক স্তম্ভ",
      "দিবর দিঘী",
      "পত্নীতলা"
    ]
  },
  {
    "id": "spot-nao-10",
    "rankNo": "১০",
    "nameBn": "ভীমের পান্টি (ঐতিহাসিক গরুড় স্তম্ভ)",
    "nameEn": "Bhimer Panti (Ancient Garuda Pillar)",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "ধামইরহাট উপজেলা",
    "descriptionBn": "পাল রাজা নারায়ণপালের মন্ত্রী ভট্ট গুরুবমিশ্রের স্থাপিত হাজার বছরের প্রাচীন পাথুরে গরুড় স্তম্ভ।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "ভীমের পান্টি",
      "গরুড় স্তম্ভ",
      "ধামইরহাট"
    ]
  },
  {
    "id": "spot-nao-11",
    "rankNo": "১১",
    "nameBn": "জগদ্দল মহাবিহার",
    "nameEn": "Jagaddala Mahavihara Ancient Buddhist Monastery",
    "districtBn": "নওগাঁ",
    "districtId": "naogaon",
    "locationBn": "ধামইরহাট উপজেলা",
    "descriptionBn": "একাদশ শতকে পাল রাজা রামপাল প্রতিষ্ঠিত সুপ্রাচীন বৌদ্ধ মহাবিহার। তিব্বতীয় বৌদ্ধ শাস্ত্র চর্চার অন্যতম ঐতিহাসিক পীঠস্থান।",
    "imageUrl": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "জগদ্দল বিহার",
      "পাল আমল",
      "বৌদ্ধ প্রত্নতত্ত্ব"
    ]
  }
];

export const RAJSHAHI_OFFICIAL_9_SPOTS: TouristSpot[] = DIVISION_ALL_95_SPOTS.filter(s => s.districtId === 'rajshahi');

export const DIVISION_OTHER_DISTRICTS_HIGHLIGHTS: TouristSpot[] = DIVISION_ALL_95_SPOTS.filter(s => s.districtId !== 'rajshahi');

// Storage key for custom edits
export const TOURIST_SPOTS_STORAGE_KEY = 'ru_custom_tourist_spots_v1';

export function getStoredTouristSpots(): TouristSpot[] {
  if (typeof window === 'undefined') return DIVISION_ALL_95_SPOTS;
  try {
    const raw = localStorage.getItem(TOURIST_SPOTS_STORAGE_KEY);
    if (!raw) return DIVISION_ALL_95_SPOTS;
    const customList = JSON.parse(raw);
    if (!Array.isArray(customList) || customList.length === 0) return DIVISION_ALL_95_SPOTS;
    
    // Merge custom overrides with default list
    return DIVISION_ALL_95_SPOTS.map(def => {
      const found = customList.find((c: TouristSpot) => c.id === def.id);
      if (found) {
        const mergedImages = Array.isArray(found.images) && found.images.length > 0
          ? found.images
          : (found.imageUrl ? [found.imageUrl] : [def.imageUrl]);
        return {
          ...def,
          ...found,
          imageUrl: found.imageUrl || mergedImages[0] || def.imageUrl,
          images: mergedImages
        };
      }
      return {
        ...def,
        images: def.images && def.images.length > 0 ? def.images : [def.imageUrl]
      };
    });
  } catch (e) {
    console.error('Failed to load custom tourist spots:', e);
    return DIVISION_ALL_95_SPOTS;
  }
}

export function saveStoredTouristSpot(updatedSpot: TouristSpot): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredTouristSpots();
    const updated = current.map(s => s.id === updatedSpot.id ? updatedSpot : s);
    localStorage.setItem(TOURIST_SPOTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('ru_tourist_spots_updated'));
  } catch (e) {
    console.error('Failed to save tourist spot:', e);
  }
}

export function resetStoredTouristSpots(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOURIST_SPOTS_STORAGE_KEY);
    window.dispatchEvent(new Event('ru_tourist_spots_updated'));
  } catch (e) {
    console.error('Failed to reset tourist spots:', e);
  }
}

export interface SimpleMapPlace {
  id: string;
  nameBn: string;
  nameEn: string;
  shortBn: string;
  gate: string;
  cat: string;
}

export const ALL_MAP_PLACES: {
  ru: SimpleMapPlace[];
  rcc: SimpleMapPlace[];
  rajshahi: SimpleMapPlace[];
} = {
  "ru": [
    {
      "id": "agri_faculty",
      "nameBn": "কৃষি অনুষদ",
      "nameEn": "Agriculture Faculty",
      "shortBn": "কৃষি অনুষদ",
      "gate": "চারুকলা গেইট (উত্তর)",
      "cat": "academic"
    },
    {
      "id": "charukola_gate",
      "nameBn": "চারুকলা গেইট চত্বর",
      "nameEn": "Charukola Gate Zone",
      "shortBn": "চারুকলা গেইট",
      "gate": "চারুকলা গেইট",
      "cat": "landmarks"
    },
    {
      "id": "fine_arts",
      "nameBn": "চারুকলা অনুষদ (শিল্পাচার্য জয়নুল আবেদীন ভবন)",
      "nameEn": "Fine Arts (Charukola)",
      "shortBn": "চারুকলা অনুষদ",
      "gate": "চারুকলা গেইট",
      "cat": "academic"
    },
    {
      "id": "rokeya_hall",
      "nameBn": "রোকেয়া হল ও শিক্ষক ডরমেটরী",
      "nameEn": "Rokeya Hall",
      "shortBn": "রোকেয়া হল",
      "gate": "কাজলা গেট",
      "cat": "female_halls"
    },
    {
      "id": "botanical_garden",
      "nameBn": "বোটানিক্যাল গার্ডেন",
      "nameEn": "Botanical Garden",
      "shortBn": "বোটানিক্যাল গার্ডেন",
      "gate": "বোটানিক্যাল ও চারুকলা গেইট",
      "cat": "landmarks"
    },
    {
      "id": "habibur_hall",
      "nameBn": "শহীদ হবিবুর রহমান হল",
      "nameEn": "Habibur Rahman Hall",
      "shortBn": "হবিবুর রহমান হল",
      "gate": "চারুকলা ও মেইন গেট",
      "cat": "male_halls"
    },
    {
      "id": "ziaur_hall",
      "nameBn": "শহীদ জিয়াউর রহমান হল",
      "nameEn": "Ziaur Rahman Hall",
      "shortBn": "জিয়াউর রহমান হল",
      "gate": "স্টেশন বাজার ও মেইন গেট",
      "cat": "male_halls"
    },
    {
      "id": "ru_station",
      "nameBn": "রাবি রেলস্টেশন ও স্টেশন বাজার",
      "nameEn": "RU Station & Bazar",
      "shortBn": "রাবি স্টেশন বাজার",
      "gate": "স্টেশন বাজার",
      "cat": "landmarks"
    },
    {
      "id": "madar_bux_hall",
      "nameBn": "মাদার বখ্শ হল",
      "nameEn": "Madar Bux Hall",
      "shortBn": "মাদার বখ্শ হল",
      "gate": "স্টেশন বাজার",
      "cat": "male_halls"
    },
    {
      "id": "suhrawardy_hall",
      "nameBn": "হোসেন শহীদ সোহরাওয়ার্দী হল",
      "nameEn": "Suhrawardy Hall",
      "shortBn": "সোহরাওয়ার্দী হল",
      "gate": "রাবি রেলস্টেশন",
      "cat": "male_halls"
    },
    {
      "id": "shamsuzzoha_hall",
      "nameBn": "শহীদ শামসুজ্জোহা হল",
      "nameEn": "Shamsuzzoha Hall",
      "shortBn": "শামসুজ্জোহা হল",
      "gate": "বিনোদপুর ও স্টেশন গেট",
      "cat": "male_halls"
    },
    {
      "id": "boddhobhumi",
      "nameBn": "বধ্যভূমি স্মৃতিস্তম্ভ ও পূর্ব প্রান্ত",
      "nameEn": "Boddhobhumi Memorial",
      "shortBn": "বধ্যভূমি স্মৃতিস্তম্ভ",
      "gate": "বিনোদপুর ও পূর্ব সড়ক",
      "cat": "landmarks"
    },
    {
      "id": "rahamatunnesa_hall",
      "nameBn": "রহমতুন্নেসা হল",
      "nameEn": "Rahamatunnesa Hall",
      "shortBn": "রহমতুন্নেসা হল",
      "gate": "কাজলা ও চারুকলা গেইট",
      "cat": "female_halls"
    },
    {
      "id": "taposhi_rabeya_hall",
      "nameBn": "তাপসী রাবেয়া হল",
      "nameEn": "Taposhi Rabeya Hall",
      "shortBn": "তাপসী রাবেয়া হল",
      "gate": "কাজলা গেট",
      "cat": "female_halls"
    },
    {
      "id": "khaleda_zia_hall",
      "nameBn": "বেগম খালেদা জিয়া হল",
      "nameEn": "Khaleda Zia Hall",
      "shortBn": "খালেদা জিয়া হল",
      "gate": "কাজলা গেট",
      "cat": "female_halls"
    },
    {
      "id": "sheikh_hasina_hall",
      "nameBn": "শেখ হাসিনা হল",
      "nameEn": "Sheikh Hasina Hall",
      "shortBn": "শেখ হাসিনা হল",
      "gate": "কাজলা ও মেইন গেট",
      "cat": "female_halls"
    },
    {
      "id": "fazilatunnesa_hall",
      "nameBn": "বঙ্গমাতা শেখ ফজিলাতুন্নেছা হল",
      "nameEn": "Fazilatunnesa Hall",
      "shortBn": "ফজিলাতুন্নেছা হল",
      "gate": "কাজলা গেট",
      "cat": "female_halls"
    },
    {
      "id": "mannujan_hall",
      "nameBn": "মন্নুজান হল ও শেখ রাসেল স্কুল মাঠ",
      "nameEn": "Mannujan Hall",
      "shortBn": "মন্নুজান হল",
      "gate": "কাজলা গেট",
      "cat": "female_halls"
    },
    {
      "id": "twenty_storied",
      "nameBn": "২০তলা একাডেমিক ভবন ও শহীদ হবিবুর রহমান মাঠ",
      "nameEn": "20-Storied Bldg & Field",
      "shortBn": "২০তলা ভবন ও হবিবুর মাঠ",
      "gate": "মেইন গেট / চারুকলা গেইট",
      "cat": "academic"
    },
    {
      "id": "jc_bose_bldg",
      "nameBn": "স্যার জগদীশ চন্দ্র বসু ও ড. কুদরত-ই-খুদা একাডেমিক ভবন (২য় ও ৩য় বিজ্ঞান)",
      "nameEn": "2nd & 3rd Science Bldg",
      "shortBn": "জগদীশ বসু ও কুদরত-ই-খুদা ভবন",
      "gate": "কাজলা ও মেইন গেট",
      "cat": "academic"
    },
    {
      "id": "wazed_bldg",
      "nameBn": "ড. এম এ ওয়াজেদ মিয়া একাডেমিক ভবন (৪র্থ বিজ্ঞান ও প্রকৌশল)",
      "nameEn": "Dr. Wazed Miah Bldg",
      "shortBn": "ওয়াজেদ মিয়া ভবন",
      "gate": "মেইন গেট ও কাজলা গেট",
      "cat": "academic"
    },
    {
      "id": "sn_bose_bldg",
      "nameBn": "সত্যেন্দ্রনাথ বসু একাডেমিক ভবন (১ম বিজ্ঞান ভবন)",
      "nameEn": "S.N. Bose 1st Science Bldg",
      "shortBn": "সত্যেন্দ্রনাথ বসু ভবন",
      "gate": "মেইন গেট",
      "cat": "academic"
    },
    {
      "id": "siraji_bldg",
      "nameBn": "সৈয়দ ইসমাইল হোসেন সিরাজী একাডেমিক ভবন",
      "nameEn": "Siraji Academic Bldg",
      "shortBn": "সিরাজী ভবন",
      "gate": "কাজলা গেট",
      "cat": "academic"
    },
    {
      "id": "rabindra_bldg",
      "nameBn": "রবীন্দ্রনাথ ঠাকুর একাডেমিক ভবন",
      "nameEn": "Rabindra Tagore Bldg",
      "shortBn": "রবীন্দ্র ভবন",
      "gate": "কাজলা ও মেইন গেট",
      "cat": "academic"
    },
    {
      "id": "momtaz_bldg",
      "nameBn": "ড. মমতাজউদ্দিন আহমদ একাডেমিক ভবন (কলা ভবন)",
      "nameEn": "Momtazuddin Arts Bldg",
      "shortBn": "মমতাজউদ্দিন ভবন",
      "gate": "কাজলা ও মেইন গেট",
      "cat": "academic"
    },
    {
      "id": "shahidullah_bldg",
      "nameBn": "ড. মুহম্মদ শহীদুল্লাহ একাডেমিক ভবন",
      "nameEn": "Shahidullah Arts Bldg",
      "shortBn": "শহীদুল্লাহ ভবন",
      "gate": "মেইন গেট",
      "cat": "academic"
    },
    {
      "id": "central_library",
      "nameBn": "কেন্দ্রীয় গ্রন্থাগার, কাজী নজরুল মিলনায়তন ও সিনেট ভবন",
      "nameEn": "Central Library & Auditorium",
      "shortBn": "কেন্দ্রীয় গ্রন্থাগার",
      "gate": "মেইন গেট",
      "cat": "academic"
    },
    {
      "id": "stadium",
      "nameBn": "শেখ কামাল স্টেডিয়াম ও ইনডোর স্টেডিয়াম",
      "nameEn": "Sheikh Kamal Stadium",
      "shortBn": "শেখ কামাল স্টেডিয়াম",
      "gate": "মেইন গেট ও বিনোদপুর গেট",
      "cat": "landmarks"
    },
    {
      "id": "latif_hall",
      "nameBn": "নবাব আব্দুল লতিফ হল ও আন্তর্জাতিক ডরমেটরী",
      "nameEn": "Nawab Abdul Latif Hall",
      "shortBn": "আব্দুল লতিফ হল",
      "gate": "বিনোদপুর গেট",
      "cat": "male_halls"
    },
    {
      "id": "amer_ali_hall",
      "nameBn": "সৈয়দ আমীর আলী হল ও পূর্বপাড়া কৃষি প্রকল্প এলাকা",
      "nameEn": "Syed Amer Ali Hall",
      "shortBn": "আমীর আলী হল",
      "gate": "বিনোদপুর গেট",
      "cat": "male_halls"
    },
    {
      "id": "shah_makhdum_hall",
      "nameBn": "শাহ্ মখদুম হল, চিকিৎসা কেন্দ্র ও আই.বি.এস",
      "nameEn": "Shah Makhdum Hall & Medical",
      "shortBn": "শাহ্ মখদুম হল ও মেডিকেল",
      "gate": "বিনোদপুর গেট",
      "cat": "male_halls"
    },
    {
      "id": "bangabandhu_hall",
      "nameBn": "বঙ্গবন্ধু শেখ মুজিবুর রহমান হল",
      "nameEn": "Bangabandhu Hall",
      "shortBn": "বঙ্গবন্ধু হল",
      "gate": "মেইন গেট ও বিনোদপুর গেট",
      "cat": "male_halls"
    },
    {
      "id": "motihar_hall",
      "nameBn": "মতিহার হল ও কেন্দ্রীয় মন্দির",
      "nameEn": "Motihar Hall",
      "shortBn": "মতিহার হল",
      "gate": "বিনোদপুর ও মেইন গেট",
      "cat": "male_halls"
    },
    {
      "id": "kajla_gate",
      "nameBn": "কাজলা গেট, জুবেরী মাঠ ও পার্কিং জোন",
      "nameEn": "Kajla Gate & Zuberi Field",
      "shortBn": "কাজলা গেট ও জুবেরী মাঠ",
      "gate": "কাজলা গেট (দক্ষিণ-পশ্চিম)",
      "cat": "landmarks"
    },
    {
      "id": "paris_road",
      "nameBn": "ঐতিহাসিক প্যারিস রোড চত্বর",
      "nameEn": "Historic Paris Road",
      "shortBn": "প্যারিস রোড",
      "gate": "মেইন গেট ও কাজলা গেট",
      "cat": "landmarks"
    },
    {
      "id": "admin_senate",
      "nameBn": "প্রশাসন ভবন, সিনেট ভবন ও উপাচার্য ভবন",
      "nameEn": "Admin & VC Residence",
      "shortBn": "প্রশাসন ও উপাচার্য ভবন",
      "gate": "মেইন গেট ও কাজলা গেট",
      "cat": "landmarks"
    },
    {
      "id": "shabash_bd",
      "nameBn": "সাবাস বাংলাদেশ ভাস্কর্য, মাঠ ও পার্কিং",
      "nameEn": "Shabash Bangladesh",
      "shortBn": "সাবাস বাংলাদেশ",
      "gate": "মেইন গেট",
      "cat": "landmarks"
    },
    {
      "id": "main_gate",
      "nameBn": "মেইন গেট, জোহা চত্বর ও গোলচত্বর",
      "nameEn": "Main Gate & Zoha Chattar",
      "shortBn": "মেইন গেট ও জোহা চত্বর",
      "gate": "মেইন গেট (রাজশাহী-নাটোর মহাসড়ক)",
      "cat": "landmarks"
    },
    {
      "id": "central_mosque",
      "nameBn": "কেন্দ্রীয় জামে মসজিদ ও সুবর্ণ জয়ন্তী টাওয়ার",
      "nameEn": "Central Mosque",
      "shortBn": "কেন্দ্রীয় জামে মসজিদ",
      "gate": "মেইন গেট",
      "cat": "landmarks"
    },
    {
      "id": "smriti_museum",
      "nameBn": "শহীদ স্মৃতি সংগ্রহশালা",
      "nameEn": "Shaheed Smriti Museum",
      "shortBn": "শহীদ স্মৃতি সংগ্রহশালা",
      "gate": "মেইন গেট",
      "cat": "landmarks"
    },
    {
      "id": "sher_e_bangla_hall",
      "nameBn": "শের-ই-বাংলা ফজলুল হক হল",
      "nameEn": "Sher-e-Bangla Hall",
      "shortBn": "শের-ই-বাংলা হল",
      "gate": "মেইন গেট ও বিনোদপুর গেট",
      "cat": "male_halls"
    },
    {
      "id": "binodpur_gate",
      "nameBn": "বিনোদপুর গেট, পুলিশ ফাঁড়ি ও আইবিএ ভবন",
      "nameEn": "Binodpur Gate Zone",
      "shortBn": "বিনোদপুর গেট",
      "gate": "বিনোদপুর গেট (দক্ষিণ-পূর্ব)",
      "cat": "landmarks"
    }
  ],
  "rcc": [
    {
      "id": "rcc_airport_nowhata",
      "nameBn": "শাহ মখদুম বিমানবন্দর ও উত্তর আমচত্বর (ওয়ার্ড-১৭ পশ্চিম)",
      "nameEn": "Shah Makhdum Airport Zone",
      "shortBn": "শাহ মখদুম বিমানবন্দর",
      "gate": "নওহাটা-বিমানবন্দর মহাসড়ক (ওয়ার্ড-১৭)",
      "cat": "rcc_shahmakhdum"
    },
    {
      "id": "rcc_textile_postal",
      "nameBn": "পোস্টাল একাডেমি, টেক্সটাইল মিল ও শাহ মখদুম থানা (ওয়ার্ড-১৭ পূর্ব)",
      "nameEn": "Postal Academy & Textile Mill",
      "shortBn": "পোস্টাল একাডেমি ও টেক্সটাইল",
      "gate": "শাহ মখদুম থানা ও আমচত্বর (ওয়ার্ড-১৭)",
      "cat": "rcc_shahmakhdum"
    },
    {
      "id": "rcc_cantonment_sopura",
      "nameBn": "সপুরা সিল্ক পল্লী (বিসিক) ও ক্যান্টনমেন্ট (ওয়ার্ড-১৪, ১৬)",
      "nameEn": "Sopura Silk & Cantonment",
      "shortBn": "সপুরা সিল্ক ও ক্যান্টনমেন্ট",
      "gate": "সপুরা বিসিক ও উপশহর রোড (ওয়ার্ড-১৪, ১৬)",
      "cat": "rcc_shahmakhdum"
    },
    {
      "id": "rcc_stadium_shalbagan",
      "nameBn": "মুক্তিযুদ্ধ স্মৃতি স্টেডিয়াম, শালবাগান ও নভোথিয়েটার (ওয়ার্ড-১৫, ১৮, ১৯)",
      "nameEn": "District Stadium & Novo Theatre",
      "shortBn": "জেলা স্টেডিয়াম ও নভোথিয়েটার",
      "gate": "বিমানবন্দর রোড ও ভদ্রা (ওয়ার্ড-১৮, ১৯)",
      "cat": "rcc_shahmakhdum"
    },
    {
      "id": "rcc_ward2_horogram",
      "nameBn": "উত্তর হড়গ্রাম ও সিটি বাইপাস (ওয়ার্ড-২)",
      "nameEn": "Horogram Ward-2 North-West",
      "shortBn": "হড়গ্রাম (ওয়ার্ড-২)",
      "gate": "সিটি হাট ও আমচত্বর বাইপাস (ওয়ার্ড-২)",
      "cat": "rcc_rajpara"
    },
    {
      "id": "rcc_kasiadanga_ward1",
      "nameBn": "কাশিয়াডাঙ্গা ও পশ্চিম প্রবেশদ্বার (ওয়ার্ড-১)",
      "nameEn": "Kasiadanga Ward-1",
      "shortBn": "কাশিয়াডাঙ্গা (ওয়ার্ড-১)",
      "gate": "রাজশাহী-চাঁপাইনবাবগঞ্জ মহাসড়ক (ওয়ার্ড-১)",
      "cat": "rcc_rajpara"
    },
    {
      "id": "rcc_court_station",
      "nameBn": "রাজশাহী কোর্ট রেলস্টেশন, হড়গ্রাম বাজার ও দাশপুকুর (ওয়ার্ড-৩, ৫, ৬)",
      "nameEn": "Court Station & Rajpara",
      "shortBn": "কোর্ট স্টেশন ও হড়গ্রাম",
      "gate": "কোর্ট স্টেশন মোড় (ওয়ার্ড-৩, ৫, ৬)",
      "cat": "rcc_rajpara"
    },
    {
      "id": "rcc_ibandh_bulonpur",
      "nameBn": "আই-বাঁধ (I-Bandh), সীমান্ত অবসর ও বুলনপুর (ওয়ার্ড-৪)",
      "nameEn": "I-Bandh & Shimanto Oboshor",
      "shortBn": "আই-বাঁধ ও সীমান্ত অবসর",
      "gate": "বিজিবি সেক্টর ও কোর্ট রোড (ওয়ার্ড-৪)",
      "cat": "rcc_padma"
    },
    {
      "id": "rcc_central_zoo",
      "nameBn": "রাজশাহী কেন্দ্রীয় বোটানিক্যাল গার্ডেন ও চিড়িয়াখানা (ওয়ার্ড-৭ পূর্ব)",
      "nameEn": "Rajshahi Central Botanic Garden & Zoo",
      "shortBn": "কেন্দ্রীয় উদ্যান ও চিড়িয়াখানা",
      "gate": "কোর্ট ও পুলিশ লাইন্স মোড় (ওয়ার্ড-৭)",
      "cat": "rcc_padma"
    },
    {
      "id": "rcc_tbandh_lalon",
      "nameBn": "টি-বাঁধ (T-Groin), লালন শাহ মুক্তমঞ্চ ও শ্রীরামপুর (ওয়ার্ড-৭ দক্ষিণ)",
      "nameEn": "T-Bandh & Lalon Shah Park",
      "shortBn": "টি-বাঁধ ও লালন মঞ্চ",
      "gate": "শ্রীরামপুর ও রাজশাহী ক্লাব রোড (ওয়ার্ড-৭)",
      "cat": "rcc_padma"
    },
    {
      "id": "rcc_rmc_laxmipur",
      "nameBn": "রাজশাহী মেডিকেল কলেজ (RMC), লক্ষ্মীপুর ও সিএন্ডবি মোড় (ওয়ার্ড-৮, ১০)",
      "nameEn": "Rajshahi Medical College & Laxmipur",
      "shortBn": "রাজশাহী মেডিকেল ও সিএন্ডবি",
      "gate": "লক্ষ্মীপুর ও সিএন্ডবি মোড় (ওয়ার্ড-৮, ১০)",
      "cat": "rcc_boalia"
    },
    {
      "id": "rcc_varendra_museum",
      "nameBn": "বরেন্দ্র গবেষণা জাদুঘর ও হেতেমখাঁ (ওয়ার্ড-১১, ১৩)",
      "nameEn": "Varendra Research Museum",
      "shortBn": "বরেন্দ্র গবেষণা জাদুঘর",
      "gate": "জাদুঘর মোড় ও হেতেমখাঁ (ওয়ার্ড-১১)",
      "cat": "rcc_boalia"
    },
    {
      "id": "rcc_rail_station_shiroil",
      "nameBn": "রাজশাহী রেলওয়ে স্টেশন, শিরোইল বাস টার্মিনাল ও ভদ্রা (ওয়ার্ড-২০, ২১)",
      "nameEn": "Rajshahi Railway Station & Bhadra",
      "shortBn": "রেলস্টেশন ও ভদ্রা পার্ক",
      "gate": "রেলগেট ও ভদ্রা মোড় (ওয়ার্ড-২০, ২১)",
      "cat": "rcc_boalia"
    },
    {
      "id": "rcc_general_library",
      "nameBn": "রাজশাহী সাধারণ গ্রন্থাগার (মিয়াপাড়া) ও বোয়ালিয়া (ওয়ার্ড-৯, ১১)",
      "nameEn": "Rajshahi General Public Library (1884)",
      "shortBn": "রাজশাহী সাধারণ গ্রন্থাগার",
      "gate": "মিয়াপাড়া ও মনি চত্বর (ওয়ার্ড-৯)",
      "cat": "rcc_boalia"
    },
    {
      "id": "rcc_rajshahi_college",
      "nameBn": "ঐতিহ্যবাহী রাজশাহী কলেজ ও লাল ভবন (ওয়ার্ড-১২ উত্তর)",
      "nameEn": "Rajshahi College (Est. 1873)",
      "shortBn": "রাজশাহী কলেজ",
      "gate": "সাহেব বাজার ও জাদুঘর মোড় (ওয়ার্ড-১২)",
      "cat": "rcc_boalia"
    },
    {
      "id": "rcc_shah_makhdum_dargah",
      "nameBn": "হযরত শাহ মখদুম (রহ.) দরগাহ শরীফ ও দরগাহপাড়া (ওয়ার্ড-৯ দক্ষিণ)",
      "nameEn": "Shrine of Hazrat Shah Makhdum (Rh.)",
      "shortBn": "শাহ মখদুমের মাজার",
      "gate": "দরগাহপাড়া পদ্মা পাড় (ওয়ার্ড-৯)",
      "cat": "rcc_boalia"
    },
    {
      "id": "rcc_padma_garden_borokuthi",
      "nameBn": "পদ্মা গার্ডেন, বড়কুঠি ও সাহেব বাজার জিরো পয়েন্ট (ওয়ার্ড-১২ দক্ষিণ)",
      "nameEn": "Padma Garden, Boro Kuthi & Zero Point",
      "shortBn": "পদ্মা গার্ডেন ও বড়কুঠি",
      "gate": "সাহেব বাজার জিরো পয়েন্ট (ওয়ার্ড-১২)",
      "cat": "rcc_padma"
    },
    {
      "id": "rcc_alupotti_kumarpara",
      "nameBn": "আলুপট্টি, কুমারপাড়া ও বোয়ালিয়া পদ্মা পাড় (ওয়ার্ড-২২, ২৩, ২৪)",
      "nameEn": "Alupotti & Kumarpara Riverfront",
      "shortBn": "আলুপট্টি ও কুমারপাড়া বাঁধ",
      "gate": "আলুপট্টি মোড় (ওয়ার্ড-২২, ২৪)",
      "cat": "rcc_padma"
    },
    {
      "id": "rcc_ward26_chhotabanagram",
      "nameBn": "ছোট বনগ্রাম ও মেহেরচণ্ডী উত্তর (ওয়ার্ড-১৯ পূর্ব ও ওয়ার্ড-২৬)",
      "nameEn": "Chhota Banagram & Meherchandi (Ward-26)",
      "shortBn": "ছোট বনগ্রাম ও মেহেরচণ্ডী (ওয়ার্ড-২৬)",
      "gate": "বারো রাস্তার মোড় ও মেহেরচণ্ডী (ওয়ার্ড-২৬)",
      "cat": "rcc_motihar"
    },
    {
      "id": "rcc_ruet_talaimari",
      "nameBn": "রুয়েট (RUET), তালাইমারী শহীদ মিনার ও কাজলা (ওয়ার্ড-২৫, ২৭)",
      "nameEn": "RUET Campus & Talaimari (Ward-25, 27)",
      "shortBn": "রুয়েট (RUET) ও তালাইমারী",
      "gate": "তালাইমারী ও কাজলা গেট (ওয়ার্ড-২৫, ২৭)",
      "cat": "rcc_motihar"
    },
    {
      "id": "rcc_ru_campus_ward30",
      "nameBn": "রাজশাহী বিশ্ববিদ্যালয় (রাবি ক্যাম্পাস — ওয়ার্ড-৩০)",
      "nameEn": "Rajshahi University (Ward-30)",
      "shortBn": "🎓 রাজশাহী বিশ্ববিদ্যালয় (ক্লিক করে ভেতরে যান)",
      "gate": "মেইন গেট, কাজলা ও বিনোদপুর (ওয়ার্ড-৩০)",
      "cat": "rcc_motihar"
    },
    {
      "id": "rcc_motihar_binodpur_ward28",
      "nameBn": "বিনোদপুর, মতিহার থানা ও ধান গবেষণা ইনস্টিটিউট (ওয়ার্ড-২৮, ২৯)",
      "nameEn": "Binodpur, Motihar & BRRI (Ward-28, 29)",
      "shortBn": "বিনোদপুর ও মতিহার (ওয়ার্ড-২৮, ২৯)",
      "gate": "বিনোদপুর বাজার ও ডাঁশমারী (ওয়ার্ড-২৮, ২৯)",
      "cat": "rcc_motihar"
    }
  ],
  "rajshahi": [
    {
      "id": "rj_tanore",
      "nameBn": "তানোর উপজেলা ও বিল কুমারী বিল (94-Tanore)",
      "nameEn": "Tanore & Beel Kumari (Geocode-94)",
      "shortBn": "তানোর ও বিল কুমারী",
      "gate": "তানোর সদর ও তালন্দ (উত্তর-পশ্চিম রাজশাহী)",
      "cat": "upazilas"
    },
    {
      "id": "rj_mundumala",
      "nameBn": "মুণ্ডুমালা পৌরসভা ও বরেন্দ্র লাল মাটির টিলা (তানোর পশ্চিম)",
      "nameEn": "Mundumala Paurashava",
      "shortBn": "মুণ্ডুমালা (তানোর)",
      "gate": "মুণ্ডুমালা-আমনুরা সড়ক",
      "cat": "upazilas"
    },
    {
      "id": "rj_babu_dying",
      "nameBn": "বাবু ডাইং প্রাকৃতিক বন ও পিকনিক স্পট (34-Godagari North)",
      "nameEn": "Babu Dying Nature Spot",
      "shortBn": "বাবু ডাইং পিকনিক স্পট",
      "gate": "কাঁকনহাট ও গোদাগাড়ী উত্তর",
      "cat": "upazilas"
    },
    {
      "id": "rj_godagari",
      "nameBn": "গোদাগাড়ী, সুলতানগঞ্জ ও পদ্মা-মহানন্দা মোহনা (34-Godagari South)",
      "nameEn": "Godagari & Padma-Mahananda Confluence",
      "shortBn": "গোদাগাড়ী ও নদী মোহনা",
      "gate": "রাজশাহী-চাঁপাইনবাবগঞ্জ মহাসড়ক (গোদাগাড়ী)",
      "cat": "upazilas"
    },
    {
      "id": "rj_mohonpur",
      "nameBn": "মোহনপুর উপজেলা, কেশরহাট ও পানের বরজ অঞ্চল (53-Mohanpur)",
      "nameEn": "Mohanpur & Kesharhat (Geocode-53)",
      "shortBn": "মোহনপুর ও কেশরহাট",
      "gate": "রাজশাহী-নওগাঁ মহাসড়ক (কেশরহাট)",
      "cat": "upazilas"
    },
    {
      "id": "rj_bagmara",
      "nameBn": "বাগমারা ও ভবানীগঞ্জ পৌরসভা (12-Baghmara North)",
      "nameEn": "Baghmara & Bhabanigonj (Geocode-12)",
      "shortBn": "বাগমারা ও ভবানীগঞ্জ",
      "gate": "ভবানীগঞ্জ ও বারনই নদী অববাহিকা",
      "cat": "upazilas"
    },
    {
      "id": "rj_taherpur_rajbari",
      "nameBn": "তাহেরপুর রাজবাড়ি ও গোবিন্দ মন্দির (বাগমারা দক্ষিণ)",
      "nameEn": "Taherpur Rajbari (Baghmara)",
      "shortBn": "তাহেরপুর রাজবাড়ি",
      "gate": "তাহেরপুর পৌরসভা, বাগমারা",
      "cat": "heritage"
    },
    {
      "id": "rj_paba",
      "nameBn": "পবা উপজেলা, নওহাটা ও শাহ মখদুম বিমানবন্দর (72-Paba)",
      "nameEn": "Paba & Nowhata (Geocode-72)",
      "shortBn": "পবা ও নওহাটা",
      "gate": "নওহাটা ব্রিজ ও বিমানবন্দর রোড",
      "cat": "upazilas"
    },
    {
      "id": "rj_durgapur",
      "nameBn": "দুর্গাপুর উপজেলা ও ঐতিহাসিক কিসমত মারিয়া মসজিদ (31-Durgapur)",
      "nameEn": "Durgapur & Kismat Maria Mosque (Geocode-31)",
      "shortBn": "দুর্গাপুর ও মারিয়া মসজিদ",
      "gate": "শিবপুর-দুর্গাপুর সড়ক",
      "cat": "heritage"
    },
    {
      "id": "rj_puthia",
      "nameBn": "পুঠিয়া শিবমন্দির ও রাজবাড়ি কমপ্লেক্স (82-Puthia)",
      "nameEn": "Puthia Shiva Temple & Rajbari (Official #03)",
      "shortBn": "⭐ পুঠিয়া শিবমন্দির ও রাজবাড়ি",
      "gate": "পুঠিয়া, রাজশাহী-নাটোর মহাসড়ক",
      "cat": "official_9"
    },
    {
      "id": "rj_central_zoo",
      "nameBn": "রাজশাহী কেন্দ্রীয় বোটানিক্যাল গার্ডেন ও চিড়িয়াখানা",
      "nameEn": "Rajshahi Central Botanic Garden & Zoo (Official #01)",
      "shortBn": "⭐ কেন্দ্রীয় উদ্যান ও চিড়িয়াখানা",
      "gate": "রাজপাড়া ও কোর্ট এলাকা, রাজশাহী সিটি",
      "cat": "official_9"
    },
    {
      "id": "rj_silk_bscic",
      "nameBn": "রাজশাহী সিল্ক পল্লী ও বিসিক (সপুরা) এবং নভোথিয়েটার",
      "nameEn": "Rajshahi Silk Emporium & Novo Theatre",
      "shortBn": "সপুরা সিল্ক পল্লী ও নভোথিয়েটার",
      "gate": "সপুরা বিসিক ও শহীদ মনসুর আলী পার্ক",
      "cat": "heritage"
    },
    {
      "id": "rj_varendra_museum",
      "nameBn": "বরেন্দ্র গবেষণা জাদুঘর (হেতেমখাঁ)",
      "nameEn": "Varendra Research Museum (Official #05)",
      "shortBn": "⭐ বরেন্দ্র গবেষণা জাদুঘর",
      "gate": "সাহেব বাজার উত্তর / হেতেমখাঁ",
      "cat": "official_9"
    },
    {
      "id": "rj_general_library",
      "nameBn": "রাজশাহী সাধারণ গ্রন্থাগার (মিয়াপাড়া সাধারণ গ্রন্থাগার)",
      "nameEn": "Rajshahi General Public Library (Official #06)",
      "shortBn": "⭐ রাজশাহী সাধারণ গ্রন্থাগার",
      "gate": "মিয়াপাড়া, বোয়ালিয়া, রাজশাহী",
      "cat": "official_9"
    },
    {
      "id": "rj_rajshahi_college",
      "nameBn": "ঐতিহ্যবাহী রাজশাহী কলেজ ও ফুলার ভবন",
      "nameEn": "Rajshahi College (Official #09)",
      "shortBn": "⭐ রাজশাহী কলেজ",
      "gate": "সাহেব বাজার ও জাদুঘর মোড়",
      "cat": "official_9"
    },
    {
      "id": "rj_shah_makhdum",
      "nameBn": "হযরত শাহ্ মখদুম রূপোশ (রহ.)-এর মাজার শরীফ",
      "nameEn": "Shrine of Shah Makhdum Rh. (Official #07)",
      "shortBn": "⭐ শাহ্ মখদুমের মাজার",
      "gate": "দরগাহপাড়া (পদ্মা নদীর পাড়)",
      "cat": "official_9"
    },
    {
      "id": "rj_padma_garden",
      "nameBn": "পদ্মার পাড় (টি-বাঁধ, আই-বাঁধ, পদ্মা গার্ডেন ও বড়কুঠি)",
      "nameEn": "Padma Riverbank, T-Bandh & Boro Kuthi (Official #02)",
      "shortBn": "⭐ পদ্মার পাড় ও বড়কুঠি",
      "gate": "সাহেব বাজার, দরগাহপাড়া ও শ্রীরামপুর পদ্মা পাড়",
      "cat": "official_9"
    },
    {
      "id": "rj_ruet",
      "nameBn": "রুয়েট (RUET) ও তালাইমারী পদ্মা রিভারভিউ",
      "nameEn": "RUET & Talaimari Padma Bank",
      "shortBn": "রুয়েট ও তালাইমারী",
      "gate": "তালাইমারী ও কাজলা",
      "cat": "heritage"
    },
    {
      "id": "rj_ru_campus_zone",
      "nameBn": "রাজশাহী বিশ্ববিদ্যালয় (রাবি ক্যাম্পাস — মতিহার)",
      "nameEn": "Rajshahi University (Official #08)",
      "shortBn": "⭐ রাজশাহী বিশ্ববিদ্যালয় (ম্যাপে যান)",
      "gate": "মতিহার (মেইন গেট, কাজলা ও বিনোদপুর)",
      "cat": "official_9"
    },
    {
      "id": "rj_charghat_sarda",
      "nameBn": "চারঘাট উপজেলা, সারদা পুলিশ একাডেমি ও বড়াল স্লুইস গেট (25-Charghat)",
      "nameEn": "Charghat & Sarda Police Academy (Geocode-25)",
      "shortBn": "চারঘাট ও সারদা একাডেমি",
      "gate": "বানেশ্বর-চারঘাট-সারদা সড়ক",
      "cat": "heritage"
    },
    {
      "id": "rj_bagha_mosque",
      "nameBn": "ঐতিহাসিক বাঘা শাহী মসজিদ, দিঘী ও জাদুঘর (10-Bagha)",
      "nameEn": "Bagha Shahi Mosque & Dighi (Official #04)",
      "shortBn": "⭐ বাঘা শাহী মসজিদ",
      "gate": "বাঘা উপজেলা (দক্ষিণ-পূর্ব রাজশাহী)",
      "cat": "official_9"
    }
  ]
};

