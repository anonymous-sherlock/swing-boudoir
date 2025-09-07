import { createLazyFileRoute } from '@tanstack/react-router';
import FAQ from '@/pages/FAQ';

export const Route = createLazyFileRoute('/_public/faq')({
  component: FAQ,
});
