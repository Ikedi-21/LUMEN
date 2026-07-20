import { useState } from "react";
import LegalPageLayout from "@/shared/ui/LegalPageLayout";
import "./CookiePreferencesPage.css";

export default function CookiePreferencesPage() {
  const [essential] = useState(true);
  const [functional, setFunctional] = useState(false);

  return (
    <LegalPageLayout title="Cookie Preferences">
      <p>
        Lumen uses a minimal set of cookies and browser storage to keep the platform
        functional. We do not use advertising cookies, third-party tracking pixels, or
        any analytics that profile your browsing behavior across sites.
      </p>

      <h2>What We Use</h2>
      <ul>
        <li>
          <strong>Supabase Auth Session:</strong> An essential cookie that keeps you
          signed in. Without it, you would need to re-authenticate on every page load.
          This cookie is strictly necessary for the platform to function.
        </li>
        <li>
          <strong>Local Storage:</strong> Used by Supabase to persist authentication
          tokens across browser sessions. This is standard behavior for any
          Supabase-backed application.
        </li>
      </ul>

      <h2>What We Don&apos;t Use</h2>
      <ul>
        <li>No Google Analytics, Mixpanel, or any third-party analytics.</li>
        <li>No Facebook Pixel, ad retargeting, or marketing cookies.</li>
        <li>No cross-site tracking or fingerprinting.</li>
      </ul>

      <h2>Your Preferences</h2>

      <div className="cookie-toggles">
        <div className="cookie-toggle-row">
          <div className="cookie-toggle-info">
            <span className="cookie-toggle-label">Essential Cookies</span>
            <span className="cookie-toggle-desc">
              Required for authentication and core platform functionality. These cannot
              be disabled.
            </span>
          </div>
          <label className="cookie-switch cookie-switch--disabled">
            <input type="checkbox" checked={essential} disabled />
            <span className="cookie-switch-slider" />
          </label>
        </div>

        <div className="cookie-toggle-row">
          <div className="cookie-toggle-info">
            <span className="cookie-toggle-label">Functional Preferences</span>
            <span className="cookie-toggle-desc">
              Would enable optional features like UI preferences. Currently not
              implemented — this toggle exists for transparency.
            </span>
          </div>
          <label className="cookie-switch">
            <input
              type="checkbox"
              checked={functional}
              onChange={(e) => setFunctional(e.target.checked)}
            />
            <span className="cookie-switch-slider" />
          </label>
        </div>
      </div>

      <h2>Managing Cookies in Your Browser</h2>
      <p>
        You can control or delete cookies through your browser settings at any time.
        Disabling the Supabase auth session cookie will log you out of Lumen and prevent
        you from staying signed in.
      </p>
    </LegalPageLayout>
  );
}
