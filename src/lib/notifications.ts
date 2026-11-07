// Helper utilities for Web Push Notifications & Subscriber Management
export interface NotificationSubscriber {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  browserPermission?: 'granted' | 'denied' | 'default';
  pushEndpoint?: string;
  createdAt: string;
}

export interface NewsNotificationItem {
  id: string;
  title: string;
  category: string;
  time: string;
  excerpt: string;
  link?: string;
  isNew?: boolean;
}

export const INITIAL_NOTIFICATIONS: NewsNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'রাবি ২০২৪-২৫ শিক্ষাবর্ষের ভর্তি পরীক্ষার পূর্ণাঙ্গ রুটিন প্রকাশিত',
    category: 'অ্যাকাডেমিক নোটিশ',
    time: '১০ মিনিট আগে',
    excerpt: 'আগামী ১২ই এপ্রিল থেকে এ, বি ও সি ইউনিটের পরীক্ষা শুরু হবে। আসন বিন্যাস ওয়েবসাইটে পাওয়া যাবে।',
    link: '/#inside-ru',
    isNew: true,
  },
  {
    id: 'notif-2',
    title: 'মতিহার সবুজ চত্বরে শুরু হলো তিন দিনব্যাপী বার্ষিক সাহিত্য ও বসন্ত উৎসব',
    category: 'ক্যাম্পাস লাইফ',
    time: '১ ঘণ্টা আগে',
    excerpt: 'শাবাশ বাংলাদেশ চত্বরে শুরু হয়েছে কবিতা আবৃত্তি, বইমেলা ও সাংস্কৃতিক পরিবেশনা।',
    link: '/#inside-ru',
    isNew: true,
  },
  {
    id: 'notif-3',
    title: 'রিসার্চ পেপার পাবলিকেশন সম্মাননা পেলেন রাজশাহী বিশ্ববিদ্যালয়ের ৫ জন গবেষক',
    category: 'গবেষণা ও উদ্ভাবন',
    time: '৩ ঘণ্টা আগে',
    excerpt: 'আন্তর্জাতিক কিউ-১ জার্নালে উচ্চমানের গবেষণা প্রকাশের স্বীকৃতিস্বরূপ রাবি উপাচার্য সম্মাননা ক্রেস্ট প্রদান করেছেন।',
    link: '/#inside-ru',
    isNew: false,
  },
  {
    id: 'notif-4',
    title: 'বিশ্ববিদ্যালয়ের বিভিন্ন ক্লাবের নতুন সদস্য নিবন্ধন শুরু হয়েছে',
    category: 'ক্লাব ও সংস্কৃতি',
    time: '৫ ঘণ্টা আগে',
    excerpt: 'RUCS, RUDEU, ক্যারিয়ার ক্লাব এবং বাঁধন-সহ ২৫+ ক্লাবে সরাসরি ওয়েবসাইটের মাধ্যমে যুক্ত হওয়া যাবে।',
    link: '/#clubs',
    isNew: false,
  },
];

// Check if browser notifications are supported
export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// Get current permission
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// Request Browser Push Notification Permission
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isBrowserNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        localStorage.setItem('ru_push_notifications_enabled', 'true');
      } catch (e) {}

      // Fire a welcome test notification
      try {
        new Notification('RU Insiders নোটিফিকেশন সক্রিয় হয়েছে! 🎉', {
          body: 'রাজশাহী বিশ্ববিদ্যালয়ের সকল ব্রেকিং নিউজ, গল্প ও ক্যাম্পাস আপডেট সবার আগে সরাসরি পাবেন।',
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Error displaying native notification:', e);
      }

      // Record to server API
      try {
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            browserPermission: 'granted',
            source: 'browser_push_prompt',
          }),
        });
      } catch (e) {}
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

// Trigger browser notification directly if permission is granted
export function triggerBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!isBrowserNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }
  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
    return true;
  } catch (err) {
    console.error('Error triggering push notification:', err);
    return false;
  }
}
