'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Printer, 
  ShoppingBag, 
  PlusCircle, 
  Truck, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  FileText, 
  Phone, 
  Send, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  RefreshCw, 
  Loader2, 
  Image as ImageIcon,
  UploadCloud,
  Camera, 
  ExternalLink, 
  FolderPlus,
  Video,
  Play,
  X,
  Edit3,
  Palette,
  Bike,
  PackageCheck,
  Ban,
  RotateCcw,
  Database,
  Copy,
  Download,
  CheckCheck
} from 'lucide-react';
import RevenueCharts from '@/components/RevenueCharts';
import PrintDesk from '@/components/PrintDesk';
import SteadfastModal from '@/components/SteadfastModal';
import { Product, Order, PrintJob, SteadfastConfig, ProductCategory, RevenueSummary } from '@/lib/types';
import { formatBDT, formatDate } from '@/lib/utils';
import { INITIAL_STEADFAST_CONFIG, calculateRevenueSummary } from '@/lib/store';
import { getBrowserSupabaseClient } from '@/lib/supabase';
import { SUPABASE_SCHEMA_SQL } from '@/lib/supabase-schema-text';

const PRESET_COLORS = [
  { name: 'Heritage Maroon', hex: '#881337' },
  { name: 'Midnight Black', hex: '#0f172a' },
  { name: 'Royal Blue', hex: '#1d4ed8' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Vintage Olive', hex: '#3f6212' },
  { name: 'Washed Ash', hex: '#64748b' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Campus Navy', hex: '#1e3a8a' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics' | 'steadfast'>('products');
  
  // Real-time Database State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [steadfastConfig, setSteadfastConfig] = useState<SteadfastConfig>(INITIAL_STEADFAST_CONFIG);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [testingSteadfast, setTestingSteadfast] = useState(false);
  const [steadfastTestResult, setSteadfastTestResult] = useState<{ success: boolean; message: string; balance?: string } | null>(null);

  // Steadfast Modal State
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState<Order | null>(null);

  // Order Processing Stages Filter
  const [orderStageFilter, setOrderStageFilter] = useState<'pending' | 'ready_for_pickup' | 'rider' | 'delivered' | 'cancelled' | 'all'>('pending');

  // Admin Product Category Filter
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>('all');

  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductNameBn, setNewProductNameBn] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<string>('hoodies');
  const [newProductPrice, setNewProductPrice] = useState(1150);
  const [newProductRegularPrice, setNewProductRegularPrice] = useState<number | undefined>(1400);
  const [newProductCost, setNewProductCost] = useState(650);
  const [newProductStock, setNewProductStock] = useState(30);
  const [newProductImages, setNewProductImages] = useState<string[]>(['', '', '', '']);
  const [newProductVideo, setNewProductVideo] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductColors, setNewProductColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Heritage Maroon', hex: '#881337' },
    { name: 'Midnight Black', hex: '#0f172a' },
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#1d4ed8');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Dynamic Categories State
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: 'hoodies', name: 'Winter Hoodie (শীতের হুডি)' },
    { id: 'drop-shoulder', name: 'Drop Shoulder (ড্রপ শোল্ডার)' },
    { id: 'jerseys', name: 'Sports Jersey (কাস্টম জার্সি)' },
    { id: 't-shirts', name: 'Classic Ganji / T-Shirt (গেঞ্জি)' },
    { id: 'accessories', name: 'Campus Accessories (ব্যাগ ও এক্সেসরিজ)' },
  ]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // 4 Images & Video Upload State (Add Product)
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const slotInputRef0 = useRef<HTMLInputElement>(null);
  const slotInputRef1 = useRef<HTMLInputElement>(null);
  const slotInputRef2 = useRef<HTMLInputElement>(null);
  const slotInputRef3 = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editImages, setEditImages] = useState<string[]>(['', '', '', '']);
  const [editVideo, setEditVideo] = useState('');
  const [editColors, setEditColors] = useState<{ name: string; hex: string }[]>([]);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [editUploadingSlot, setEditUploadingSlot] = useState<number | null>(null);
  const [editUploadingVideo, setEditUploadingVideo] = useState(false);
  const editSlotInputRef0 = useRef<HTMLInputElement>(null);
  const editSlotInputRef1 = useRef<HTMLInputElement>(null);
  const editSlotInputRef2 = useRef<HTMLInputElement>(null);
  const editSlotInputRef3 = useRef<HTMLInputElement>(null);
  const editVideoInputRef = useRef<HTMLInputElement>(null);

  // Supabase Cloud Status & Backup State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected?: boolean;
    error?: string;
    counts?: { products: number; orders: number; printJobs: number };
  } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCategoryInput.trim()) return;
    const cleanName = customCategoryInput.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newCat = { id: slug, name: cleanName };
    if (!categories.some((c) => c.id === slug)) {
      setCategories((prev) => [...prev, newCat]);
    }
    setNewProductCategory(slug);
    setCustomCategoryInput('');
    setIsAddingNewCategory(false);
    showNotification(`New category "${cleanName}" added!`);
  };

  const handleSlotImageUpload = async (slotIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewProductImages((prev) => {
          const updated = [...prev];
          updated[slotIdx] = event.target!.result as string;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);

    try {
      setUploadingSlot(slotIdx);

      // 1. Direct Supabase Storage upload if available
      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        const safeName = `images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: sData, error: sErr } = await supabase.storage
          .from('ru-uploads')
          .upload(safeName, file, { cacheControl: '3600', upsert: true });

        if (!sErr && sData) {
          const { data: pubData } = supabase.storage.from('ru-uploads').getPublicUrl(safeName);
          setNewProductImages((prev) => {
            const updated = [...prev];
            updated[slotIdx] = pubData.publicUrl;
            return updated;
          });
          showNotification(`ছবি #${slotIdx + 1} ক্লাউডে সফলভাবে আপলোড হয়েছে!`);
          return;
        }
      }

      // 2. Fallback to /api/upload
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setNewProductImages((prev) => {
          const updated = [...prev];
          updated[slotIdx] = data.url;
          return updated;
        });
        showNotification(`ছবি #${slotIdx + 1} সফলভাবে আপলোড হয়েছে!`);
      }
    } catch (err) {
      console.error(err);
      showNotification(`ছবি #${slotIdx + 1} আপলোডে সমস্যা হয়েছে`, 'error');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleProductVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const sizeMb = file.size / (1024 * 1024);

    if (sizeMb > 60) {
      showNotification('ভিডিও সাইজ ৬০MB এর বেশি হতে পারবে না।', 'error');
      return;
    }

    try {
      setUploadingVideo(true);

      // 1. Direct Supabase Storage upload
      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        const safeName = `videos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: sData, error: sErr } = await supabase.storage
          .from('ru-uploads')
          .upload(safeName, file, { cacheControl: '3600', upsert: true });

        if (!sErr && sData) {
          const { data: pubData } = supabase.storage.from('ru-uploads').getPublicUrl(safeName);
          setNewProductVideo(pubData.publicUrl);
          showNotification('প্রোডাক্ট ভিডিও সরাসরি ক্লাউডে সফলভাবে আপলোড হয়েছে!');
          return;
        }
      }

      // 2. Serverless 4.5MB limitation warning
      if (sizeMb > 4.5) {
        showNotification(
          `ভিডিও সাইজ (${sizeMb.toFixed(1)}MB) Vercel লিমিটের (৪.৫MB) বেশি। ক্লাউড আপলোডের জন্য Supabase যুক্ত করুন অথবা নিচে ভিডিও URL লিঙ্ক দিন।`,
          'error'
        );
        return;
      }

      // 3. Fallback to /api/upload
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setNewProductVideo(data.url);
        showNotification('প্রোডাক্ট ভিডিও সফলভাবে আপলোড হয়েছে!');
      } else {
        throw new Error(data.message || 'Video upload failed');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'ভিডিও আপলোডে সমস্যা হয়েছে', 'error');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Edit Handlers
  const startEditingProduct = (p: Product) => {
    setEditingProduct({ ...p });
    const imgSlots = ['', '', '', ''];
    if (p.images) {
      p.images.forEach((img, idx) => {
        if (idx < 4) imgSlots[idx] = img;
      });
    }
    setEditImages(imgSlots);
    setEditVideo(p.video || '');
    setEditColors(p.colors && p.colors.length > 0 ? [...p.colors] : [...PRESET_COLORS.slice(0, 2)]);
  };

  const handleEditSlotImageUpload = async (slotIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditImages((prev) => {
          const updated = [...prev];
          updated[slotIdx] = event.target!.result as string;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);

    try {
      setEditUploadingSlot(slotIdx);

      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        const safeName = `images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: sData, error: sErr } = await supabase.storage
          .from('ru-uploads')
          .upload(safeName, file, { cacheControl: '3600', upsert: true });

        if (!sErr && sData) {
          const { data: pubData } = supabase.storage.from('ru-uploads').getPublicUrl(safeName);
          setEditImages((prev) => {
            const updated = [...prev];
            updated[slotIdx] = pubData.publicUrl;
            return updated;
          });
          showNotification(`এডিট ছবি #${slotIdx + 1} ক্লাউডে আপলোড হয়েছে!`);
          return;
        }
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setEditImages((prev) => {
          const updated = [...prev];
          updated[slotIdx] = data.url;
          return updated;
        });
        showNotification(`এডিট ছবি #${slotIdx + 1} সফলভাবে আপলোড হয়েছে!`);
      }
    } catch (err) {
      console.error(err);
      showNotification('ছবি আপলোডে সমস্যা হয়েছে', 'error');
    } finally {
      setEditUploadingSlot(null);
    }
  };

  const handleEditVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const sizeMb = file.size / (1024 * 1024);

    if (sizeMb > 60) {
      showNotification('ভিডিও সাইজ সর্বোচ্চ ৬০MB অনুমোদিত।', 'error');
      return;
    }

    try {
      setEditUploadingVideo(true);

      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        const safeName = `videos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: sData, error: sErr } = await supabase.storage
          .from('ru-uploads')
          .upload(safeName, file, { cacheControl: '3600', upsert: true });

        if (!sErr && sData) {
          const { data: pubData } = supabase.storage.from('ru-uploads').getPublicUrl(safeName);
          setEditVideo(pubData.publicUrl);
          showNotification('এডিট ভিডিও সরাসরি ক্লাউডে সফলভাবে আপলোড হয়েছে!');
          return;
        }
      }

      if (sizeMb > 4.5) {
        showNotification(
          `ভিডিও সাইজ (${sizeMb.toFixed(1)}MB) Vercel লিমিটের (৪.৫MB) বেশি। ক্লাউড আপলোডের জন্য Supabase যুক্ত করুন অথবা নিচে ভিডিও URL লিঙ্ক দিন।`,
          'error'
        );
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setEditVideo(data.url);
        showNotification('এডিট ভিডিও সফলভাবে আপলোড হয়েছে!');
      }
    } catch (err) {
      console.error(err);
      showNotification('ভিডিও আপলোডে সমস্যা হয়েছে', 'error');
    } finally {
      setEditUploadingVideo(false);
    }
  };

  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setUpdatingProduct(true);
    const pin = getAdminPin();

    const finalImages = editImages.map((s) => s.trim()).filter(Boolean);
    if (finalImages.length === 0) {
      finalImages.push('/mockups/hoodie-front.jpg');
    }

    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update',
          id: editingProduct.id,
          updates: {
            name: editingProduct.name.trim(),
            nameBn: editingProduct.nameBn?.trim() || '',
            category: editingProduct.category,
            price: Number(editingProduct.price),
            regularPrice: editingProduct.regularPrice ? Number(editingProduct.regularPrice) : undefined,
            costPrice: Number(editingProduct.costPrice),
            stock: Number(editingProduct.stock),
            images: finalImages,
            video: editVideo.trim() || undefined,
            colors: editColors.length > 0 ? editColors : [{ name: 'Standard', hex: '#881337' }],
            description: editingProduct.description.trim(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update product');
      }

      showNotification(`"${editingProduct.name}" সফলভাবে ডাটাবেজে আপডেট হয়েছে!`);
      setEditingProduct(null);
      loadDatabaseState();
    } catch (err: any) {
      showNotification(err.message || 'Error updating product', 'error');
    } finally {
      setUpdatingProduct(false);
    }
  };

  const getAdminPin = useCallback(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('ru_admin_pin') || '1953' : '1953';
  }, []);

  // Fetch full live database state
  const loadDatabaseState = useCallback(async () => {
    setRefreshing(true);
    const pin = getAdminPin();

    try {
      // 1. Fetch Products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success) setProducts(prodData.products);
      }

      // 2. Fetch Orders
      const ordRes = await fetch('/api/orders', {
        headers: { 'x-admin-pin': pin },
        credentials: 'include',
      });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success) setOrders(ordData.orders);
      }

      // 3. Fetch Print Jobs
      const printRes = await fetch('/api/print-station', {
        headers: { 'x-admin-pin': pin },
        credentials: 'include',
      });
      if (printRes.ok) {
        const printData = await printRes.json();
        if (printData.success) setPrintJobs(printData.jobs);
      }

      // 4. Fetch Steadfast Config
      const sfRes = await fetch('/api/admin/steadfast', {
        headers: { 'x-admin-pin': pin },
        credentials: 'include',
      });
      if (sfRes.ok) {
        const sfData = await sfRes.json();
        if (sfData.success && sfData.config) setSteadfastConfig(sfData.config);
      }

      // 5. Fetch Supabase Cloud Status
      try {
        const sbRes = await fetch('/api/admin/supabase-status');
        if (sbRes.ok) {
          const sbData = await sbRes.json();
          if (sbData.success) setSupabaseStatus(sbData);
        }
      } catch {}
    } catch (e) {
      console.error('Error refreshing admin database:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAdminPin]);

  const handleSyncToSupabase = async () => {
    setSyncingSupabase(true);
    const pin = getAdminPin();
    try {
      const res = await fetch('/api/admin/supabase-status', {
        method: 'POST',
        headers: { 'x-admin-pin': pin },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message || 'Supabase ক্লাউডে সফলভাবে সিঙ্ক হয়েছে!');
        loadDatabaseState();
      } else {
        throw new Error(data.message || 'Supabase সিঙ্ক ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      showNotification(err.message || 'Supabase সিঙ্কে সমস্যা হয়েছে', 'error');
    } finally {
      setSyncingSupabase(false);
    }
  };

  useEffect(() => {
    const pin = sessionStorage.getItem('ru_admin_pin');
    if (!pin) {
      router.push('/admin');
      return;
    }
    loadDatabaseState();
  }, [router, loadDatabaseState]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ru_admin_pin');
    router.push('/admin');
  };

  // Add Product to Persistent Database
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProduct(true);
    const pin = getAdminPin();

    const finalImages = newProductImages.map((s) => s.trim()).filter(Boolean);
    if (finalImages.length === 0) {
      finalImages.push('/mockups/hoodie-front.jpg');
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newProductName,
          nameBn: newProductNameBn,
          category: newProductCategory,
          description: newProductDesc,
          price: newProductPrice,
          regularPrice: newProductRegularPrice,
          costPrice: newProductCost,
          stock: newProductStock,
          images: finalImages,
          video: newProductVideo.trim() || undefined,
          colors: newProductColors.length > 0 ? newProductColors : PRESET_COLORS.slice(0, 2),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add product');
      }

      showNotification('পণ্য সফলভাবে ডাটাবেজে যুক্ত হয়েছে এবং মূল পেজে লাইভ হয়েছে!');
      setNewProductName('');
      setNewProductNameBn('');
      setNewProductDesc('');
      setNewProductImages(['', '', '', '']);
      setNewProductVideo('');
      setProducts(data.products || [data.product, ...products]);
      loadDatabaseState();
    } catch (err: any) {
      showNotification(err.message || 'Error adding product', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete Product from Persistent Database
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? এটি সম্পূর্ণ ডাটাবেজ ও মূল পেজ থেকে মুছে যাবে।`)) {
      return;
    }

    const pin = getAdminPin();
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin },
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete');
      }

      showNotification(`"${name}" ডাটাবেজ থেকে সফলভাবে মুছে ফেলা হয়েছে!`);
      setProducts(data.products || products.filter((p) => p.id !== id));
    } catch (err: any) {
      showNotification(err.message || 'Error deleting product', 'error');
    }
  };

  // Reorder Product Position
  const handleMoveProduct = async (id: string, direction: 'up' | 'down') => {
    const pin = getAdminPin();
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'move', id, direction }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reorder');
      }

      showNotification(`পণ্যের অবস্থান সফলভাবে পরিবর্তন করা হয়েছে!`);
      setProducts(data.products);
    } catch (err: any) {
      showNotification(err.message || 'Error reordering product', 'error');
    }
  };

  // Update Order Status (Progression flow)
  const handleUpdateOrderStatus = async (
    orderId: string, 
    newStatus: Order['status'], 
    cancelledFrom?: string
  ) => {
    const pin = getAdminPin();
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        credentials: 'include',
        body: JSON.stringify({ id: orderId, status: newStatus, cancelledFrom }),
      });

      if (res.ok) {
        const statusLabels: Record<string, string> = {
          ready_for_pickup: 'পণ্য প্রস্তুত ➔ Ready for Pickup-এ পাঠানো হয়েছে!',
          rider: 'রাইডারের হাতে তুলে দেওয়া হয়েছে (Rider Handover)!',
          delivered: 'ডেলিভারি সম্পন্ন (Delivered) হিসেবে চিহ্নিত হয়েছে!',
          pending: 'অর্ডার পেন্ডিং তালিকায় স্থানান্তর করা হয়েছে!',
          cancelled: 'অর্ডার বাতিল করা হয়েছে!',
        };
        showNotification(statusLabels[newStatus] || 'অর্ডার স্ট্যাটাস আপডেট হয়েছে!');
        loadDatabaseState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel Order with State Tracking
  const handleCancelOrder = async (orderId: string, currentStatus: string) => {
    const stageName = 
      currentStatus === 'pending' ? 'Pending (পেন্ডিং অবস্থা)' :
      currentStatus === 'ready_for_pickup' ? 'Ready for Pickup (পিকআপ প্রস্তুতি)' :
      currentStatus === 'rider' ? 'Rider (রাইডারের কাছে থাকা অবস্থায়)' :
      currentStatus === 'shipped_steadfast' ? 'Steadfast (কুরিয়ারে শিপ থাকা অবস্থায়)' :
      'অর্ডার প্রসেসিং';

    if (!confirm(`Are you sure you want to cancel this order? It will be marked as Cancelled from "${stageName}".`)) {
      return;
    }

    await handleUpdateOrderStatus(orderId, 'cancelled', stageName);
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Delete order ${orderNumber}?`)) return;
    const pin = getAdminPin();
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin },
        credentials: 'include',
      });
      if (res.ok) {
        showNotification(`Order ${orderNumber} deleted.`);
        setOrders(orders.filter((o) => o.id !== orderId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourierSuccess = (consignmentId: string, trackingCode: string) => {
    showNotification(`Steadfast Consignment booked! Code: ${trackingCode}`);
    loadDatabaseState();
  };

  const revenueSummary: RevenueSummary = calculateRevenueSummary(orders, printJobs, products);

  // Filter orders by active stage
  const filteredOrders = orders.filter((o) => {
    if (orderStageFilter === 'all') return true;
    if (orderStageFilter === 'rider') return o.status === 'rider' || o.status === 'shipped_steadfast';
    return o.status === orderStageFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dedicated Clean Minimal Admin Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-blue-600 p-0.5 bg-white shadow-sm overflow-hidden shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex flex-wrap items-center gap-2">
              <span>RU Insiders Central Control Suite</span>
              {supabaseStatus?.connected ? (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Supabase Live
                </span>
              ) : (
                <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                  Database Active
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 font-bengali">
              পণ্য আপলোড ও এডিট, ক্যাটাগরি কন্ট্রোল ও ৫-ধাপের অর্ডার ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        {/* Top Actions: Refresh & Exit only */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={loadDatabaseState}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-all shadow-sm"
            title="Refresh database records"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Alert */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {actionMessage.type === 'success' ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'products', label: 'Product Manager (পণ্য ও ক্যাটাগরি)', icon: PlusCircle, count: products.length },
          { id: 'orders', label: 'Merchandise Orders (৫ ধাপের অর্ডার)', icon: ShoppingBag, count: orders.length },
          { id: 'analytics', label: 'Revenue & Profit (আয় ও লাভ)', icon: TrendingUp, count: null },
          { id: 'steadfast', label: 'Steadfast Courier API', icon: Truck, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCT MANAGER & POSITION REORDERING */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add Product Form (5 Cols) */}
          <form onSubmit={handleAddProduct} className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
                <span>নতুন পণ্য যুক্ত করুন (Add Product)</span>
              </h3>
              <p className="text-xs text-slate-500 font-bengali">
                নতুন পণ্য যুক্ত করামাত্রই তা ডাটাবেজে সেভ হবে এবং হোমপেজের শুরুতে প্রদর্শিত হবে।
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Product Title (ইংরেজি নাম)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RU Paris Road Drop Shoulder Black"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Bangla Title (বাংলা নাম - অপশনাল)</label>
                <input
                  type="text"
                  placeholder="যেমন: রাবি প্যারিস রোড ড্রপ শোল্ডার"
                  value={newProductNameBn}
                  onChange={(e) => setNewProductNameBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-bengali"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Category (ক্যাটাগরি)</label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>{isAddingNewCategory ? 'Cancel' : '+ নতুন ক্যাটাগরি'}</span>
                  </button>
                </div>

                {isAddingNewCategory && (
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 mb-2 space-y-2">
                    <span className="text-[11px] font-bold text-slate-800">নতুন ক্যাটাগরির নাম দিন:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="যেমন: Polo Shirt (পোলো শার্ট) বা Cap"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                      >
                        যুক্ত করুন
                      </button>
                    </div>
                  </div>
                )}

                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Selling Price (বিক্রয় মূল্য ৳)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-blue-700 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Cost Price (উৎপাদন খরচ ৳)</label>
                  <input
                    type="number"
                    required
                    value={newProductCost}
                    onChange={(e) => setNewProductCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Stock Available (স্টক)</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Regular/Original Price (আগের দাম ৳)</label>
                  <input
                    type="number"
                    placeholder="যেমন: 1400 (ঐচ্ছিক)"
                    value={newProductRegularPrice || ''}
                    onChange={(e) => setNewProductRegularPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-rose-600 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Product Colors Manager */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="block text-slate-700 font-semibold text-xs flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-blue-600" />
                  <span>Available Colors (পণ্যের রং)</span>
                </label>

                {/* Selected Colors Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {newProductColors.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => setNewProductColors(newProductColors.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Preset Color Selection Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold self-center">প্রিসেট:</span>
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = newProductColors.some((c) => c.name === preset.name);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setNewProductColors(newProductColors.filter((c) => c.name !== preset.name));
                          } else {
                            setNewProductColors([...newProductColors, preset]);
                          }
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: preset.hex }} />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4 Photo Upload Slots + Product Video */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    <span>Product Photo Gallery (৪টি ছবি আপলোড করুন)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 font-bengali">
                    ১ নম্বর ছবিটি মূল কভার হিসেবে হোমপেজে শো করবে। বাকি ছবিগুলো বিস্তারিত পেজে দেখা যাবে।
                  </p>
                </div>

                {/* 4 Image Slots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { slotIdx: 0, label: '১. মূল কভার (Main)', hint: 'হোমপেজ ও কার্ড ভিউ' },
                    { slotIdx: 1, label: '২. সাইড / অ্যাঙ্গেল', hint: 'ডিটেইল ভিউ ২' },
                    { slotIdx: 2, label: '৩. ফেব্রিক / ব্যাক', hint: 'ক্লোজ-আপ ভিউ ৩' },
                    { slotIdx: 3, label: '৪. মডেল লুক', hint: 'মডেল শট ৪' },
                  ].map(({ slotIdx, label, hint }) => {
                    const currentImg = newProductImages[slotIdx];
                    const isUploading = uploadingSlot === slotIdx;
                    const ref = [slotInputRef0, slotInputRef1, slotInputRef2, slotInputRef3][slotIdx];

                    return (
                      <div key={slotIdx} className="p-2 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                        <input
                          type="file"
                          ref={ref}
                          accept="image/*"
                          onChange={(e) => handleSlotImageUpload(slotIdx, e)}
                          className="hidden"
                        />

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-bold text-slate-800 line-clamp-1">{label}</span>
                            {slotIdx === 0 && (
                              <span className="text-[8px] bg-blue-600 text-white font-mono px-1 rounded">PRIMARY</span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-500 line-clamp-1">{hint}</p>
                        </div>

                        {/* Preview Box */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center group">
                          {currentImg ? (
                            <>
                              <img
                                src={currentImg}
                                alt={`Slot ${slotIdx + 1}`}
                                onError={(e) => { e.currentTarget.src = '/mockups/hoodie-front.jpg'; }}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setNewProductImages((prev) => {
                                    const updated = [...prev];
                                    updated[slotIdx] = '';
                                    return updated;
                                  });
                                }}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                                title="Remove"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div
                              onClick={() => ref.current?.click()}
                              className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-blue-50/50 text-slate-400 hover:text-blue-600 transition-colors p-2 text-center"
                            >
                              {isUploading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                              ) : (
                                <>
                                  <Camera className="h-5 w-5" />
                                  <span className="text-[9px] font-bold">+ ছবি দিন</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Upload Button & URL fallback */}
                        <div className="space-y-1">
                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => ref.current?.click()}
                            className="w-full py-1 px-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                          >
                            {isUploading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <UploadCloud className="h-3 w-3" />
                            )}
                            <span>{currentImg ? 'পরিবর্তন' : 'আপলোড'}</span>
                          </button>

                          <input
                            type="text"
                            placeholder="বা ছবির লিংক"
                            value={currentImg}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewProductImages((prev) => {
                                const updated = [...prev];
                                updated[slotIdx] = val;
                                return updated;
                              });
                            }}
                            className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[9px] font-mono focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Product Video Upload & Player Section */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                        <Video className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Product Video (প্রোডাক্টের ভিডিও)</h4>
                        <p className="text-[10px] text-slate-500 font-bengali">
                          হোমপেজে মাউস আনলে বা ভিজিট করলে স্বয়ংক্রিয়ভাবে ভিডিও চলবে এবং ডিটেইল পেজে ফুল ভিডিও দেখা যাবে।
                        </p>
                      </div>
                    </div>
                    {newProductVideo && (
                      <button
                        type="button"
                        onClick={() => setNewProductVideo('')}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span>রিমুভ ভিডিও</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    onChange={handleProductVideoUpload}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploadingVideo}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      {uploadingVideo ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>ভিডিও আপলোড হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Video className="h-3.5 w-3.5" />
                          <span>🎥 মোবাইল/পিসি থেকে ভিডিও আপলোড</span>
                        </>
                      )}
                    </button>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        placeholder="বা ভিডিও ফাইল লিংক দিন (e.g. /uploads/video.mp4)"
                        value={newProductVideo}
                        onChange={(e) => setNewProductVideo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {newProductVideo && (
                    <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-48 border border-slate-700 shadow-inner">
                      <video
                        src={newProductVideo}
                        controls
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Description (বিবরণ)</label>
                <textarea
                  rows={2}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="কাপড়ের জিএসএম, সাইজ ও ফেব্রিক ডিটেইল..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {submittingProduct ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish & Save to Database</span>
                </>
              )}
            </button>
          </form>

          {/* Product Placement & Order Table (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Product Placement & Order ({products.length})</span>
                </h3>
                <p className="text-xs text-slate-500 font-bengali">
                  উপরে-নিচে নামিয়ে অবস্থান ঠিক করুন, এডিট বাটনে ক্লিক করে পণ্য আপডেট করুন অথবা ডিলিট করুন।
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                LIVE ORDER
              </span>
            </div>

            {/* Admin Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setAdminCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminCategoryFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                সব পণ্য ({products.length})
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setAdminCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      adminCategoryFilter === c.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.name.split('(')[0].trim()} ({count})
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {(adminCategoryFilter === 'all' ? products : products.filter((p) => p.category === adminCategoryFilter)).map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  {/* Left: Position Rank & Image */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                      #{idx + 1}
                    </div>
                    <img
                      src={p.images[0] || '/mockups/hoodie-front.jpg'}
                      alt={p.name}
                      onError={(e) => { e.currentTarget.src = '/mockups/hoodie-front.jpg'; }}
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                        {p.images && p.images.length > 1 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                            {p.images.length} Photos
                          </span>
                        )}
                        {p.video && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                            ▶ Video
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-blue-700 font-bold">{formatBDT(p.price)}</span>
                        <span>•</span>
                        <span>Stock: {p.stock}</span>
                        <span>•</span>
                        <span className="text-slate-600 capitalize">{p.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Move, Edit, Delete) */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Edit Product */}
                    <button
                      onClick={() => startEditingProduct(p)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors shadow-sm flex items-center gap-1 text-xs font-bold"
                      title="Edit Product Details, Colors & Photos"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>এডিট</span>
                    </button>

                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveProduct(p.id, 'up')}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                      title="Move Product Up (উপরে তুলুন)"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={idx === products.length - 1}
                      onClick={() => handleMoveProduct(p.id, 'down')}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-slate-700 transition-colors shadow-sm"
                      title="Move Product Down (নিচে নামান)"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Product */}
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors shadow-sm"
                      title="Delete Product from Database (পণ্য মুছে ফেলুন)"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MERCHANDISE ORDERS (5-STAGE PROGRESSION PIPELINE) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Customer Orders ({orders.length})</h2>
              <p className="text-xs text-slate-500 font-bengali">
                পেন্ডিং ➔ পিকআপ প্রস্তুত ➔ রাইডার হ্যান্ডওভার ➔ ডেলিভারি সম্পন্ন ধাপসমূহ নিয়ন্ত্রণ করুন
              </p>
            </div>
            <button
              onClick={loadDatabaseState}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {/* 5-Stage Order Pipeline Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'pending', label: '১. Pending (পেন্ডিং)', count: orders.filter(o => o.status === 'pending').length, color: 'text-amber-700 bg-amber-50 border-amber-200' },
              { id: 'ready_for_pickup', label: '২. Ready for Pickup (পিকআপ প্রস্তুত)', count: orders.filter(o => o.status === 'ready_for_pickup').length, color: 'text-blue-700 bg-blue-50 border-blue-200' },
              { id: 'rider', label: '৩. Rider (রাইডারের কাছে)', count: orders.filter(o => o.status === 'rider' || o.status === 'shipped_steadfast').length, color: 'text-purple-700 bg-purple-50 border-purple-200' },
              { id: 'delivered', label: '৪. Delivered (ডেলিভার্ড)', count: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              { id: 'cancelled', label: '৫. Cancelled (বাতিলকৃত)', count: orders.filter(o => o.status === 'cancelled').length, color: 'text-rose-700 bg-rose-50 border-rose-200' },
              { id: 'all', label: 'সব অর্ডার (All)', count: orders.length, color: 'text-slate-700 bg-slate-50 border-slate-200' },
            ].map((stage) => {
              const isSelected = orderStageFilter === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setOrderStageFilter(stage.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{stage.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : stage.color
                  }`}>
                    {stage.count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="glass-panel p-16 text-center rounded-3xl border border-slate-200 bg-white text-slate-500 text-sm shadow-sm space-y-2">
              <PackageCheck className="h-10 w-10 text-slate-400 mx-auto" />
              <p>এই পর্যায়ে কোনো অর্ডার নেই।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4"
                >
                  {/* Top Bar: Order ID, Status, Cancellation Notice */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-blue-700">{order.orderNumber}</span>
                      
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        order.status === 'rider' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        order.status === 'shipped_steadfast' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        order.status === 'ready_for_pickup' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        order.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {order.status === 'rider' ? 'Rider / On The Way' : order.status.replace(/_/g, ' ')}
                      </span>

                      {order.status === 'cancelled' && order.cancelledFrom && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-300">
                          বাতিল পর্যায়: {order.cancelledFrom}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">{formatDate(order.createdAt)}</span>
                      <button
                        onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">Customer Details:</h4>
                      <p className="text-slate-900 font-semibold">{order.customerName}</p>
                      <a href={`tel:${order.customerPhone}`} className="text-blue-600 flex items-center gap-1 font-mono font-medium">
                        <Phone className="h-3 w-3" /> {order.customerPhone}
                      </a>
                      <p className="text-slate-600">{order.customerAddress}</p>
                      <div className="text-[11px] text-slate-500">
                        Method: <strong className="text-slate-800 capitalize">{order.deliveryMethod.replace(/_/g, ' ')}</strong> • 
                        Payment: <strong className="text-slate-800 uppercase">{order.paymentMethod.replace(/_/g, ' ')}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">Items Ordered:</h4>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900">{it.name}</div>
                            <div className="text-[10px] text-slate-500">Size: {it.size} • Color: {it.color} • Qty: {it.quantity}</div>
                            {it.customization?.playerName && (
                              <div className="text-[10px] text-blue-700 font-mono font-bold">
                                👕 কাস্টম নাম: {it.customization.playerName} #{it.customization.playerNumber}
                              </div>
                            )}
                            {it.customization?.customText && (
                              <div className="text-[10px] text-emerald-700 font-medium">
                                ✍️ টেক্সট: "{it.customization.customText}"
                              </div>
                            )}
                            {it.customization?.chestLogo && (
                              <div className="text-[10px] text-amber-700 font-medium">
                                🏛️ লোগো: {it.customization.chestLogo}
                              </div>
                            )}
                            {it.customization?.uploadedImage && (
                              <a
                                href={it.customization.uploadedImage}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-indigo-600 underline font-semibold flex items-center gap-1 mt-0.5"
                              >
                                🖼️ কাস্টমার আপলোডকৃত ডিজাইন দেখুন
                              </a>
                            )}
                          </div>
                          <div className="font-mono text-slate-900 font-bold">{formatBDT(it.price * it.quantity)}</div>
                        </div>
                      ))}
                      
                      <div className="pt-2 flex justify-between items-baseline font-bold border-t border-slate-200">
                        <span className="text-slate-600">Total Payable:</span>
                        <span className="text-emerald-700 font-mono text-sm">{formatBDT(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Stage Progression Actions */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* 1. Pending Stage Action: Move to Ready for Pickup */}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'ready_for_pickup')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <PackageCheck className="h-4 w-4" />
                          <span>📦 পণ্য প্রস্তুত ➔ Ready for Pickup-এ পাঠান</span>
                        </button>
                      )}

                      {/* 2. Ready for Pickup Stage Action: Move to Rider */}
                      {order.status === 'ready_for_pickup' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'rider')}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Bike className="h-4 w-4" />
                          <span>🚴‍♂️ রাইডারকে বুঝিয়ে দিন ➔ Handover to Rider</span>
                        </button>
                      )}

                      {/* 3. Rider Stage Action: Move to Delivered */}
                      {(order.status === 'rider' || order.status === 'shipped_steadfast') && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Check className="h-4 w-4" />
                          <span>✅ ডেলিভারি সম্পন্ন ➔ Mark as Delivered</span>
                        </button>
                      )}

                      {/* 4. Delivered Stage Badge */}
                      {order.status === 'delivered' && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span>সফলভাবে ডেলিভারি সম্পন্ন</span>
                        </span>
                      )}

                      {/* 5. Cancel Action Available at Any Step */}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          onClick={() => handleCancelOrder(order.id, order.status)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          <span>অর্ডার বাতিল (Cancel)</span>
                        </button>
                      )}

                      {/* 6. Restore Option for Cancelled Orders */}
                      {order.status === 'cancelled' && (
                        <button
                          onClick={() => {
                            let targetStage: Order['status'] = 'pending';
                            if (order.cancelledFrom?.includes('Ready for Pickup') || order.cancelledFrom?.includes('পিকআপ')) {
                              targetStage = 'ready_for_pickup';
                            } else if (order.cancelledFrom?.includes('Rider') || order.cancelledFrom?.includes('রাইডার')) {
                              targetStage = 'rider';
                            }
                            handleUpdateOrderStatus(order.id, targetStage);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>পূর্বের ধাপে ফিরিয়ে নিন (Restore Order)</span>
                        </button>
                      )}

                      {/* Steadfast Dispatch Option */}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        order.steadfastTrackingCode ? (
                          <div className="text-xs text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                            <Truck className="h-3.5 w-3.5" />
                            <span>Steadfast: <strong className="font-mono text-slate-900">{order.steadfastTrackingCode}</strong></span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedOrderForCourier(order)}
                            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Steadfast কুরিয়ার বুকিং</span>
                          </button>
                        )
                      )}
                    </div>

                    {/* WhatsApp Customer Action */}
                    <a
                      href={`https://wa.me/88${order.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                        `আসসালামু আলাইকুম ${order.customerName}, আপনার RU Insiders অর্ডার #${order.orderNumber} এর স্ট্যাটাস: ${order.status.replace(/_/g, ' ')}। ধন্যবাদ!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-emerald-700 transition-colors"
                      title="WhatsApp Customer"
                    >
                      <Send className="h-4 w-4" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REVENUE & PROFIT */}
      {activeTab === 'analytics' && (
        <RevenueCharts summary={revenueSummary} />
      )}

      {/* TAB 4: STEADFAST COURIER API CONFIG */}
      {activeTab === 'steadfast' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white max-w-2xl mx-auto space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-600" />
              <span>Steadfast Courier API Integration</span>
            </h2>
            <p className="text-xs text-slate-500 font-bengali mt-1">
              সরাসরি স্টেডফাস্ট কুরিয়ারের সাথে কানেক্ট করে এক ক্লিকে পার্সেল বুকিং ও অটো-ট্র্যাকিং চালান।
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
              <p className="font-bold text-blue-900">📌 কীভাবে API Key পাবেন ও কানেক্ট করবেন?</p>
              <p className="text-[11px] font-bengali leading-relaxed text-slate-600">
                1. <a href="https://portal.steadfast.com.bd" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">portal.steadfast.com.bd</a> এ লগইন করুন। <br />
                2. বাম পাশের মেনু থেকে <strong>Settings &gt; API Key</strong> অপশনে যান। <br />
                3. সেখানে প্রাপ্ত <strong>Api Key</strong> এবং <strong>Secret Key</strong> কপি করে নিচের বক্সে বসিয়ে সেভ করুন।
              </p>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Steadfast Merchant API Key</label>
              <input
                type="text"
                placeholder="e.g. your_steadfast_api_key"
                value={steadfastConfig.apiKey}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, apiKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Steadfast Merchant Secret Key</label>
              <input
                type="password"
                placeholder="e.g. your_steadfast_secret_key"
                value={steadfastConfig.secretKey}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, secretKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">API Endpoint URL</label>
                <button
                  type="button"
                  onClick={() => setSteadfastConfig({ ...steadfastConfig, baseUrl: 'https://portal.packzy.com/api/v1' })}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Packzy Default সেট করুন
                </button>
              </div>
              <input
                type="url"
                value={steadfastConfig.baseUrl}
                onChange={(e) => setSteadfastConfig({ ...steadfastConfig, baseUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Test Connection Result Box */}
            {steadfastTestResult && (
              <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                steadfastTestResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {steadfastTestResult.success ? (
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="font-bold">{steadfastTestResult.success ? 'সংযোগ সফল!' : 'কানেকশন টেস্ট ব্যর্থ'}</p>
                  <p className="font-bengali text-[11px] leading-relaxed">{steadfastTestResult.message}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={testingSteadfast}
                onClick={async () => {
                  setTestingSteadfast(true);
                  setSteadfastTestResult(null);
                  const pin = getAdminPin();
                  try {
                    const res = await fetch('/api/admin/steadfast', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-admin-pin': pin,
                      },
                      credentials: 'include',
                      body: JSON.stringify({
                        action: 'test_connection',
                        apiKey: steadfastConfig.apiKey,
                        secretKey: steadfastConfig.secretKey,
                        baseUrl: steadfastConfig.baseUrl,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      setSteadfastTestResult({ success: true, message: data.message, balance: data.balance });
                    } else {
                      setSteadfastTestResult({ success: false, message: data.message || 'কানেকশন ব্যর্থ হয়েছে' });
                    }
                  } catch (err: any) {
                    setSteadfastTestResult({ success: false, message: err.message || 'Network error' });
                  } finally {
                    setTestingSteadfast(false);
                  }
                }}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all border border-slate-300 flex items-center justify-center gap-2"
              >
                {testingSteadfast ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span>কানেকশন টেস্ট করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={async () => {
                  const pin = getAdminPin();
                  try {
                    const res = await fetch('/api/admin/steadfast', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-admin-pin': pin,
                      },
                      credentials: 'include',
                      body: JSON.stringify({ action: 'save_config', config: steadfastConfig }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      showNotification('স্টেডফাস্ট সেটিংস সফলভাবে ডাটাবেজে সেভ হয়েছে!');
                      if (data.config) setSteadfastConfig(data.config);
                    } else {
                      showNotification(data.message || 'সেটিংস সেভ করতে সমস্যা হয়েছে', 'error');
                    }
                  } catch (err: any) {
                    showNotification(err.message || 'Error saving Steadfast settings', 'error');
                  }
                }}
                className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Truck className="h-4 w-4" />
                <span>সেটিংস সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steadfast Dispatch Modal */}
      {selectedOrderForCourier && (
        <SteadfastModal
          order={selectedOrderForCourier}
          config={steadfastConfig}
          isOpen={true}
          onClose={() => setSelectedOrderForCourier(null)}
          onSuccess={handleCourierSuccess}
        />
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                  <span>পণ্য এডিট করুন: {editingProduct.name}</span>
                </h3>
                <p className="text-xs text-slate-500 font-bengali">
                  নাম, দাম, কালার, ছবি ও ভিডিও পরিবর্তন করে ডাটাবেজে সেভ করুন।
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Product Title (ইংরেজি নাম)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Bangla Title (বাংলা নাম)</label>
                <input
                  type="text"
                  value={editingProduct.nameBn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bengali focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Price (বিক্রয় মূল্য ৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-emerald-700 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Original Price (আগের দাম ৳)</label>
                  <input
                    type="number"
                    placeholder="যেমন: 1400"
                    value={editingProduct.regularPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-rose-600 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Stock (স্টক)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Edit Colors */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-slate-700 font-semibold text-xs flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-blue-600" />
                  <span>Available Colors (রং পরিবর্তন করুন)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {editColors.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-1.5"
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => setEditColors(editColors.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = editColors.some((c) => c.name === preset.name);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          if (isSelected) setEditColors(editColors.filter((c) => c.name !== preset.name));
                          else setEditColors([...editColors, preset]);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition-all ${
                          isSelected ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: preset.hex }} />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Edit 4 Photo Slots */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <label className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <span>Product Photos (৪টি ছবি এডিট করুন)</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const currentImg = editImages[slotIdx];
                    const isUploading = editUploadingSlot === slotIdx;
                    const ref = [editSlotInputRef0, editSlotInputRef1, editSlotInputRef2, editSlotInputRef3][slotIdx];

                    return (
                      <div key={slotIdx} className="p-2 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <input
                          type="file"
                          ref={ref}
                          accept="image/*"
                          onChange={(e) => handleEditSlotImageUpload(slotIdx, e)}
                          className="hidden"
                        />
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span>#{slotIdx + 1} {slotIdx === 0 ? 'Main' : ''}</span>
                        </div>

                        <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                          {currentImg ? (
                            <>
                              <img
                                src={currentImg}
                                alt={`Slot ${slotIdx + 1}`}
                                onError={(e) => { e.currentTarget.src = '/mockups/hoodie-front.jpg'; }}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEditImages((prev) => {
                                    const updated = [...prev];
                                    updated[slotIdx] = '';
                                    return updated;
                                  });
                                }}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div
                              onClick={() => ref.current?.click()}
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-600"
                            >
                              <Camera className="h-5 w-5" />
                              <span className="text-[9px] font-bold">+ ছবি দিন</span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          disabled={isUploading}
                          className="w-full py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center gap-1"
                        >
                          {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud className="h-3 w-3" />}
                          <span>{currentImg ? 'পরিবর্তন' : 'আপলোড'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Edit Video */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Product Video</span>
                  </span>
                  {editVideo && (
                    <button
                      type="button"
                      onClick={() => setEditVideo('')}
                      className="text-[10px] text-rose-600 hover:text-rose-800 font-bold"
                    >
                      রিমুভ ভিডিও
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={editVideoInputRef}
                  accept="video/*"
                  onChange={handleEditVideoUpload}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editVideoInputRef.current?.click()}
                    disabled={editUploadingVideo}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    {editUploadingVideo ? <Loader2 className="h-3 w-3 animate-spin" /> : <Video className="h-3 w-3" />}
                    <span>ভিডিও আপলোড</span>
                  </button>
                  <input
                    type="text"
                    placeholder="বা ভিডিও লিংক দিন"
                    value={editVideo}
                    onChange={(e) => setEditVideo(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  বাতিল (Cancel)
                </button>

                <button
                  type="submit"
                  disabled={updatingProduct}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  {updatingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>আপডেট ও সেভ করুন (Save Changes)</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
