// Vector SVG Data for Rajshahi University (42 Official Territories)
// Extracted with exact polygons, coordinates and metadata for seamless 3-map system

export interface RuPlaceSvgData {
  id: string;
  rankNo: string;
  nameBn: string;
  shortBn: string;
  nameEn: string;
  d: string;
  bbox: { minX: number; minY: number; maxX: number; maxY: number; w: number; h: number };
  center: { x: number; y: number };
  imageUrl: string;
  descriptionBn: string;
}

export const RU_CAMPUS_VIEWBOX = "0 0 1200 750";

export const RU_CAMPUS_PLACES: RuPlaceSvgData[] = [
  {
    id: "agri_faculty",
    rankNo: "01",
    nameBn: "কৃষি অনুষদ",
    shortBn: "কৃষি অনুষদ",
    nameEn: "Agriculture Faculty",
    d: "M185,36L420,36L420,104L165,104Z",
    bbox: { minX: 165.0, minY: 36.0, maxX: 420.0, maxY: 104.0, w: 255.0, h: 68.0 },
    center: { x: 295, y: 72 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "রেললাইনের উত্তর পাশে বিস্তৃত রাবির কৃষি ও ভেটেরিনারি সায়েন্স অনুষদ অঞ্চল।"
  },
  {
    id: "charukola_gate",
    rankNo: "02",
    nameBn: "চারুকলা গেইট চত্বর",
    shortBn: "চারুকলা গেইট",
    nameEn: "Charukola Gate Zone",
    d: "M434,20L478,20L478,104L434,104Z",
    bbox: { minX: 434.0, minY: 20.0, maxX: 478.0, maxY: 104.0, w: 44.0, h: 84.0 },
    center: { x: 456, y: 64 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "উত্তর ক্যাম্পাসের প্রধান প্রবেশদ্বার, রেলক্রসিং এবং চারুকলা সংযোগ সড়ক অঞ্চল।"
  },
  {
    id: "fine_arts",
    rankNo: "03",
    nameBn: "চারুকলা অনুষদ (শিল্পাচার্য জয়নুল আবেদীন ভবন)",
    shortBn: "চারুকলা অনুষদ",
    nameEn: "Fine Arts (Charukola)",
    d: "M492,32L645,48L625,104L492,104Z",
    bbox: { minX: 492.0, minY: 32.0, maxX: 645.0, maxY: 104.0, w: 153.0, h: 72.0 },
    center: { x: 562, y: 72 },
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "শিল্পাচার্য জয়নুল আবেদীন একাডেমিক ভবন ও চারুকলা অনুষদের সবুজ চত্বর।"
  },
  {
    id: "rokeya_hall",
    rankNo: "04",
    nameBn: "রোকেয়া হল ও শিক্ষক ডরমেটরী",
    shortBn: "রোকেয়া হল",
    nameEn: "Rokeya Hall",
    d: "M105,134L242,134L242,248L92,248Z",
    bbox: { minX: 92.0, minY: 134.0, maxX: 242.0, maxY: 248.0, w: 150.0, h: 114.0 },
    center: { x: 170, y: 192 },
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "বেগম রোকেয়ার নামে নামকরণকৃত ছাত্রী আবাসিক হল ও সংলগ্ন শিক্ষক ডরমেটরি সীমানা।"
  },
  {
    id: "botanical_garden",
    rankNo: "05",
    nameBn: "বোটানিক্যাল গার্ডেন",
    shortBn: "বোটানিক্যাল গার্ডেন",
    nameEn: "Botanical Garden",
    d: "M266,134L434,134L434,198L266,198Z",
    bbox: { minX: 266.0, minY: 134.0, maxX: 434.0, maxY: 198.0, w: 168.0, h: 64.0 },
    center: { x: 350, y: 168 },
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "দুর্লভ উদ্ভিদ প্রজাতি, পুকুর ও সবুজ প্রকৃতিতে ঘেরা রাবি বোটানিক্যাল গার্ডেন অঞ্চল।"
  },
  {
    id: "habibur_hall",
    rankNo: "06",
    nameBn: "শহীদ হবিবুর রহমান হল",
    shortBn: "হবিবুর রহমান হল",
    nameEn: "Habibur Rahman Hall",
    d: "M466,134L554,134L554,210L466,210Z",
    bbox: { minX: 466.0, minY: 134.0, maxX: 554.0, maxY: 210.0, w: 88.0, h: 76.0 },
    center: { x: 510, y: 174 },
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "হবিবুর রহমান খেলার মাঠের উত্তর পাশে অবস্থিত বৃহৎ ছাত্র আবাসিক হল অঞ্চল।"
  },
  {
    id: "ziaur_hall",
    rankNo: "07",
    nameBn: "শহীদ জিয়াউর রহমান হল",
    shortBn: "জিয়াউর রহমান হল",
    nameEn: "Ziaur Rahman Hall",
    d: "M564,134L652,134L652,210L564,210Z",
    bbox: { minX: 564.0, minY: 134.0, maxX: 652.0, maxY: 210.0, w: 88.0, h: 76.0 },
    center: { x: 608, y: 174 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "উত্তর ক্যাম্পাসে হবিবুর রহমান হলের পূর্ব পাশে অবস্থিত ছাত্র আবাসিক হল।"
  },
  {
    id: "ru_station",
    rankNo: "08",
    nameBn: "রাবি রেলস্টেশন ও স্টেশন বাজার",
    shortBn: "রাবি স্টেশন বাজার",
    nameEn: "RU Station & Bazar",
    d: "M664,128L796,128L796,174L664,174Z",
    bbox: { minX: 664.0, minY: 128.0, maxX: 796.0, maxY: 174.0, w: 132.0, h: 46.0 },
    center: { x: 730, y: 152 },
    imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "রাজশাহী-ঢাকা রেলপথে বিশ্ববিদ্যালয়ের নিজস্ব রেলস্টেশন ও জনপ্রিয় স্টেশন বাজার চত্বর।"
  },
  {
    id: "madar_bux_hall",
    rankNo: "09",
    nameBn: "মাদার বখ্শ হল",
    shortBn: "মাদার বখ্শ হল",
    nameEn: "Madar Bux Hall",
    d: "M664,182L742,182L742,246L664,246Z",
    bbox: { minX: 664.0, minY: 182.0, maxX: 742.0, maxY: 246.0, w: 78.0, h: 64.0 },
    center: { x: 703, y: 215 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "রাবির অন্যতম প্রতিষ্ঠাতা মাদার বখ্শের নামে নামকরণকৃত ছাত্র আবাসিক হল অঞ্চল।"
  },
  {
    id: "suhrawardy_hall",
    rankNo: "10",
    nameBn: "হোসেন শহীদ সোহরাওয়ার্দী হল",
    shortBn: "সোহরাওয়ার্দী হল",
    nameEn: "Suhrawardy Hall",
    d: "M752,182L832,182L832,246L752,246Z",
    bbox: { minX: 752.0, minY: 182.0, maxX: 832.0, maxY: 246.0, w: 80.0, h: 64.0 },
    center: { x: 792, y: 215 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "স্টেশন বাজার ও জোহা হলের মধ্যবর্তী স্থানে অবস্থিত ছাত্রদের আবাসিক হল।"
  },
  {
    id: "shamsuzzoha_hall",
    rankNo: "11",
    nameBn: "শহীদ শামসুজ্জোহা হল",
    shortBn: "শামসুজ্জোহা হল",
    nameEn: "Shamsuzzoha Hall",
    d: "M842,134L958,134L958,248L842,248Z",
    bbox: { minX: 842.0, minY: 134.0, maxX: 958.0, maxY: 248.0, w: 116.0, h: 114.0 },
    center: { x: 900, y: 192 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "শহীদ বুদ্ধিজীবী ড. শামসুজ্জোহার স্মৃতিবিজড়িত আবাসিক হল ও সংলগ্ন পুকুর অঞ্চল।"
  },
  {
    id: "boddhobhumi",
    rankNo: "12",
    nameBn: "বধ্যভূমি স্মৃতিস্তম্ভ ও পূর্ব প্রান্ত",
    shortBn: "বধ্যভূমি স্মৃতিস্তম্ভ",
    nameEn: "Boddhobhumi Memorial",
    d: "M982,134L1148,134L1128,262L982,252Z",
    bbox: { minX: 982.0, minY: 134.0, maxX: 1148.0, maxY: 262.0, w: 166.0, h: 128.0 },
    center: { x: 1062, y: 198 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "১৯৭১ সালের মহান মুক্তিযুদ্ধে শহীদদের স্মরণে ক্যাম্পাসের উত্তর-পূর্ব প্রান্তে নির্মিত বধ্যভূমি স্মৃতিস্তম্ভ।"
  },
  {
    id: "rahamatunnesa_hall",
    rankNo: "13",
    nameBn: "রহমতুন্নেসা হল",
    shortBn: "রহমতুন্নেসা হল",
    nameEn: "Rahamatunnesa Hall",
    d: "M266,206L434,206L434,248L266,248Z",
    bbox: { minX: 266.0, minY: 206.0, maxX: 434.0, maxY: 248.0, w: 168.0, h: 42.0 },
    center: { x: 350, y: 229 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "বোটানিক্যাল গার্ডেনের দক্ষিণ সীমানায় অবস্থিত ছাত্রীদের আবাসিক হল।"
  },
  {
    id: "taposhi_rabeya_hall",
    rankNo: "14",
    nameBn: "তাপসী রাবেয়া হল",
    shortBn: "তাপসী রাবেয়া হল",
    nameEn: "Taposhi Rabeya Hall",
    d: "M266,256L356,256L356,302L266,302Z",
    bbox: { minX: 266.0, minY: 256.0, maxX: 356.0, maxY: 302.0, w: 90.0, h: 46.0 },
    center: { x: 311, y: 281 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "রোকেয়া হলের পূর্ব পাশে এবং রহমতুন্নেসা হলের দক্ষিণে অবস্থিত ছাত্রী হল।"
  },
  {
    id: "khaleda_zia_hall",
    rankNo: "15",
    nameBn: "বেগম খালেদা জিয়া হল",
    shortBn: "খালেদা জিয়া হল",
    nameEn: "Khaleda Zia Hall",
    d: "M266,310L356,310L356,352L266,352Z",
    bbox: { minX: 266.0, minY: 310.0, maxX: 356.0, maxY: 352.0, w: 90.0, h: 42.0 },
    center: { x: 311, y: 333 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "সিরাজী ভবনের উত্তর সীমানায় অবস্থিত ছাত্রীদের আবাসিক হল।"
  },
  {
    id: "sheikh_hasina_hall",
    rankNo: "16",
    nameBn: "শেখ হাসিনা হল",
    shortBn: "শেখ হাসিনা হল",
    nameEn: "Sheikh Hasina Hall",
    d: "M366,256L434,256L434,352L366,352Z",
    bbox: { minX: 366.0, minY: 256.0, maxX: 434.0, maxY: 352.0, w: 68.0, h: 96.0 },
    center: { x: 400, y: 306 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "ছাত্রী হল জোনের পূর্ব প্রান্তে বিজ্ঞান ভবন সংলগ্ন আবাসিক হল।"
  },
  {
    id: "fazilatunnesa_hall",
    rankNo: "17",
    nameBn: "বঙ্গমাতা শেখ ফজিলাতুন্নেছা হল",
    shortBn: "ফজিলাতুন্নেছা হল",
    nameEn: "Fazilatunnesa Hall",
    d: "M92,258L242,258L242,348L82,348Z",
    bbox: { minX: 82.0, minY: 258.0, maxX: 242.0, maxY: 348.0, w: 160.0, h: 90.0 },
    center: { x: 166, y: 304 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "রোকেয়া হলের দক্ষিণে এবং মন্নুজান হলের উত্তরে অবস্থিত ছাত্রী আবাসিক হল।"
  },
  {
    id: "mannujan_hall",
    rankNo: "18",
    nameBn: "মন্নুজান হল ও শেখ রাসেল স্কুল মাঠ",
    shortBn: "মন্নুজান হল",
    nameEn: "Mannujan Hall",
    d: "M82,358L242,358L242,462L94,462Z",
    bbox: { minX: 82.0, minY: 358.0, maxX: 242.0, maxY: 462.0, w: 160.0, h: 104.0 },
    center: { x: 166, y: 412 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "রাবির ছাত্রীদের প্রথম আবাসিক হল, শেখ রাসেল মডেল স্কুল মাঠ ও পশ্চিমপাড়া আবাসিক এলাকা।"
  },
  {
    id: "twenty_storied",
    rankNo: "19",
    nameBn: "২০তলা একাডেমিক ভবন ও শহীদ হবিবুর রহমান মাঠ",
    shortBn: "২০তলা ভবন ও হবিবুর মাঠ",
    nameEn: "20-Storied Bldg & Field",
    d: "M466,232L612,232L612,292L466,292Z",
    bbox: { minX: 466.0, minY: 232.0, maxX: 612.0, maxY: 292.0, w: 146.0, h: 60.0 },
    center: { x: 539, y: 262 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "শহীদ হবিবুর রহমান খেলার মাঠ এবং নির্মিতব্য আধুনিক ২০তলা একাডেমিক ভবন অঞ্চল।"
  },
  {
    id: "jc_bose_bldg",
    rankNo: "20",
    nameBn: "স্যার জগদীশ চন্দ্র বসু ও ড. কুদরত-ই-খুদা একাডেমিক ভবন (২য় ও ৩য় বিজ্ঞান)",
    shortBn: "জগদীশ বসু ও কুদরত-ই-খুদা ভবন",
    nameEn: "2nd & 3rd Science Bldg",
    d: "M466,300L582,300L582,354L466,354Z",
    bbox: { minX: 466.0, minY: 300.0, maxX: 582.0, maxY: 354.0, w: 116.0, h: 54.0 },
    center: { x: 524, y: 328 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "দ্বিতীয় ও তৃতীয় বিজ্ঞান ভবন (জীববিজ্ঞান, রসায়ন ও প্রাণরসায়ন অনুষদ) কমপ্লেক্স।"
  },
  {
    id: "wazed_bldg",
    rankNo: "21",
    nameBn: "ড. এম এ ওয়াজেদ মিয়া একাডেমিক ভবন (৪র্থ বিজ্ঞান ও প্রকৌশল)",
    shortBn: "ওয়াজেদ মিয়া ভবন",
    nameEn: "Dr. Wazed Miah Bldg",
    d: "M466,362L522,362L522,422L466,422Z",
    bbox: { minX: 466.0, minY: 362.0, maxX: 522.0, maxY: 422.0, w: 56.0, h: 60.0 },
    center: { x: 494, y: 392 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "চতুর্থ বিজ্ঞান ভবন; প্রকৌশল, সিএসই ও বিজ্ঞান অনুষদের আধুনিক ল্যাবরেটরি ও বিভাগসমূহ।"
  },
  {
    id: "sn_bose_bldg",
    rankNo: "22",
    nameBn: "সত্যেন্দ্রনাথ বসু একাডেমিক ভবন (১ম বিজ্ঞান ভবন)",
    shortBn: "সত্যেন্দ্রনাথ বসু ভবন",
    nameEn: "S.N. Bose 1st Science Bldg",
    d: "M530,362L586,362L586,422L530,422Z",
    bbox: { minX: 530.0, minY: 362.0, maxX: 586.0, maxY: 422.0, w: 56.0, h: 60.0 },
    center: { x: 558, y: 392 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "প্রথম বিজ্ঞান ভবন (পদার্থবিজ্ঞান, গণিত ও পরিসংখ্যান বিভাগ)।"
  },
  {
    id: "siraji_bldg",
    rankNo: "23",
    nameBn: "সৈয়দ ইসমাইল হোসেন সিরাজী একাডেমিক ভবন",
    shortBn: "সিরাজী ভবন",
    nameEn: "Siraji Academic Bldg",
    d: "M274,370L352,370L352,418L274,418Z",
    bbox: { minX: 274.0, minY: 370.0, maxX: 352.0, maxY: 418.0, w: 78.0, h: 48.0 },
    center: { x: 313, y: 395 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "শিক্ষা ও গবেষণা ইনস্টিটিউট (IER) এবং সামাজিক বিজ্ঞান ও কলা অনুষদের বিভিন্ন বিভাগ।"
  },
  {
    id: "rabindra_bldg",
    rankNo: "24",
    nameBn: "রবীন্দ্রনাথ ঠাকুর একাডেমিক ভবন",
    shortBn: "রবীন্দ্র ভবন",
    nameEn: "Rabindra Tagore Bldg",
    d: "M360,370L438,370L438,418L360,418Z",
    bbox: { minX: 360.0, minY: 370.0, maxX: 438.0, maxY: 418.0, w: 78.0, h: 48.0 },
    center: { x: 399, y: 395 },
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "কলা, আইন ও সামাজিক বিজ্ঞান অনুষদের অন্যতম প্রধান একাডেমিক ভবন।"
  },
  {
    id: "momtaz_bldg",
    rankNo: "25",
    nameBn: "ড. মমতাজউদ্দিন আহমদ একাডেমিক ভবন (কলা ভবন)",
    shortBn: "মমতাজউদ্দিন ভবন",
    nameEn: "Momtazuddin Arts Bldg",
    d: "M274,426L352,426L352,464L274,464Z",
    bbox: { minX: 274.0, minY: 426.0, maxX: 352.0, maxY: 464.0, w: 78.0, h: 38.0 },
    center: { x: 313, y: 446 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "প্যারিস রোডের উত্তর-পশ্চিম প্রান্তে কলা অনুষদের ঐতিহাসিক মমতাজউদ্দিন ভবন।"
  },
  {
    id: "shahidullah_bldg",
    rankNo: "26",
    nameBn: "ড. মুহম্মদ শহীদুল্লাহ একাডেমিক ভবন",
    shortBn: "শহীদুল্লাহ ভবন",
    nameEn: "Shahidullah Arts Bldg",
    d: "M360,426L438,426L438,464L360,464Z",
    bbox: { minX: 360.0, minY: 426.0, maxX: 438.0, maxY: 464.0, w: 78.0, h: 38.0 },
    center: { x: 399, y: 446 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "কেন্দ্রীয় গ্রন্থাগারের পশ্চিম পাশে অবস্থিত সুপরিচিত কলা অনুষদ ভবন।"
  },
  {
    id: "central_library",
    rankNo: "27",
    nameBn: "কেন্দ্রীয় গ্রন্থাগার, কাজী নজরুল মিলনায়তন ও সিনেট ভবন",
    shortBn: "কেন্দ্রীয় গ্রন্থাগার",
    nameEn: "Central Library & Auditorium",
    d: "M466,430L586,430L586,466L466,466Z",
    bbox: { minX: 466.0, minY: 430.0, maxX: 586.0, maxY: 466.0, w: 120.0, h: 36.0 },
    center: { x: 526, y: 449 },
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "লক্ষাধিক বই সমৃদ্ধ রাবি কেন্দ্রীয় গ্রন্থাগার, কাজী নজরুল ইসলাম মিলনায়তন ও শহীদ সুখরঞ্জন সমাদ্দার টিএসসিসি।"
  },
  {
    id: "stadium",
    rankNo: "28",
    nameBn: "শেখ কামাল স্টেডিয়াম ও ইনডোর স্টেডিয়াম",
    shortBn: "শেখ কামাল স্টেডিয়াম",
    nameEn: "Sheikh Kamal Stadium",
    d: "M620,275L665,260L715,270L738,315L738,378L712,415L655,420L612,395L602,340Z",
    bbox: { minX: 602.0, minY: 260.0, maxX: 738.0, maxY: 420.0, w: 136.0, h: 160.0 },
    center: { x: 672, y: 342 },
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "ক্যাম্পাসের ঠিক হৃদপিণ্ডে অবস্থিত ডিম্বাকৃতির বিশাল শেখ কামাল স্টেডিয়াম এবং ইনডোর স্টেডিয়াম চত্বর।"
  },
  {
    id: "latif_hall",
    rankNo: "29",
    nameBn: "নবাব আব্দুল লতিফ হল ও আন্তর্জাতিক ডরমেটরী",
    shortBn: "আব্দুল লতিফ হল",
    nameEn: "Nawab Abdul Latif Hall",
    d: "M766,266L890,266L890,342L766,342Z",
    bbox: { minX: 766.0, minY: 266.0, maxX: 890.0, maxY: 342.0, w: 124.0, h: 76.0 },
    center: { x: 828, y: 304 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "পূর্ব ক্যাম্পাসে শামসুজ্জোহা হলের দক্ষিণে ও শহীদ মীর কাইয়ুম আন্তর্জাতিক ডরমেটরি সংলগ্ন আবাসিক হল।"
  },
  {
    id: "amer_ali_hall",
    rankNo: "30",
    nameBn: "সৈয়দ আমীর আলী হল ও পূর্বপাড়া কৃষি প্রকল্প এলাকা",
    shortBn: "আমীর আলী হল",
    nameEn: "Syed Amer Ali Hall",
    d: "M900,266L1122,276L1098,412L900,412Z",
    bbox: { minX: 900.0, minY: 266.0, maxX: 1122.0, maxY: 412.0, w: 222.0, h: 146.0 },
    center: { x: 1005, y: 340 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "সৈয়দ আমীর আলী হল, পূর্বপাড়া আবাসিক এলাকা এবং পূর্বাঞ্চলীয় কৃষি প্রকল্প মাঠ।"
  },
  {
    id: "shah_makhdum_hall",
    rankNo: "31",
    nameBn: "শাহ্ মখদুম হল, চিকিৎসা কেন্দ্র ও আই.বি.এস",
    shortBn: "শাহ্ মখদুম হল ও মেডিকেল",
    nameEn: "Shah Makhdum Hall & Medical",
    d: "M766,352L890,352L890,464L766,464Z",
    bbox: { minX: 766.0, minY: 352.0, maxX: 890.0, maxY: 464.0, w: 124.0, h: 112.0 },
    center: { x: 828, y: 408 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "হযরত শাহ মখদুম (রহ.) ছাত্র হল, রাবি চিকিৎসা কেন্দ্র (মেডিকেল সেন্টার) ও আই.বি.এস সংলগ্ন অঞ্চল।"
  },
  {
    id: "bangabandhu_hall",
    rankNo: "32",
    nameBn: "বঙ্গবন্ধু শেখ মুজিবুর রহমান হল",
    shortBn: "বঙ্গবন্ধু হল",
    nameEn: "Bangabandhu Hall",
    d: "M596,426L668,426L668,466L596,466Z",
    bbox: { minX: 596.0, minY: 426.0, maxX: 668.0, maxY: 466.0, w: 72.0, h: 40.0 },
    center: { x: 632, y: 448 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "শেখ কামাল স্টেডিয়ামের দক্ষিণ পাশে অবস্থিত ছাত্র আবাসিক হল।"
  },
  {
    id: "motihar_hall",
    rankNo: "33",
    nameBn: "মতিহার হল ও কেন্দ্রীয় মন্দির",
    shortBn: "মতিহার হল",
    nameEn: "Motihar Hall",
    d: "M676,426L746,426L746,466L676,466Z",
    bbox: { minX: 676.0, minY: 426.0, maxX: 746.0, maxY: 466.0, w: 70.0, h: 40.0 },
    center: { x: 711, y: 448 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "মতিহারের সবুজ চত্বরের নামে নামকরণকৃত ছাত্র হল ও কেন্দ্রীয় মন্দির সীমানা।"
  },
  {
    id: "kajla_gate",
    rankNo: "34",
    nameBn: "কাজলা গেট, জুবেরী মাঠ ও পার্কিং জোন",
    shortBn: "কাজলা গেট ও জুবেরী মাঠ",
    nameEn: "Kajla Gate & Zuberi Field",
    d: "M94,484L248,484L248,642L114,682Z",
    bbox: { minX: 94.0, minY: 484.0, maxX: 248.0, maxY: 682.0, w: 154.0, h: 198.0 },
    center: { x: 175, y: 576 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "কাজলা গেট, জুবেরী ভবন ও খেলার মাঠ, পশ্চিম পার্কিং জোন এবং শেখ রাসেল মডেল স্কুল।"
  },
  {
    id: "paris_road",
    rankNo: "35",
    nameBn: "ঐতিহাসিক প্যারিস রোড চত্বর",
    shortBn: "প্যারিস রোড",
    nameEn: "Historic Paris Road",
    d: "M266,472L468,472L468,508L266,508Z",
    bbox: { minX: 266.0, minY: 472.0, maxX: 468.0, maxY: 508.0, w: 202.0, h: 36.0 },
    center: { x: 367, y: 492 },
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "সুউচ্চ গগনশিরীষ বৃক্ষশোভিত রাবির সবচেয়ে নান্দনিক ও ঐতিহাসিক রাস্তা প্যারিস রোড।"
  },
  {
    id: "admin_senate",
    rankNo: "36",
    nameBn: "প্রশাসন ভবন, সিনেট ভবন ও উপাচার্য ভবন",
    shortBn: "প্রশাসন ও উপাচার্য ভবন",
    nameEn: "Admin & VC Residence",
    d: "M266,516L392,516L392,618L266,640Z",
    bbox: { minX: 266.0, minY: 516.0, maxX: 392.0, maxY: 640.0, w: 126.0, h: 124.0 },
    center: { x: 329, y: 572 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "সৈয়দ নজরুল ইসলাম প্রশাসন ভবন, সিনেট ভবন এবং উপাচার্যের বাসভবন অঞ্চল।"
  },
  {
    id: "shabash_bd",
    rankNo: "37",
    nameBn: "সাবাস বাংলাদেশ ভাস্কর্য, মাঠ ও পার্কিং",
    shortBn: "সাবাস বাংলাদেশ",
    nameEn: "Shabash Bangladesh",
    d: "M398,516L468,516L468,566L398,574Z",
    bbox: { minX: 398.0, minY: 516.0, maxX: 468.0, maxY: 574.0, w: 70.0, h: 58.0 },
    center: { x: 433, y: 544 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "শিল্পী নিতুন কুন্ডু নির্মিত মহান মুক্তিযুদ্ধের অমর ভাস্কর্য "
  },
  {
    id: "main_gate",
    rankNo: "38",
    nameBn: "মেইন গেট, জোহা চত্বর ও গোলচত্বর",
    shortBn: "মেইন গেট ও জোহা চত্বর",
    nameEn: "Main Gate & Zoha Chattar",
    d: "M398,580L552,562L552,602L398,622Z",
    bbox: { minX: 398.0, minY: 562.0, maxX: 552.0, maxY: 622.0, w: 154.0, h: 60.0 },
    center: { x: 475, y: 594 },
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "রাজশাহী বিশ্ববিদ্যালয়ের প্রধান প্রবেশদ্বার, গোলচত্বর এবং ড. শামসুজ্জোহার সমাধিস্থল সংলগ্ন জোহা চত্বর।"
  },
  {
    id: "central_mosque",
    rankNo: "39",
    nameBn: "কেন্দ্রীয় জামে মসজিদ ও সুবর্ণ জয়ন্তী টাওয়ার",
    shortBn: "কেন্দ্রীয় জামে মসজিদ",
    nameEn: "Central Mosque",
    d: "M492,486L556,486L556,554L492,562Z",
    bbox: { minX: 492.0, minY: 486.0, maxX: 556.0, maxY: 562.0, w: 64.0, h: 76.0 },
    center: { x: 524, y: 524 },
    imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "মেইন গেটের উত্তর-পূর্ব পাশে অবস্থিত অনন্য স্থাপত্যশৈলীর রাবি কেন্দ্রীয় জামে মসজিদ ও সুবর্ণ জয়ন্তী টাওয়ার।"
  },
  {
    id: "smriti_museum",
    rankNo: "40",
    nameBn: "শহীদ স্মৃতি সংগ্রহশালা",
    shortBn: "শহীদ স্মৃতি সংগ্রহশালা",
    nameEn: "Shaheed Smriti Museum",
    d: "M564,486L634,486L634,578L564,588Z",
    bbox: { minX: 564.0, minY: 486.0, maxX: 634.0, maxY: 588.0, w: 70.0, h: 102.0 },
    center: { x: 599, y: 534 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "বাংলাদেশের প্রথম স্থায়ী মুক্তিযুদ্ধ জাদুঘর — শহীদ স্মৃতি সংগ্রহশালা অঞ্চল।"
  },
  {
    id: "sher_e_bangla_hall",
    rankNo: "41",
    nameBn: "শের-ই-বাংলা ফজলুল হক হল",
    shortBn: "শের-ই-বাংলা হল",
    nameEn: "Sher-e-Bangla Hall",
    d: "M642,486L768,486L768,560L642,576Z",
    bbox: { minX: 642.0, minY: 486.0, maxX: 768.0, maxY: 576.0, w: 126.0, h: 90.0 },
    center: { x: 705, y: 528 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "শহীদ স্মৃতি সংগ্রহশালার পূর্ব পাশে ও দক্ষিণ সড়কের সাথে অবস্থিত ঐতিহাসিক ছাত্র হল।"
  },
  {
    id: "binodpur_gate",
    rankNo: "42",
    nameBn: "বিনোদপুর গেট, পুলিশ ফাঁড়ি ও আইবিএ ভবন",
    shortBn: "বিনোদপুর গেট",
    nameEn: "Binodpur Gate Zone",
    d: "M776,486L894,486L894,422L1098,422L1078,522L776,558Z",
    bbox: { minX: 776.0, minY: 422.0, maxX: 1098.0, maxY: 558.0, w: 322.0, h: 136.0 },
    center: { x: 935, y: 492 },
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    descriptionBn: "বিনোদপুর গেট, পুলিশ ফাঁড়ি, রাবি আইবিএ ভবন এবং বিনোদপুর বাজার সংযোগ অঞ্চল।"
  },
];
