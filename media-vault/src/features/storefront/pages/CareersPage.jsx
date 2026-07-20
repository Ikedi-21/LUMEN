import { Link } from "react-router-dom";
import LegalPageLayout from "@/shared/ui/LegalPageLayout";

export default function CareersPage() {
  return (
    <LegalPageLayout title="Careers">
      <p>
        Lumen is an independently built portfolio project — there are no open positions
        at this time.
      </p>

      <p>
        The entire platform is designed, developed, and maintained as a single-person
        effort to showcase what a modern media storefront experience can look like. There
        is no hiring team, no recruitment pipeline, and no current plans to scale into a
        team-based operation.
      </p>

      <p>
        That said, if you&apos;re interested in the project or want to collaborate on
        something related, feel free to reach out through the{" "}
        <Link to="/contact">Contact</Link> page. No guarantees, but genuine interest
        always gets a response.
      </p>
    </LegalPageLayout>
  );
}
