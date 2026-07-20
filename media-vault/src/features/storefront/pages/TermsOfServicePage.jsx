import LegalPageLayout from "@/shared/ui/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <div className="legal-disclaimer">
        This is a draft policy for a demo/portfolio project and does not constitute
        legal advice.
      </div>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Lumen, you agree to be bound by these Terms of Service.
        If you do not agree to these terms, do not use the platform. Lumen is a
        portfolio project provided as-is for demonstration purposes.
      </p>

      <h2>2. Account Responsibilities</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activity that occurs under your account. You agree to
        provide accurate information during registration and to keep it up to date.
        Lumen reserves the right to suspend or terminate accounts that violate these
        terms.
      </p>

      <h2>3. The Coin System</h2>
      <p>
        Coins are a simulated in-app currency with no real-world monetary value. They
        cannot be exchanged for real currency, transferred between users outside of the
        platform, or redeemed for cash. Coin top-ups, purchases, and the payout request
        flow are all simulated for demonstration purposes. No real financial transactions
        occur.
      </p>

      <h2>4. Content Availability</h2>
      <p>
        Lumen provides access to media metadata, trailers, previews, and sample content
        sourced from public APIs. You do not receive full-length movies, complete books,
        full manga chapters, or complete comic issues through Lumen. The platform is a
        catalog and discovery tool, not a streaming or digital distribution service.
        Content availability is subject to the upstream API providers and may change
        without notice.
      </p>

      <h2>5. Purchases and Unlocks</h2>
      <p>
        When you spend coins to unlock a title, the item is added to your personal
        library. Unlock transactions are final — coins spent on an unlock cannot be
        refunded. Unlocking a title grants you ongoing access to the preview content and
        metadata associated with that title within Lumen.
      </p>

      <h2>6. Payout Requests</h2>
      <p>
        Staff and manager accounts may request a payout of earned coins. All payout
        requests are subject to manual review and approval by a manager. This is a
        simulated flow — no real money is transferred. Approved payouts deduct the
        requested coin amount from the user's balance. Rejected payouts leave the
        balance unchanged.
      </p>

      <h2>7. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use Lumen for any unlawful purpose.</li>
        <li>Attempt to exploit, manipulate, or abuse the coin system.</li>
        <li>Scrape, copy, or redistribute content from the platform without authorization.</li>
        <li>Impersonate another user or misrepresent your identity.</li>
        <li>Interfere with the platform's functionality or security.</li>
      </ul>

      <h2>8. Account Suspension and Termination</h2>
      <p>
        Lumen staff and managers may suspend or ban accounts that violate these terms.
        Suspended accounts lose access to all platform features. The status system
        (active, suspended, banned) is managed through the admin interface and decisions
        are at the discretion of the platform administrators.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        Lumen is a portfolio project provided without warranties of any kind. We are not
        liable for any damages arising from the use or inability to use the platform.
        All features are provided on an as-is basis.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        These terms may be updated at any time. Continued use of Lumen after changes
        are posted constitutes acceptance of the revised terms.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms can be directed to the{" "}
        <a href="/contact">Contact</a> page.
      </p>
    </LegalPageLayout>
  );
}
