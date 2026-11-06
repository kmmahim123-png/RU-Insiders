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
    id: 'rajshahi',
    nameBn: '০১. রাজশাহী জেলা',
    nameEn: 'Rajshahi District',
    spotCount: 9,
    portalUrl: 'https://rajshahi.gov.bd/pages/tourist-spot',
    color: '#15803d'
  },
  {
    id: 'natore',
    nameBn: '০২. নাটোর জেলা',
    nameEn: 'Natore District',
    spotCount: 6,
    portalUrl: 'https://natore.gov.bd/pages/tourist-spot',
    color: '#db2777'
  },
  {
    id: 'naogaon',
    nameBn: '০৩. নওগাঁ জেলা',
    nameEn: 'Naogaon District',
    spotCount: 5,
    portalUrl: 'https://naogaon.gov.bd/pages/tourist-spot',
    color: '#0d9488'
  },
  {
    id: 'chapainawabganj',
    nameBn: '০৪. চাঁপাইনবাবগঞ্জ জেলা',
    nameEn: 'Chapainawabganj District',
    spotCount: 5,
    portalUrl: 'https://chapainawabganj.gov.bd/pages/tourist-spot',
    color: '#ea580c'
  },
  {
    id: 'sirajganj',
    nameBn: '০৫. সিরাজগঞ্জ জেলা',
    nameEn: 'Sirajganj District',
    spotCount: 16,
    portalUrl: 'https://sirajganj.gov.bd/pages/static-pages/697fbb0c35ce18e1c06cbb3a',
    color: '#0284c7'
  },
  {
    id: 'pabna',
    nameBn: '০৬. পাবনা জেলা',
    nameEn: 'Pabna District',
    spotCount: 18,
    portalUrl: 'https://pabna.gov.bd/pages/tourist-spot',
    color: '#7c3aed'
  },
  {
    id: 'bogura',
    nameBn: '০৭. বগুড়া জেলা',
    nameEn: 'Bogura District',
    spotCount: 5,
    portalUrl: 'https://bogura.gov.bd/pages/tourist-spot',
    color: '#d97706'
  },
  {
    id: 'joypurhat',
    nameBn: '০৮. জয়পুরহাট জেলা',
    nameEn: 'Joypurhat District',
    spotCount: 4,
    portalUrl: 'https://joypurhat.gov.bd/pages/tourist-spot',
    color: '#1f7a44'
  }
];

