'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Share2, 
  Download, 
  Camera, 
  Eye, 
  Layers, 
  Sparkles, 
  Trophy, 
  X,
  Compass,
  Check,
  Facebook,
  RotateCcw
} from 'lucide-react';

export interface CampusLandmark {
  id: string;
  name: string;
  nameBn: string;
  category: 'historical' | 'academic' | 'hall' | 'nature' | 'gate';
  categoryBn: string;
  x: number; // Percentage on map (0-100)
  y: number; // Percentage on map (0-100)
  image: string;
  description: string;
  funFact: string;
}

export const CAMPUS_LANDMARKS: CampusLandmark[] = [
  {
    id: 'paris-road',
    name: 'Paris Road',
    nameBn: 'প্যারিস রোড',
    category: 'historical',
    categoryBn: 'ঐতিহাসিক ও আড্ডা',
    x: 35,
    y: 42,
    image: '/campus/paris-road-rain.jpg',
    description: 'রাজশাহী বিশ্ববিদ্যালয়ের প্রাণকেন্দ্র—উঁচু গগনশিরীষ গাছে ছাওয়া বিখ্যাত সুরম্য পিচঢালা পথ।',
    funFact: '১৯৬৬ সালে তৎকালীন উপাচার্য এই সুউচ্চ গগনশিরীষ গাছগুলো রোপণ করেছিলেন।'
  },
  {
    id: 'ru-admin',
    name: 'Administrative Building',
    nameBn: 'প্রশাসন ভবন ও গোল চত্বর',
    category: 'academic',
    categoryBn: 'একাডেমিক ও প্রশাসনিক',
    x: 38,
    y: 55,
    image: '/campus/ru-admin.jpg',
    description: 'ঐতিহাসিক নীল রঙের প্রশাসন ভবন এবং এর সামনের বিশাল দৃষ্টিনন্দন বৃত্তাকার সবুজ চত্বর।',
    funFact: 'রাবির প্রধান প্রশাসনিক কেন্দ্র এবং ক্যাম্পাসের সবচেয়ে বেশি ছবি তোলা স্থাপত্য।'
  },
  {
    id: 'shabash-bangladesh',
    name: 'Shabash Bangladesh',
    nameBn: 'সাবাশ বাংলাদেশ চত্বর',
    category: 'historical',
    categoryBn: 'ঐতিহাসিক ও আড্ডা',
    x: 48,
    y: 46,
    image: '/campus/ru-roundabout.jpg',
    description: 'শিল্পী নিতুন কুণ্ডুর অমর সৃষ্টি—মুক্তিযুদ্ধের বীর শহীদদের স্মরণে নির্মিত ঐতিহাসিক ভাস্কর্য।',
    funFact: 'কবি সুকান্ত ভট্টাচার্যের কবিতার পঙক্তি নিয়ে এই স্মৃতিস্তম্ভের নামকরণ করা হয়।'
  },
  {
    id: 'shaheed-minar',
    name: 'Central Shaheed Minar',
    nameBn: 'কেন্দ্রীয় শহীদ মিনার ও মুক্তমঞ্চ',
    category: 'historical',
    categoryBn: 'ঐতিহাসিক ও আড্ডা',
    x: 43,
    y: 50,
    image: '/campus/ru-spot.jpg',
    description: 'মতিহারের সাংস্কৃতিক প্রাণকেন্দ্র, উন্মুক্ত নাট্যমঞ্চ ও অমর একুশে উদযাপনের মূল কেন্দ্র।',
    funFact: 'এখানে সারাবছর বিভিন্ন নাট্যদল, ব্যান্ড ও সাংস্কৃতিক সংগঠনের জমজমাট পরিবেশনা চলে।'
  },
  {
    id: 'tukitaki',
    name: 'Tukitaki Chattar',
    nameBn: 'টুকিটাকি চত্বর',
    category: 'historical',
    categoryBn: 'ঐতিহাসিক ও আড্ডা',
    x: 46,
    y: 48,
    image: '/campus/ru-spot.jpg',
    description: 'রাবিয়ানদের আড্ডা, চা, বিতর্ক ও সৃজনশীল বন্ধুত্বের ঐতিহাসিক স্মৃতিবিজড়িত মিলনস্থল।',
    funFact: 'রাবির এমন কোনো শিক্ষার্থী নেই যার টুকিটাকির চায়ের কাপে ঝড় তোলার গল্প নেই!'
  },
  {
    id: 'central-library',
    name: 'Central Library',
    nameBn: 'কেন্দ্রীয় লাইব্রেরি',
    category: 'academic',
    categoryBn: 'একাডেমিক ও প্রশাসনিক',
    x: 41,
    y: 46,
    image: '/campus/ru-admin.jpg',
    description: 'বাংলাদেশের অন্যতম বৃহত্তম গ্রন্থাগার, যা শিক্ষার্থীদের গবেষণা ও জ্ঞানচর্চার বাতিঘর।',
    funFact: 'এখানে সংরক্ষিত রয়েছে সাড়ে চার লাখেরও বেশি বই এবং দুর্লভ পাণ্ডুলিপি।'
  },
  {
    id: 'central-stadium',
    name: 'Central Stadium & Gym',
    nameBn: 'কেন্দ্রীয় স্টেডিয়াম ও জিমনেসিয়াম',
    category: 'nature',
    categoryBn: 'খেলার মাঠ ও প্রকৃতি',
    x: 48,
    y: 38,
    image: '/campus/ru-master-plan-3d.jpg',
    description: 'আন্তঃবিভাগ ফুটবল, ক্রিকেট প্রতিযোগিতা ও ক্রীড়াপ্রেমীদের পদচারণায় মুখরিত স্টেডিয়াম।',
    funFact: 'ক্যাম্পাসের সব বড় বড় টুর্নামেন্টের ফাইনাল ম্যাচ এই বিশাল মাঠে অনুষ্ঠিত হয়।'
  },
  {
    id: 'jubilee-lake',
    name: 'Juberi Lake & Guest House',
    nameBn: 'জুবেরী হ্রদ ও পার্ক',
    category: 'nature',
    categoryBn: 'খেলার মাঠ ও প্রকৃতি',
    x: 18,
    y: 42,
    image: '/campus/paris-road-rain.jpg',
    description: 'ক্যাম্পাসের শান্ত-স্নিগ্ধ লেক ও মনোরম পার্ক, যেখানে অতিথি পাখিদের আনাগোনা থাকে।',
    funFact: 'বিকেলের পড়ন্ত রোদে লেকের পানিতে প্যারিস রোডের গাছের প্রতিচ্ছবি অপূর্ব লাগে।'
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    nameBn: 'বোটানিক্যাল গার্ডেন',
    category: 'nature',
    categoryBn: 'খেলার মাঠ ও প্রকৃতি',
    x: 27,
    y: 22,
    image: '/campus/ru-roundabout.jpg',
    description: 'বিরল ভেষজ, বনজ ও ফুলের গাছপালায় ঘেরা ক্যাম্পাসের জীববৈচিত্র্য সংরক্ষণ কেন্দ্র।',
    funFact: 'উদ্ভিদবিজ্ঞান বিভাগের শত শত দুর্লভ উদ্ভিদের গবেষণাগার এটি।'
  },
  {
    id: 'rabindra-arts',
    name: 'Rabindra Arts Building',
    nameBn: 'রবীন্দ্র কলা ভবন',
    category: 'academic',
    categoryBn: 'একাডেমিক ও প্রশাসনিক',
    x: 30,
    y: 48,
    image: '/campus/ru-admin.jpg',
    description: 'কলা অনুষদের প্রধান ভবন, যেখানে বাংলা, ইংরেজি ও ইতিহাস বিভাগ অবস্থিত।',
    funFact: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের স্মরণে এই সুবিশাল একাডেমিক ভবনের নামকরণ।'
  },
  {
    id: 'science-buildings',
    name: '1st & 2nd Science Buildings',
    nameBn: 'বিজ্ঞান অনুষদ চত্বর (১ম, ২য় ও ৩য় ভবন)',
    category: 'academic',
    categoryBn: 'একাডেমিক ও প্রশাসনিক',
    x: 33,
    y: 36,
    image: '/campus/ru-admin.jpg',
    description: 'পদার্থ, রসায়ন, গণিত ও পরিসংখ্যান বিভাগের আধুনিক ল্যাবরেটরি কমপ্লেক্স।',
    funFact: 'দেশের অন্যতম সেরা বৈজ্ঞানিক গবেষণাকর্ম এই ল্যাবগুলো থেকে প্রকাশিত হয়।'
  },
  {
    id: 'begum-rokeya-hall',
    name: 'Begum Rokeya Hall',
    nameBn: 'বেগম রোকেয়া হল',
    category: 'hall',
    categoryBn: 'আবাসিক হল',
    x: 23,
    y: 30,
    image: '/campus/paris-road-rain.jpg',
    description: 'নারী শিক্ষার অগ্রদূত বেগম রোকেয়ার নামাঙ্কিত ক্যাম্পাসের ঐতিহ্যবাহী ছাত্রীনিবাস।',
    funFact: 'রাবির প্রথম আবাসিক ছাত্রী হল হিসেবে এর রয়েছে সুদীর্ঘ ইতিহাস।'
  },
  {
    id: 'mannujan-hall',
    name: 'Mannujan Hall',
    nameBn: 'মন্নুজান হল',
    category: 'hall',
    categoryBn: 'আবাসিক হল',
    x: 23,
    y: 45,
    image: '/campus/paris-road-rain.jpg',
    description: 'প্যারিস রোডের কাছাকাছি অবস্থিত অন্যতম প্রাচীন ও ছায়াঘেরা ছাত্রীনিবাস।',
    funFact: 'হলের সামনের ফুলের বাগান ও শান্ত পরিবেশ ক্যাম্পাসের অন্যতম আকর্ষণ।'
  },
  {
    id: 'zoha-hall',
    name: 'Shaheed Shamsuzzoha Hall',
    nameBn: 'শহীদ শামসুজ্জোহা হল',
    category: 'hall',
    categoryBn: 'আবাসিক হল',
    x: 58,
    y: 25,
    image: '/campus/ru-spot.jpg',
    description: '১৯৬৯-এর গণঅভ্যুত্থানের প্রথম শহীদ বুদ্ধিজীবী ড. জোহার স্মৃতিধন্য গৌরবময় হল।',
    funFact: '"আমার কোনো ছাত্রের গায়ে গুলি লাগার আগে আমার বুকে গুলি লাগবে"—ড. জোহার ঐতিহাসিক অমর বাণী।'
  },
  {
    id: 'habibur-rahman-hall',
    name: 'Shahid Habibur Rahman Hall',
    nameBn: 'শহীদ হবিবুর রহমান হল',
    category: 'hall',
    categoryBn: 'আবাসিক হল',
    x: 40,
    y: 20,
    image: '/campus/ru-master-plan-3d.jpg',
    description: 'স্টেডিয়ামের উত্তর পাশে অবস্থিত ক্যাম্পাসের অন্যতম সুবিশাল আবাসিক হল।',
    funFact: 'মুক্তিযুদ্ধে শহীদ রাবির প্রথিতযশা গণিত শিক্ষক হবিবুর রহমানের স্মরণে এর নামকরণ।'
  },
  {
    id: 'motihar-hall',
    name: 'Motihar Hall',
    nameBn: 'মতিহার হল',
    category: 'hall',
    categoryBn: 'আবাসিক হল',
    x: 49,
    y: 50,
    image: '/campus/ru-admin.jpg',
    description: 'মতিহারের মাটির সাথে নিবিড় সম্পর্কযুক্ত অন্যতম প্রাণবন্ত ছাত্রাবাস।',
    funFact: 'প্রশাসন ভবনের দক্ষিণ চত্বর সংলগ্ন হওয়ায় শিক্ষার্থীদের অন্যতম আড্ডাস্থল।'
  },
  {
    id: 'main-gate',
    name: 'RU Main Gate (Kazla)',
    nameBn: 'বিশ্ববিদ্যালয় প্রধান ফটক (কাজলা)',
    category: 'gate',
    categoryBn: 'ফটক ও প্রবেশদ্বার',
    x: 37,
    y: 65,
    image: '/campus/ru-gate.jpg',
    description: 'ঢাকা-রাজশাহী মহাসড়কের পাশে অবস্থিত মতিহার ক্যাম্পাসের সুদৃশ্য প্রধান তোরণ।',
    funFact: 'এই ফটক দিয়ে ক্যাম্পাসে ঢুকলেই শুরু হয় মনোমুগ্ধকর প্যারিস রোড।'
  },
  {
    id: 'boddhobhumi',
    name: 'Boddhobhumi Memorial',
    nameBn: 'বধ্যভূমি স্মৃতিস্তম্ভ',
    category: 'historical',
    categoryBn: 'ঐতিহাসিক ও আড্ডা',
    x: 75,
    y: 35,
    image: '/campus/ru-roundabout.jpg',
    description: 'একাত্তরের মহান মুক্তিযুদ্ধে শহীদ বীর সন্তানদের স্মরণে নির্মিত সুবিশাল স্মৃতিসৌধ।',
    funFact: 'এর সুউচ্চ মিনার এবং রক্তবর্ণ স্মৃতিস্তম্ভ ক্যাম্পাসের পূর্বাঞ্চলকে আলোকিত করে রাখে।'
  }
];

