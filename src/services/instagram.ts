/**
 * Instagram Content Planner & Rumah Quran Ahsan Automation Service
 * Part 7 Implementation: Daily Instagram content scheduler, Quranic quotes generator & Meta API connector.
 */

export interface InstagramPostPayload {
  id?: string;
  title: string;
  category: 'Rumah Quran Ahsan' | 'Executive AI-247' | 'Motivation' | 'Tajweed & Tahfizh';
  type: 'reel' | 'carousel' | 'single' | 'story';
  caption: string;
  hashtags: string[];
  scheduledTime?: string;
  mediaUrl?: string;
  status?: 'queued' | 'published' | 'draft';
}

export interface IslamicQuoteTheme {
  theme: string;
  verseOrHadith: string;
  translation: string;
  reflection: string;
  suggestedHashtags: string[];
}

const RUMAH_QURAN_PRESETS: IslamicQuoteTheme[] = [
  {
    theme: "Tahfizh Motivation",
    verseOrHadith: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِنْ مُدَّكِرٍ",
    translation: "Dan sungguh, telah Kami mudahkan Al-Qur'an untuk peringatan (dan dihafalkan), maka adakah orang yang mau mengambil pelajaran?",
    reflection: "Konsistensi menghafal 1 ayat setiap hari lebih dicintai Allah daripada banyak tetapi tidak teratur. Jaga muraja'ahmu hari ini sahabat Rumah Quran Ahsan.",
    suggestedHashtags: ["RumahQuranAhsan", "TahfizhQuran", "MotivasiQuran", "PenghafalQuran", "MurajaahDaily"]
  },
  {
    theme: "Adab & Akhlaq",
    verseOrHadith: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation: "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya. (HR. Bukhari)",
    reflection: "Setiap jam pelajaran Al-Qur'an di Rumah Quran Ahsan melahirkan keberkahan yang mengalir bagi kedua orang tua dan umat.",
    suggestedHashtags: ["RumahQuranAhsan", "HaditsShahih", "AdabPenuntutIlmu", "GenerasiRabbani"]
  },
  {
    theme: "Tips Tajweed & Makhraj",
    verseOrHadith: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    translation: "Dan bacalah Al-Qur'an itu dengan perlahan-lahan (tartil). (QS. Al-Muzzammil: 4)",
    reflection: "Tartil berarti memperbagus lafaz huruf (tajwid) serta mengetahui tempat wakaf. Mari perbaiki bacaan Al-Fatihah kita bersama asatidzah Rumah Quran Ahsan.",
    suggestedHashtags: ["RumahQuranAhsan", "BelajarTajwid", "TartilAlQuran", "MakhrajHuruf"]
  }
];

class InstagramPlannerService {
  private queue: InstagramPostPayload[] = [
    {
      id: 'ig-101',
      title: 'Kunci Konsistensi Muraja\'ah 1 Juz Per Hari',
      category: 'Rumah Quran Ahsan',
      type: 'carousel',
      caption: 'Setiap penghafal Al-Qur\'an pasti pernah mengalami rasa berat saat muraja\'ah. Kuncinya adalah menyisipkan muraja\'ah di setiap sebelum dan sesudah shalat fardhu. Simak 4 slide tips praktis berikut dari Rumah Quran Ahsan! ✨',
      hashtags: ['#RumahQuranAhsan', '#TahfizhDaily', '#TipsMurajaah', '#QuranReminders'],
      scheduledTime: '2026-07-23T06:00:00Z',
      mediaUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
      status: 'queued'
    },
    {
      id: 'ig-102',
      title: 'Doa Memohon Kemudahan Menghafal Al-Qur\'an',
      category: 'Tajweed & Tahfizh',
      type: 'single',
      caption: 'Allahumma inni as-aluka \'ilman nafi\'an wa rizqan thayyiban wa \'amalan mutaqabbalan. Amalkan doa ini setiap seusai shalat Shubuh dan sebelum memulakan sabaq hafalan baru. 🤲',
      hashtags: ['#RumahQuranAhsan', '#DoaHarian', '#PenghafalQuran', '#KajianIslam'],
      scheduledTime: '2026-07-23T18:00:00Z',
      mediaUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80',
      status: 'queued'
    },
    {
      id: 'ig-103',
      title: 'Pendaftaran Santri Baru Rumah Quran Ahsan Angkatan 2026',
      category: 'Rumah Quran Ahsan',
      type: 'reel',
      caption: 'Mari bergabung bersama keluarga besar Rumah Quran Ahsan. Program Tahfizh Intensif, Tajweed Bersanad, dan Kelas Akhlaq Rabbani. Kuota terbatas!',
      hashtags: ['#RumahQuranAhsan', '#PendaftaranSantri', '#RumahTahfizh', '#BelajarQuran'],
      scheduledTime: '2026-07-24T12:00:00Z',
      mediaUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
      status: 'draft'
    }
  ];

  public getQueue(): InstagramPostPayload[] {
    return this.queue;
  }

  public generateIslamicQuote(themeIndex?: number): IslamicQuoteTheme {
    if (themeIndex !== undefined && RUMAH_QURAN_PRESETS[themeIndex]) {
      return RUMAH_QURAN_PRESETS[themeIndex];
    }
    const idx = Math.floor(Math.random() * RUMAH_QURAN_PRESETS.length);
    return RUMAH_QURAN_PRESETS[idx];
  }

  public createPost(payload: InstagramPostPayload): InstagramPostPayload {
    const newPost: InstagramPostPayload = {
      ...payload,
      id: `ig-${Date.now()}`,
      status: payload.status || 'queued',
      mediaUrl: payload.mediaUrl || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'
    };
    this.queue.unshift(newPost);
    return newPost;
  }

  public publishNow(id: string) {
    const post = this.queue.find((p) => p.id === id);
    if (post) {
      post.status = 'published';
    }
    return post;
  }

  public deletePost(id: string) {
    this.queue = this.queue.filter((p) => p.id !== id);
    return true;
  }
}

export const instagramService = new InstagramPlannerService();

export async function createInstagramPost(payload: InstagramPostPayload) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    const created = instagramService.createPost(payload);
    return {
      success: true,
      mode: "standby",
      message: "Post queued in Rumah Quran Ahsan Content Planner (Standby mode). Fill INSTAGRAM_ACCESS_TOKEN in .env to sync live to Meta API.",
      post: created
    };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption: `${payload.caption}\n\n${payload.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`,
        access_token: accessToken,
        media_type: payload.type.toUpperCase()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Meta Graph API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const created = instagramService.createPost({ ...payload, status: 'published' });
    return {
      success: true,
      mode: "active",
      data,
      post: created
    };
  } catch (error: any) {
    console.error("[Instagram Service Error]:", error);
    return {
      success: false,
      mode: "error",
      error: error.message || "Failed to publish to Meta Graph API"
    };
  }
}