// Official 9 Tourist Spots of Rajshahi District (জাতীয় তথ্য বাতায়ন - rajshahidiv.gov.bd তালিকাভুক্ত)
export const RAJSHAHI_OFFICIAL_9_SPOTS: TouristSpot[] = [
  {
    id: 'spot-rj-zoo',
    rankNo: '০১',
    nameBn: 'রাজশাহী কেন্দ্রীয় বোটানিক্যাল গার্ডেন ও চিড়িয়াখানা',
    nameEn: 'Rajshahi Central Botanic Garden & Zoo',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'রাজপাড়া ও কোর্ট এলাকা, রাজশাহী মহানগর',
    descriptionBn: 'পদ্মা নদীর তীরে অবস্থিত শহীদ এ.এইচ.এম কামারুজ্জামান কেন্দ্রীয় উদ্যান ও চিড়িয়াখানা। বিশাল কৃত্রিম লেক, হরিণ, বাঘ, বানর ও দুর্লভ বোটানিক্যাল বৃক্ষরাজির সমাহার।',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_central_zoo',
    mapRegion: 'rajshahi',
    tags: ['চিড়িয়াখানা', 'বোটানিক্যাল উদ্যান', 'পদ্মা পাড়']
  },
  {
    id: 'spot-rj-padma',
    rankNo: '০২',
    nameBn: 'পদ্মার পাড় (টি-বাঁধ, আই-বাঁধ, পদ্মা গার্ডেন ও বড়কুঠি)',
    nameEn: 'Padma Riverbank, T-Bandh, I-Bandh & Boro Kuthi',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'বোয়ালিয়া ও শ্রীরামপুর পদ্মা পাড়, রাজশাহী',
    descriptionBn: 'প্রমত্তা পদ্মার বুকে সূর্যাস্ত দেখার ঐতিহাসিক টি-গ্রোয়েন বাঁধ, সীমান্ত অবসর, পদ্মা গার্ডেনের ঝুলন্ত সেতু এবং অষ্টাদশ শতাব্দীর প্রাচীন ডাচ কুঠিবাড়ি বড়কুঠি।',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_padma_garden',
    mapRegion: 'rajshahi',
    tags: ['নদী তীর', 'টি-বাঁধ', 'বড়কুঠি', 'নৌকা ভ্রমণ']
  },
  {
    id: 'spot-rj-puthia',
    rankNo: '০৩',
    nameBn: 'পুঠিয়া শিবমন্দির ও রাজবাড়ি কমপ্লেক্স',
    nameEn: 'Puthia Shiva Temple & Rajbari Complex',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'পুঠিয়া উপজেলা (রাজশাহী-নাটোর মহাসড়ক)',
    descriptionBn: '১৮২৩ সালে রাণী ভুবনময়ী দেবী নির্মিত উপমহাদেশের অন্যতম বৃহৎ পঞ্চরত্ন পোড়ামাটির শিবমন্দির, দোলাকৃতির জগদ্ধাত্রী মন্দির ও পুঠিয়া মহারাজার ঐতিহাসিক রাজবাড়ি।',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_puthia',
    mapRegion: 'rajshahi',
    tags: ['টেরাকোটা', 'ঐতিহাসিক রাজবাড়ি', 'শিবমন্দির']
  },
  {
    id: 'spot-rj-bagha',
    rankNo: '০৪',
    nameBn: 'ঐতিহাসিক বাঘা শাহী মসজিদ, দিঘী ও জাদুঘর',
    nameEn: 'Historic Bagha Shahi Mosque, Dighi & Museum',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'বাঘা উপজেলা, দক্ষিণ-পূর্ব রাজশাহী',
    descriptionBn: '১৫২৩ খ্রিস্টাব্দে সুলতান নুসরত শাহ নির্মিত ১০ গম্বুজ বিশিষ্ট টেরাকোটা কারুকার্যখচিত প্রাচীন বাঘা মসজিদ (বাংলাদেশের ৫০ টাকার নোটে অঙ্কিত) ও ৫২ বিঘার বিশাল দিঘী।',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_bagha_mosque',
    mapRegion: 'rajshahi',
    tags: ['সুলতানি আমল', 'টেরাকোটা', '৫০ টাকার নোট', 'বাঘা দিঘী']
  },
  {
    id: 'spot-rj-varendra',
    rankNo: '০৫',
    nameBn: 'বরেন্দ্র গবেষণা জাদুঘর (হেতেমখাঁ)',
    nameEn: 'Varendra Research Museum',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'হেতেমখাঁ, বোয়ালিয়া, রাজশাহী সদর',
    descriptionBn: '১৯১০ সালে প্রতিষ্ঠিত বাংলাদেশের সর্বপ্রথম প্রত্নতাত্ত্বিক জাদুঘর। সিন্ধু সভ্যতা, মৌর্য, গুপ্ত, পাল ও সেন রাজবংশের দুর্লভ ভাস্কর্য ও প্রাচীন শিলালিপি সংরক্ষিত।',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_varendra_museum',
    mapRegion: 'rajshahi',
    tags: ['প্রথম জাদুঘর', 'প্রাচীন ভাস্কর্য', 'ঐতিহ্য']
  },
  {
    id: 'spot-rj-library',
    rankNo: '০৬',
    nameBn: 'রাজশাহী সাধারণ গ্রন্থাগার (মিয়াপাড়া - ১৮৮৪)',
    nameEn: 'Rajshahi General Public Library (Est. 1884)',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'মিয়াপাড়া, বোয়ালিয়া, রাজশাহী',
    descriptionBn: '১৮৮৪ সালে মহারানী শরৎসুন্দরী দেবী ও কাসিমবাজারের রাজার সহায়তায় প্রতিষ্ঠিত প্রাচীন গণগ্রন্থাগার। রবীন্দ্রনাথ ঠাকুর ও ড. মুহম্মদ শহীদুল্লাহর স্মৃতিবিজড়িত।',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_general_library',
    mapRegion: 'rajshahi',
    tags: ['ঐতিহাসিক লাইব্রেরি', '১৮৮৪ সাল', 'দুর্লভ পাণ্ডুলিপি']
  },
  {
    id: 'spot-rj-shahmakhdum',
    rankNo: '০৭',
    nameBn: 'হযরত শাহ্ মখদুম রূপোশ (রহ.)-এর মাজার শরীফ',
    nameEn: 'Shrine of Hazrat Shah Makhdum (Rh.)',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'দরগাহপাড়া (পদ্মা নদীর তীর), রাজশাহী',
    descriptionBn: 'বরেন্দ্র অঞ্চলে ১২৮৯ খ্রিস্টাব্দে ইসলাম প্রচারক বিশিষ্ট সুফি সাধক হযরত শাহ মখদুম (রহ.)-এর পবিত্র মাজার, ঐতিহাসিক তোরণ এবং কুমিরের প্রাচীন দিঘী।',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_shah_makhdum',
    mapRegion: 'rajshahi',
    tags: ['সুফি মাজার', 'পদ্মা তীর', 'ঐতিহাসিক দিঘী']
  },
  {
    id: 'spot-rj-ru',
    rankNo: '০৮',
    nameBn: 'রাজশাহী বিশ্ববিদ্যালয় (মতিহারের সবুজ চত্বর ও প্যারিস রোড)',
    nameEn: 'Rajshahi University Campus & Paris Road',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'মতিহার, রাজশাহী-৬২০৫',
    descriptionBn: '৭৫৩ একরের সুবিশাল সবুজ ক্যাম্পাস, সুউচ্চ গগনশিরীষ বৃক্ষশোভিত নান্দনিক প্যারিস রোড, সাবাস বাংলাদেশ ভাস্কর্য, শহীদ স্মৃতি সংগ্রহশালা ও বধ্যভূমি স্মৃতিস্তম্ভ।',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_ru_campus_zone',
    mapRegion: 'ru',
    tags: ['প্যারিস রোড', 'সাবাস বাংলাদেশ', '৪২ টেরিটরি']
  },
  {
    id: 'spot-rj-college',
    rankNo: '০৯',
    nameBn: 'ঐতিহ্যবাহী রাজশাহী কলেজ ও লাল ভবন (১৮৭৩)',
    nameEn: 'Historic Rajshahi College & Red Heritage Building',
    districtBn: 'রাজশাহী',
    districtId: 'rajshahi',
    locationBn: 'সাহেব বাজার, রাজশাহী সদর',
    descriptionBn: '১৮৭৩ সালে প্রতিষ্ঠিত বাংলাদেশের তৃতীয় প্রাচীনতম শিক্ষাপ্রতিষ্ঠান। ব্রিটিশ আমলের মনোরম লাল ইট স্থাপত্য, ফুলার ভবন এবং ১৯৫২ সালের স্মৃতিবাহী দেশের প্রথম শহীদ মিনার।',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    mapPlaceId: 'rj_rajshahi_college',
    mapRegion: 'rcc',
    tags: ['১৮৭৩ সাল', 'ব্রিটিশ লাল ভবন', 'প্রথম শহীদ মিনার']
  }
];

