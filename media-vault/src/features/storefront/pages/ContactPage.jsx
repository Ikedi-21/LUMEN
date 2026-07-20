import { useState } from "react";
import LegalPageLayout from "@/shared/ui/LegalPageLayout";
import { useToast } from "@/shared/ui";
import "./ContactPage.css";

export default function ContactPage() {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast("Please fill in all fields.", "error");
      return;
    }

    setSending(true);
    setTimeout(() => {
      console.log("Contact form submission:", { name, email, message });
      addToast("Message sent! We&apos;ll get back to you soon.", "success");
      setName("");
      setEmail("");
      setMessage("");
      setSending(false);
    }, 600);
  }

  return (
    <LegalPageLayout title="Contact Us">
      <p>
        Have a question, suggestion, or just want to say hello? Fill out the form below
        and we&apos;ll get back to you as soon as possible.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
            rows={5}
          />
        </div>

        <button type="submit" className="contact-submit" disabled={sending}>
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </LegalPageLayout>
  );
}
