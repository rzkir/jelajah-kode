import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Jelajah Kode - Temukan Template yang Sesuai',
        short_name: 'Jelajah Kode',
        description:
            'Mulai langkah awal pengembangan dengan kode sumber siap pakai, template, dan komponen dari pengembang terbaik. Jelajahi 1000+ kode sumber premium di platform Jelajah Kode untuk proyek Anda.',
        start_url: '/',
        display: 'standalone',
        theme_color: '#f5f5f5',
        background_color: '#ffffff',
        prefer_related_applications: false,
        categories: [
            'portfolio',
            'web development',
            'full stack',
            'freelancer',
            'developer',
            'programming',
            'software development',
        ],
        screenshots: [
            {
                src: '/desktop.png',
                sizes: '1280x720',
                type: 'image/png',
            },
        ],
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}