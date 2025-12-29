import Link from 'next/link';

const SiteFooter = () => {
  return (
    <footer className="glass border-t border-neutral-800 px-4">
      <div className="font-oxanium container mx-auto px-4 py-6">
        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} SetupHub. Made with ❤️ by{' '}
          <Link target="_blank" href="https://devkraken.com" className="text-primary font-semibold">
            DevKraken
          </Link>
          .
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
