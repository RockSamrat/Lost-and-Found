import Link from "next/link";
import Card from "@/components/ui/Card";
import { MapPin, PenLine, Users } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section
        style={{
          minHeight: "calc(100vh - 68px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div className="animate-fade-in-up" style={{ textAlign: "center", maxWidth: "640px" }}>
          {/* Pulsing pin */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
            <div style={{ position: "relative", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                className="animate-pulse-dot"
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--accent-soft)" }}
              />
              <MapPin size={28} color="var(--accent)" style={{ position: "relative", zIndex: 1 }} />
            </div>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            Lost Something?{" "}
            <span style={{ color: "var(--accent)" }}>Found Something?</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              marginBottom: "36px",
              maxWidth: "480px",
              margin: "0 auto 36px",
            }}
          >
            Pin it on the map. Help your community reconnect with their lost
            belongings — one pin at a time.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/feed" className="neu-button neu-button--outlined neu-button--lg">
              Browse Lost Items
            </Link>
            <Link href="/report" className="neu-button neu-button--accent neu-button--lg">
              Report an Item
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section style={{ padding: "72px 24px", maxWidth: "1080px", margin: "0 auto", width: "100%" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800,
            marginBottom: "8px",
            color: "var(--text-primary)",
          }}
        >
          How It Works
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "44px", fontSize: "0.938rem" }}>
          Three simple steps to report or find an item
        </p>

        <div
          className="stagger-children"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}
        >
          {[
            {
              step: "01",
              Icon: MapPin,
              title: "Pick a Location",
              desc: "Drop a pin on the map where you lost or found the item.",
            },
            {
              step: "02",
              Icon: PenLine,
              title: "Describe the Item",
              desc: "Add details — what it looks like, when you lost or found it, and any helpful info.",
            },
            {
              step: "03",
              Icon: Users,
              title: "Reconnect",
              desc: "Browse the map for matches. Help your neighbours get their stuff back!",
            },
          ].map((item) => (
            <Card key={item.step} className="animate-fade-in-up">
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "0.08em", display: "block", marginBottom: "14px" }}>
                STEP {item.step}
              </span>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-md)",
                  background: "var(--accent-soft)",
                  marginBottom: "16px",
                }}
              >
                <item.Icon size={22} color="var(--accent)" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1.063rem", marginBottom: "8px", color: "var(--text-primary)" }}>
                {item.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: "48px 24px 80px", textAlign: "center" }}>
        <div className="neu-card" style={{ maxWidth: "600px", margin: "0 auto", padding: "44px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "10px", color: "var(--text-primary)" }}>
            Ready to Help Your Community?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.938rem" }}>
            Sign up for free and start reporting lost or found items in your area.
          </p>
          <Link href="/signup" className="neu-button neu-button--accent neu-button--lg">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer
        style={{
          padding: "20px 24px",
          textAlign: "center",
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--text-tertiary)",
          fontSize: "0.813rem",
        }}
      >
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Lost&amp;Found — Built for the community.</p>
      </footer>
    </>
  );
}
