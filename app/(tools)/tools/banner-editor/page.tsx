import type { Metadata } from 'next';

import { BannerEditorPage } from '@/features/banner-editor';

export const metadata: Metadata = {
  title: 'Banner Editor | SetupHub',
  description:
    'Create custom banners for your projects with our real-time banner editor. Customize colors, fonts, and icons.',
};

export default function Page() {
  return <BannerEditorPage />;
}
