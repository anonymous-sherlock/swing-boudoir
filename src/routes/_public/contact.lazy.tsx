import { createLazyFileRoute } from '@tanstack/react-router';
import Contact from '@/pages/Contact';

export const Route = createLazyFileRoute('/_public/contact')({
  component: Contact,
});