export interface CampusMapExplorerProps {
  onBackToDivision?: () => void;
  onBackToDistrict?: () => void;
}

export default function CampusMapExplorer({
  onBackToDivision,
  onBackToDistrict,
}: CampusMapExplorerProps = {}) {
  const [visited, setVisited] = useState<string[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<CampusLandmark | null>(null);
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [userName, setUserName] = useState('');
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [certificateDataUrl, setCertificateDataUrl] = useState<string | null>(null);

  // Load visited from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ru_visited_landmarks');
      if (saved) {
        setVisited(JSON.parse(saved));
      } else {
        // Default seed with iconic 3 spots so map starts welcoming
        const defaultVisited = ['paris-road', 'ru-admin', 'shabash-bangladesh'];
        setVisited(defaultVisited);
        localStorage.setItem('ru_visited_landmarks', JSON.stringify(defaultVisited));
      }
      const savedName = localStorage.getItem('ru_explorer_name');
      if (savedName) setUserName(savedName);
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
  }, []);

  const toggleVisited = (id: string) => {
    setVisited((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('ru_visited_landmarks', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const markAllVisited = () => {
    const allIds = CAMPUS_LANDMARKS.map((l) => l.id);
    setVisited(allIds);
    try {
      localStorage.setItem('ru_visited_landmarks', JSON.stringify(allIds));
    } catch {}
  };

  const resetAllVisited = () => {
    setVisited([]);
    try {
      localStorage.setItem('ru_visited_landmarks', JSON.stringify([]));
    } catch {}
  };

  const visitedCount = visited.length;
  const totalCount = CAMPUS_LANDMARKS.length;
  const percentage = Math.round((visitedCount / totalCount) * 100);

  // Dynamic Badges based on percentage (Unseen Bangladesh vibe)
  const rankInfo = useMemo(() => {
    if (percentage >= 90) return { title: 'খাঁটি মতিহারিয়ান লেজেন্ড 🏆', sub: 'আপনি পুরো রাবি চষে ফেলেছেন!', color: 'bg-amber-500' };
    if (percentage >= 60) return { title: 'মতিহার এক্সপ্লোরার 🌿', sub: 'ক্যাম্পাসের বেশিরভাগ রহস্য আপনার চেনা!', color: 'bg-emerald-500' };
    if (percentage >= 30) return { title: 'মতিহার ট্রাভেলার 🎒', sub: 'দারুণ! ক্যাম্পাসের প্রাণবন্ত পথগুলো ঘুরেছেন।', color: 'bg-blue-500' };
    return { title: 'মতিহার নবীন পর্যটক 🧭', sub: 'ক্যাম্পাস ঘোরা শুরু হোক এখনই!', color: 'bg-slate-500' };
  }, [percentage]);

  const filteredLandmarks = useMemo(() => {
    if (activeCategory === 'all') return CAMPUS_LANDMARKS;
    return CAMPUS_LANDMARKS.filter((l) => l.category === activeCategory);
  }, [activeCategory]);

  // Generate Social Share Card Image on Canvas (Unseen Bangladesh style)
  const generateCertificate = async () => {
    setIsGeneratingCertificate(true);
    setShowShareModal(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 675; // 16:9 modern social card
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Dark University Blue Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 675);

      // 2. Decorative University Gold & Blue Glow
      const glowGrad = ctx.createRadialGradient(250, 180, 50, 250, 180, 400);
      glowGrad.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
      glowGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1200, 675);

      // 3. Border Stroke
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, 1152, 627);

      // Gold Accent Inner Corner Line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(32, 32, 1136, 611);

      // 4. Header Top Brand
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('RU INSIDERS • মতিহার ক্যাম্পাস ট্র্যাকার', 70, 85);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('UNIVERSITY OF RAJSHAHI — OFFICIAL CAMPUS EXPLORATION RECORD', 70, 115);

      // 5. User Name & Title
      const displayName = userName.trim() || 'মতিহারের গর্বিত পর্যটক';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(displayName, 70, 195);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`অর্জন: ${rankInfo.title}`, 70, 235);

      // 6. Big Percentage Badge Box (Right side)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(830, 75, 300, 220, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.font = 'black 76px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${percentage}%`, 980, 175);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${visitedCount} / ${totalCount} টি স্পট সম্পন্ন`, 980, 220);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px sans-serif';
      ctx.fillText('মতিহার ক্যাম্পাস ঘুরেছেন', 980, 255);
      ctx.textAlign = 'left'; // Reset alignment

      // 7. Divider Line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(70, 310);
      ctx.lineTo(1130, 310);
      ctx.stroke();

      // 8. Visited Places Grid (Pills)
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ঘুরে দেখা স্থানসমূহ (Visited Campus Spots):', 70, 355);

      let colX = 70;
      let rowY = 400;
      const colWidth = 265;
      const rowHeight = 44;

      CAMPUS_LANDMARKS.slice(0, 18).forEach((item, index) => {
        const isVisited = visited.includes(item.id);
        const currentX = colX + (index % 4) * colWidth;
        const currentY = rowY + Math.floor(index / 4) * rowHeight;

        // Draw pill background
        ctx.fillStyle = isVisited ? 'rgba(34, 197, 94, 0.18)' : 'rgba(71, 85, 105, 0.25)';
        ctx.strokeStyle = isVisited ? '#22c55e' : '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(currentX, currentY - 26, colWidth - 15, 34, 10);
        ctx.fill();
        ctx.stroke();

        // Check icon or circle
        ctx.fillStyle = isVisited ? '#22c55e' : '#64748b';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(isVisited ? '✓' : '○', currentX + 10, currentY - 4);

        // Name text
        ctx.fillStyle = isVisited ? '#ffffff' : '#94a3b8';
        ctx.font = `${isVisited ? 'bold' : 'normal'} 14px sans-serif`;
        const truncatedName = item.nameBn.length > 16 ? item.nameBn.slice(0, 15) + '..' : item.nameBn;
        ctx.fillText(truncatedName, currentX + 30, currentY - 4);
      });

      // 9. Bottom Footer Verification Bar
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      const today = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(`ভেরিফাইড রেকর্ড • তারিখ: ${today} • ruinsiders.com`, 70, 615);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('RU Insiders • অফিশিয়াল ক্যাম্পাস মার্চেন্ডাইজ ও লাইফস্টাইল', 1130, 615);

      const url = canvas.toDataURL('image/png');
      setCertificateDataUrl(url);
    } catch (e) {
      console.error('Failed to generate canvas certificate:', e);
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  const handleDownload = () => {
    if (!certificateDataUrl) return;
    const link = document.createElement('a');
    link.download = `ru-campus-explorer-${userName.trim() || 'motihar'}.png`;
    link.href = certificateDataUrl;
    link.click();
  };

  const handleShareFacebook = () => {
    const text = encodeURIComponent(
      `আমি রাজশাহী বিশ্ববিদ্যালয়ের ${percentage}% জায়গা ঘুরে দেখেছি (${visitedCount}টি স্পট)! আপনি মতিহারের কতটুকু দেখেছেন? জেনে নিন RU Insiders ক্যাম্পাস ট্র্যাকার থেকে: https://ruinsiders.vercel.app`
    );
    window.open(`https://www.facebook.com/sharer/sharer.php?u=https://ruinsiders.vercel.app&quote=${text}`, '_blank');
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      
      {/* Multi-Stage Navigation Tabs (To switch between Division, District & RU Campus) */}
      {(onBackToDivision || onBackToDistrict) && (
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToDivision && (
            <button
              type="button"
              onClick={onBackToDivision}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 transition shadow"
            >
              <span>← ১. রাজশাহী বিভাগ ম্যাপ</span>
            </button>
          )}
          {onBackToDistrict && (
            <button
              type="button"
              onClick={onBackToDistrict}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow"
            >
              <span>← ২. রাজশাহী জেলা ম্যাপ</span>
            </button>
          )}
          <span className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>৩. রাজশাহী বিশ্ববিদ্যালয় (সক্রিয়)</span>
          </span>
        </div>
      )}

      {/* Header & Progress Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-repeat pointer-events-none" style={{ backgroundImage: `url('/campus/ru-master-plan-3d.jpg')` }} />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Compass className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
              <span>Unseen Motihar • ক্যাম্পাস এক্সপ্লোরেশন ট্র্যাকার</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              আপনি রাজশাহী বিশ্ববিদ্যালয়ের কতটুকু জায়গা ঘুরেছেন?
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
              ম্যাপ ও তালিকায় আপনি যে যে স্থানে গিয়েছেন সেগুলোতে ক্লিক করে সবুজ টিক (✔) দিন। জেনে নিন আপনার ক্যাম্পাস কভারেজ পারসেন্টেজ এবং বন্ধুদের সাথে শেয়ার করতে স্মৃতি কার্ড ডাউনলোড করুন!
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 flex-wrap text-xs">
              <button
                type="button"
                onClick={markAllVisited}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/30 text-emerald-300 font-bold flex items-center gap-1 transition-all"
              >
                <Check className="h-3 w-3" />
                <span>সবগুলো সিলেক্ট করুন</span>
              </button>
              <button
                type="button"
                onClick={resetAllVisited}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 font-medium flex items-center gap-1 transition-all"
              >
                <RotateCcw className="h-3 w-3" />
                <span>রিসেট</span>
              </button>
            </div>
          </div>

          {/* Live Scorecard Box */}
          <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-lg flex flex-col items-center text-center min-w-[260px]">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Trophy className="h-4 w-4" />
              <span>{rankInfo.title}</span>
            </div>
            
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight my-1">
              {percentage}%
            </div>
            
            <div className="text-xs text-slate-300 font-medium mb-3">
              <span className="font-bold text-white text-sm">{visitedCount}</span> / {totalCount} টি স্পট ঘোরা সম্পন্ন
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-700/80 rounded-full h-2.5 overflow-hidden border border-slate-600 mb-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <button
              type="button"
              onClick={generateCertificate}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            >
              <Camera className="h-4 w-4 text-amber-300" />
              <span>📸 স্মৃতি কার্ড বানান ও ডাউনলোড</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area: Map on Top, Landmark List Below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / TOP: Interactive Visual Map View (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-slate-900 text-sm">মতিহার ক্যাম্পাস ম্যাপ (Interactive Map)</span>
            </div>

            {/* 3D vs 2D Map Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => setMapMode('3d')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mapMode === '3d' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ৩ডি মাস্টারপ্ল্যান
              </button>
              <button
                type="button"
                onClick={() => setMapMode('2d')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mapMode === '2d' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ২ডি গাইড ম্যাপ
              </button>
            </div>
          </div>

          {/* The Interactive Map Surface */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 group">
            <img
              src={mapMode === '3d' ? '/campus/ru-master-plan-3d.jpg' : '/campus/ru-campus-index-map.png'}
              alt="Rajshahi University Campus Map"
              className="w-full h-full object-cover transition-transform duration-500 select-none group-hover:scale-[1.02]"
            />

            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

            {/* Interactive Pins Overlaid */}
            {CAMPUS_LANDMARKS.map((landmark) => {
              const isVisited = visited.includes(landmark.id);
              const isSelected = selectedLandmark?.id === landmark.id;

              return (
                <div
                  key={landmark.id}
                  style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer"
                  onClick={() => setSelectedLandmark(landmark)}
                >
                  <button
                    type="button"
                    aria-label={landmark.nameBn}
                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg transition-all transform hover:scale-125 ${
                      isVisited
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-300/60 shadow-emerald-500/50'
                        : 'bg-white text-slate-800 ring-2 ring-slate-400 hover:bg-blue-600 hover:text-white'
                    } ${isSelected ? 'scale-125 ring-4 ring-amber-400' : ''}`}
                  >
                    {isVisited ? <Check className="h-4 w-4 stroke-[3]" /> : <MapPin className="h-3.5 w-3.5" />}
                  </button>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-30">
                    <span className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-md border border-slate-700">
                      {landmark.nameBn} {isVisited ? '✔' : ''}
                    </span>
                    <span className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-white flex items-center gap-3 border border-white/20 shadow-md">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300 inline-block" />
                <span>ঘুরেছি ({visitedCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white ring-1 ring-slate-400 inline-block" />
                <span>যাইনি ({totalCount - visitedCount})</span>
              </span>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-500 text-center font-bengali">
            💡 ম্যাপের যেকোনো পয়েন্টে ট্যাপ করে ছবি ও তথ্য দেখুন অথবা তালিকায় টিক দিয়ে সংরক্ষণ করুন।
          </p>
        </div>

        {/* RIGHT: Landmark List & Category Filters (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>ক্যাম্পাস স্পট লিস্ট ({visitedCount}/{totalCount})</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {percentage}% সম্পন্ন
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: 'সবগুলো' },
              { id: 'historical', label: 'আড্ডা ও ইতিহাস' },
              { id: 'academic', label: 'একাডেমিক' },
              { id: 'hall', label: 'হলসমূহ' },
              { id: 'nature', label: 'প্রকৃতি ও মাঠ' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Scrollable Landmark Cards */}
          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredLandmarks.map((landmark) => {
              const isVisited = visited.includes(landmark.id);

              return (
                <div
                  key={landmark.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isVisited
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => setSelectedLandmark(landmark)}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 shadow-inner">
                      <img
                        src={landmark.image}
                        alt={landmark.nameBn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{landmark.nameBn}</span>
                        {isVisited && <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />}
                      </h4>
                      <p className="text-[11px] text-slate-500">{landmark.name}</p>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                        {landmark.categoryBn}
                      </span>
                    </div>
                  </div>

                  {/* Visited Checkbox Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleVisited(landmark.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isVisited
                        ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {isVisited ? (
                      <>
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                        <span>ঘুরেছি</span>
                      </>
                    ) : (
                      <span>+ যাবো</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* POPUP 1: Landmark Detail Modal */}
      {selectedLandmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={selectedLandmark.image}
                alt={selectedLandmark.nameBn}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedLandmark(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-xl text-xs text-white font-bold border border-white/20">
                {selectedLandmark.categoryBn}
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">{selectedLandmark.nameBn}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedLandmark.name}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-bengali leading-relaxed">
                {selectedLandmark.description}
              </p>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  ক্যাম্পাস তথ্য:
                </span>
                <p className="font-bengali text-amber-950">{selectedLandmark.funFact}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    toggleVisited(selectedLandmark.id);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    visited.includes(selectedLandmark.id)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  }`}
                >
                  {visited.includes(selectedLandmark.id) ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>ঘুরেছি হিসেবে চিহ্নিত (Visited)</span>
                    </>
                  ) : (
                    <span>এখানে গিয়েছি বলে চিহ্নিত করুন</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLandmark(null)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Social Media Share & Certificate Modal (Unseen Bangladesh Style) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[95vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">
                  আপনার মতিহার ক্যাম্পাস এক্সপ্লোরার কার্ড
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Name Input to Personalize Card */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                আপনার নাম দিন (কার্ডে প্রিন্ট হবে):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="যেমন: মাহিম / রাবি শিক্ষার্থী"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    try {
                      localStorage.setItem('ru_explorer_name', e.target.value);
                    } catch {}
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={generateCertificate}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs whitespace-nowrap shadow-sm"
                >
                  আপডেট কার্ড
                </button>
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
              {certificateDataUrl ? (
                <img
                  src={certificateDataUrl}
                  alt="RU Campus Explorer Card"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  কার্ড জেনারেট হচ্ছে...
                </div>
              )}
            </div>

            {/* Download & Social Share Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <Download className="h-4 w-4" />
                <span>📸 ইমেজ ডাউনলোড করুন (Save Image)</span>
              </button>

              <button
                type="button"
                onClick={handleShareFacebook}
                className="flex-1 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <Facebook className="h-4 w-4" />
                <span>📢 ফেসবুকে শেয়ার করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