// Highlight spots of the 7 other Districts in Rajshahi Division (as listed in Table 2 of পাতা _ রাজশাহী বিভাগ.html)
export const DIVISION_OTHER_DISTRICTS_HIGHLIGHTS: TouristSpot[] = [
  // সিরাজগঞ্জ
  {
    id: 'spot-siraj-jamuna',
    rankNo: '০২',
    nameBn: 'যমুনা বহুমুখী সেতু (বঙ্গবন্ধু সেতু)',
    nameEn: 'Jamuna Multipurpose Bridge',
    districtBn: 'সিরাজগঞ্জ',
    districtId: 'sirajganj',
    locationBn: 'সিরাজগঞ্জ-টাঙ্গাইল যমুনা নদী',
    descriptionBn: '৪.৮ কিমি দৈর্ঘ্যের বাংলাদেশের যমুনা নদীর ওপর নির্মিত দ্বিতীয় বৃহত্তম সড়ক ও রেল সেতু এবং সিরাজগঞ্জ হার্ডপয়েন্ট রিভারভিউ।',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80',
    tags: ['যমুনা সেতু', 'হার্ডপয়েন্ট', 'রিভারভিউ']
  },
  {
    id: 'spot-siraj-rabindra',
    rankNo: '০৫',
    nameBn: 'রবীন্দ্র কাচারিবাড়ি (শাহজাদপুর)',
    nameEn: 'Rabindra Kachharibari, Shahjadpur',
    districtBn: 'সিরাজগঞ্জ',
    districtId: 'sirajganj',
    locationBn: 'শাহজাদপুর, সিরাজগঞ্জ',
    descriptionBn: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের স্মৃতিবিজড়িত ঐতিহাসিক কাচারিবাড়ি যেখানে কবি বহু কালজয়ী কবিতা, গান ও ছোটগল্প রচনা করেছেন।',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tags: ['রবীন্দ্রনাথ ঠাকুর', 'কাচারিবাড়ি', 'সাহিত্য ঐতিহ্য']
  },
  // নাটোর
  {
    id: 'spot-natore-uttara',
    rankNo: '০১',
    nameBn: 'উত্তরা গণভবন (দিঘাপতিয়া রাজবাড়ি)',
    nameEn: 'Uttara Gonobhaban (Dighapatia Palace)',
    districtBn: 'নাটোর',
    districtId: 'natore',
    locationBn: 'নাটোর সদর',
    descriptionBn: '১৮০২ সালে রাজা দয়ারাম রায় প্রতিষ্ঠিত দিঘাপতিয়া রাজবাড়ি। বর্তমানে উত্তরবঙ্গের রাষ্ট্রপতি ও প্রধানমন্ত্রীর সরকারি বাসভবন।',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tags: ['রাজপ্রাসাদ', 'উত্তরা গণভবন', 'ঐতিহাসিক ঘড়ি']
  },
  {
    id: 'spot-natore-chalanbeel',
    rankNo: '০৪',
    nameBn: 'চলন বিল ও চলন বিল জাদুঘর',
    nameEn: 'Chalan Beel & Wetland Ecosystem',
    districtBn: 'নাটোর',
    districtId: 'natore',
    locationBn: 'গুরুদাসপুর ও সিংড়া, নাটোর',
    descriptionBn: 'বাংলাদেশের সর্ববৃহৎ সমৃদ্ধ জলাভূমি চলন বিল এবং গুরুদাসপুরে অবস্থিত চলন বিলের লোকসংস্কৃতি ও প্রত্নতাত্ত্বিক জাদুঘর।',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    tags: ['সবচেয়ে বড় বিল', 'নৌকা ভ্রমণ', 'মৎস্য ভাণ্ডার']
  },
  // নওগাঁ
  {
    id: 'spot-naogaon-paharpur',
    rankNo: '০১',
    nameBn: 'সোমপুর মহাবিহার (পাহাড়পুর বৌদ্ধ বিহার - ইউনেস্কো বিশ্ব ঐতিহ্য)',
    nameEn: 'Somapura Mahavihara (Paharpur - UNESCO World Heritage)',
    districtBn: 'নওগাঁ',
    districtId: 'naogaon',
    locationBn: 'বদলগাছী, নওগাঁ',
    descriptionBn: 'অষ্টম শতাব্দীতে পাল সম্রাট ধর্মপাল নির্মিত ভারতীয় উপমহাদেশের দ্বিতীয় বৃহত্তম প্রাচীন বৌদ্ধ বিহার ও ইউনেস্কো ঘোষিত বিশ্ব ঐতিহ্য।',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tags: ['ইউনেস্কো ঐতিহ্য', 'বৌদ্ধ বিহার', 'টেরাকোটা']
  },
  {
    id: 'spot-naogaon-kusumba',
    rankNo: '০২',
    nameBn: 'ঐতিহাসিক কুসুম্বা শাহী মসজিদ (৫ টাকার নোটে অঙ্কিত)',
    nameEn: 'Historic Kusumba Mosque (5 Taka Note)',
    districtBn: 'নওগাঁ',
    districtId: 'naogaon',
    locationBn: 'মান্দা উপজেলা, নওগাঁ',
    descriptionBn: '১৫৫৮ সালে আফগান শূর বংশের সুলতানের আমলে ধূসর কালো পাথরে নির্মিত অনিন্দ্য সুন্দর প্রাচীন মসজিদ ও বিশাল কুসুম্বা দিঘী।',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    tags: ['কালো পাথর', '৫ টাকার নোট', 'সুলতানি স্থাপত্য']
  },
  // চাঁপাইনবাবগঞ্জ
  {
    id: 'spot-chap-sona',
    rankNo: '০১',
    nameBn: 'ছোট সোনা মসজিদ ও বীরশ্রেষ্ঠ জাহাঙ্গীর সমাধি',
    nameEn: 'Choto Sona Mosque & Bir Sreshtho Jahangir Tomb',
    districtBn: 'চাঁপাইনবাবগঞ্জ',
    districtId: 'chapainawabganj',
    locationBn: 'শিবগঞ্জ, চাঁপাইনবাবগঞ্জ (গৌড় সীমানা)',
    descriptionBn: 'সুলতান আলাউদ্দিন হোসেন শাহের আমলে নির্মিত ১৫ গম্বুজ বিশিষ্ট বিখ্যাত মসজিদ ও ১৯৭১ সালের বীরশ্রেষ্ঠ ক্যাপ্টেন মহিউদ্দিন জাহাঙ্গীরের সমাধি।',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    tags: ['গৌড় স্থাপত্য', '১৫ গম্বুজ', 'বীরশ্রেষ্ঠ জাহাঙ্গীর']
  },
  // পাবনা
  {
    id: 'spot-pabna-hardinge',
    rankNo: '০১',
    nameBn: 'পাকশী হার্ডিঞ্জ ব্রিজ ও লালন শাহ সেতু',
    nameEn: 'Hardinge Bridge & Lalon Shah Bridge',
    districtBn: 'পাবনা',
    districtId: 'pabna',
    locationBn: 'পাকশী, ঈশ্বরদী, পাবনা',
    descriptionBn: '১৯১২ সালে নির্মিত পদ্মা নদীর ওপর ব্রিটিশ ইঞ্জিনিয়ারিংয়ের অনন্য বিস্ময় ঐতিহাসিক হার্ডিঞ্জ রেল ব্রিজ এবং লালন শাহ সড়ক সেতু।',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    tags: ['শতবর্ষী রেলসেতু', 'পদ্মা পাড়', 'পাকশী']
  },
  // বগুড়া
  {
    id: 'spot-bogura-mahasthan',
    rankNo: '০১',
    nameBn: 'মহাস্থানগড় (প্রাচীন পুণ্ড্রনগর রাজধানী) ও জাদুঘর',
    nameEn: 'Mahasthangarh (Ancient Pundranagara Capital)',
    districtBn: 'বগুড়া',
    districtId: 'bogura',
    locationBn: 'শিবগঞ্জ, বগুড়া সদর',
    descriptionBn: 'খ্রিস্টপূর্ব তৃতীয় শতাব্দীর প্রাচীন বাংলার প্রাচীনতম সুরক্ষিত নগরী পুণ্ড্রবর্ধনের ধ্বংসাবশেষ, করতোয়া নদী তীর ও বেহুলা লক্ষীন্দরের বাসরঘর।',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    tags: ['পুণ্ড্রনগর', 'বেহুলা বাসরঘর', 'প্রাচীন রাজধানী']
  },
  // জয়পুরহাট
  {
    id: 'spot-joypur-hinda',
    rankNo: '০১',
    nameBn: 'হিন্দা-কসবা শাহী জামে মসজিদ',
    nameEn: 'Hinda-Kasba Shahi Mosque',
    districtBn: 'জয়পুরহাট',
    districtId: 'joypurhat',
    locationBn: 'কালাই, জয়পুরহাট',
    descriptionBn: 'আফগান স্থাপত্যশৈলীর অনুকরণে মার্বেল পাথর ও কাঁচের সূক্ষ্ম কারুকাজে নির্মিত জয়পুরহাটের সবচেয়ে নান্দনিক শাহী মসজিদ।',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    tags: ['মার্বেল কারুকাজ', 'কালাই', 'অনিন্দ্য স্থাপত্য']
  }
];

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
