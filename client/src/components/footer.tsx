import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 py-4 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center">
        <span className="relative z-10 bg-background px-2 text-muted-foreground text-sm">
          Made with love by Rahul{' '}
          <Heart className="inline size-4 fill-rose-500 text-rose-500" />
        </span>
      </div>
    </footer>
  );
}
