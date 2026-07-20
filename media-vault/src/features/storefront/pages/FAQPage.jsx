import { useState } from "react";
import LegalPageLayout from "@/shared/ui/LegalPageLayout";
import "./FAQPage.css";

const FAQ_ITEMS = [
  {
    q: "What is Lumen?",
    a: "Lumen is a media discovery platform that lets you browse movies, books, manga, and comics in one place. You can explore titles across every format, unlock the ones you like, and build a personal library — all from a single interface instead of switching between four different apps.",
  },
  {
    q: "How do coins work?",
    a: "Coins are Lumen's in-app currency. You top up your coin balance from the Top-Up page, then spend coins to unlock individual titles. Each title has a coin price based on its type and rating. Coins are consumed on unlock and cannot be refunded — think of them as a lightweight way to make browsing feel intentional rather than a real payment system.",
  },
  {
    q: "What do I get when I unlock a title?",
    a: "Unlocking a title adds it to your Library, where you can access it anytime. Each title includes a trailer, preview, or sample content sourced from public APIs. You're not getting the full movie stream or complete book — Lumen is a discovery and catalog experience, not a streaming service.",
  },
  {
    q: "Why can't I watch the full movie or read the whole book?",
    a: "Lumen uses public APIs (TMDB, Jikan, Open Library, Comic Vine) that provide metadata, cover art, and preview content — not full-length media. The platform is designed as a catalog and discovery tool, so what you see is trailers, summaries, and sample pages. The unlock flow demonstrates how a real storefront checkout would work.",
  },
  {
    q: "Is my payment information safe?",
    a: "Lumen does not collect or process any real payment data. Coins are a simulated in-app currency — there are no credit card charges, no bank integrations, and no financial transactions. Your account data (email, username, purchase history) is stored securely through Supabase, but no monetary information is ever handled.",
  },
  {
    q: "How do I become a staff member?",
    a: "From your Account Settings page, you'll see an 'Apply for Staff' option if you're currently a customer. Submit a short application explaining why you'd like staff access. A manager will review it and approve or reject your request. Approved applicants are automatically promoted to staff role.",
  },
  {
    q: "How do payouts work?",
    a: "Staff and manager accounts can request a payout from their earnings. Payout requests go through a manual review process — a manager approves or rejects each request. This is a simulated flow for demonstration purposes; no real money is transferred. Payout history is visible in the admin Earnings page.",
  },
];

export default function FAQPage() {
  const [openIndices, setOpenIndices] = useState(new Set());

  function toggle(index) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <LegalPageLayout title="Frequently Asked Questions">
      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`faq-item ${openIndices.has(i) ? "faq-item--open" : ""}`}
          >
            <button
              className="faq-question"
              onClick={() => toggle(i)}
              aria-expanded={openIndices.has(i)}
            >
              <span>{item.q}</span>
              <span className="faq-chevron">
                {openIndices.has(i) ? "\u2212" : "+"}
              </span>
            </button>
            {openIndices.has(i) && (
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </LegalPageLayout>
  );
}
