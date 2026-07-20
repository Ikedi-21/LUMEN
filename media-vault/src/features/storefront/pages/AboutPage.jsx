import LegalPageLayout from "@/shared/ui/LegalPageLayout";

export default function AboutPage() {
  return (
    <LegalPageLayout title="About Lumen">
      <p>
        Lumen is a media discovery platform that brings movies, books, manga, and comics
        into a single browsable catalog. Instead of juggling four different apps to track
        what you&apos;re reading, watching, or collecting, Lumen gives you one place to
        explore every format side by side.
      </p>

      <p>
        The core idea is simple: browse, unlock with coins, and build a personal library
        across every medium. Each title in the catalog comes with a trailer, preview, or
        sample so you can decide before you commit. When you&apos;re ready, spend your
        coins to unlock access and the title moves straight into your library.
      </p>

      <p>
        Coins are a lightweight in-app currency designed to make the discovery-to-library
        flow feel intentional. You top up your balance, spend it on the titles that catch
        your eye, and every unlock keeps your library growing. It&apos;s not a subscription
        service and it&apos;s not a real payment processor — it&apos;s a simulated unlock
        system built to demonstrate a clean storefront experience from browsing to
        checkout.
      </p>

      <p>
        Lumen is independently built as a portfolio project. The catalog is powered by
        public APIs (TMDB, Jikan, Open Library, Comic Vine), and all user data is managed
        through Supabase. It&apos;s a showcase of what a modern media storefront can look
        like when you focus on the reading and watching experience first.
      </p>
    </LegalPageLayout>
  );
}
