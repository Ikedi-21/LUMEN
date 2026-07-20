import LegalPageLayout from "@/shared/ui/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <div className="legal-disclaimer">
        This is a draft policy for a demo/portfolio project and does not constitute
        legal advice.
      </div>

      <h2>1. Introduction</h2>
      <p>
        Lumen is a media discovery platform built as a portfolio project. This privacy
        policy explains what data we collect, how we use it, and what rights you have as
        a user. By using Lumen, you agree to the practices described here.
      </p>

      <h2>2. Data We Collect</h2>
      <p>We collect the following information when you create an account or use the platform:</p>
      <ul>
        <li><strong>Account information:</strong> email address, username, and optional profile avatar.</li>
        <li><strong>Usage data:</strong> titles you browse, items added to your library, wishlist, and cart.</li>
        <li><strong>Transaction history:</strong> coin top-ups, purchases, and payout requests (all simulated — no real currency is involved).</li>
        <li><strong>Reviews and ratings:</strong> any reviews or ratings you submit on titles.</li>
        <li><strong>Coin balance:</strong> your current in-app coin balance.</li>
      </ul>

      <h2>3. How We Store Your Data</h2>
      <p>
        All user data is stored through Supabase, a hosted PostgreSQL platform with
        built-in authentication and row-level security. Supabase handles encryption at
        rest and in transit. Lumen does not operate its own backend servers — all data
        persistence is managed by Supabase's infrastructure.
      </p>

      <h2>4. Payments and Financial Data</h2>
      <p>
        Lumen does not collect, process, or store any real payment or financial data.
        The coin system is a simulated in-app currency with no cash value. No credit
        card numbers, bank accounts, or payment credentials are ever transmitted to or
        stored by Lumen or Supabase.
      </p>

      <h2>5. Cookies and Local Storage</h2>
      <p>
        Lumen uses Supabase authentication sessions, which rely on cookies to maintain
        your login state. No third-party tracking cookies, advertising cookies, or
        analytics cookies are used. Session cookies are essential for keeping you
        signed in and are not used for tracking purposes.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>Lumen integrates with the following public APIs to populate the media catalog:</p>
      <ul>
        <li>TMDB (The Movie Database) — movie metadata and trailers</li>
        <li>Jikan (MyAnimeList API) — manga metadata</li>
        <li>Open Library — book metadata</li>
        <li>Comic Vine — comic book metadata</li>
      </ul>
      <p>
        These services provide public catalog data only. No personal information is
        shared with them.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access your data:</strong> request a copy of all data associated with your account.</li>
        <li><strong>Delete your account:</strong> request permanent deletion of your account and all associated data.</li>
        <li><strong>Correct your data:</strong> update your username, avatar, or other profile information at any time from Account Settings.</li>
      </ul>

      <h2>8. Data Retention</h2>
      <p>
        Your data is retained as long as your account exists. If you delete your account,
        all associated data — including library, purchase history, reviews, and coin
        balance — is permanently removed from Supabase.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        This policy may be updated as Lumen evolves. Changes will be reflected on this
        page with an updated date. Continued use of the platform after changes
        constitutes acceptance of the revised policy.
      </p>

      <h2>10. Contact</h2>
      <p>
        If you have questions about this privacy policy or your data, visit the{" "}
        <a href="/contact">Contact</a> page to reach us.
      </p>
    </LegalPageLayout>
  );
}
