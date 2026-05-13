import Link from "next/link";
import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <>
      {/* ═══ Hero Section ═══ */}
      <section
        style={{
          minHeight: "calc(100vh - 68px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating decorative elements */}
        <div
          className="animate-float"
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            fontSize: "3rem",
            opacity: 0.15,
          }}
          aria-hidden="true"
        >
          📍
        </div>
        <div
          className="animate-float"
          style={{
            position: "absolute",
            bottom: "20%",
            left: "8%",
            fontSize: "2.5rem",
            opacity: 0.12,
            animationDelay: "1s",
          }}
          aria-hidden="true"
        >
          🔑
        </div>
        <div
          className="animate-float"
          style={{
            position: "absolute",
            top: "30%",
            left: "15%",
            fontSize: "2rem",
            opacity: 0.1,
            animationDelay: "2s",
          }}
          aria-hidden="true"
        >
          👛
        </div>
        <div
          className="animate-float"
          style={{
            position: "absolute",
            bottom: "30%",
            right: "15%",
            fontSize: "2.5rem",
            opacity: 0.1,
            animationDelay: "1.5s",
          }}
          aria-hidden="true"
        >
          📱
        </div>

        <div
          className="animate-fade-in-up"
          style={{
            textAlign: "center",
            maxWidth: "680px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Pulsing dot */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "64px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="animate-pulse-dot"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                }}
              />
              <span style={{ fontSize: "1.75rem", position: "relative", zIndex: 1 }}>
                📍
              </span>
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
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "36px",
              maxWidth: "520px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Pin it on the map. Help your community reconnect with their lost
            belongings — one pin at a time.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/map" className="neu-button neu-button--outlined neu-button--lg">
              🔍 I Lost Something
            </Link>
            <Link href="/map" className="neu-button neu-button--accent neu-button--lg">
              ✋ I Found Something
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: "1080px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800,
            marginBottom: "12px",
            color: "var(--text-primary)",
          }}
        >
          How It Works
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: "48px",
            fontSize: "1rem",
          }}
        >
          Three simple steps to report or find an item
        </p>

        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "28px",
          }}
        >
          {[
            {
              step: "01",
              icon: "📍",
              title: "Pick a Location",
              desc: "Drop a pin on the map where you lost or found the item. Be as precise as possible.",
            },
            {
              step: "02",
              icon: "📝",
              title: "Describe the Item",
              desc: "Add details — what it looks like, when you lost or found it, and any helpful info.",
            },
            {
              step: "03",
              icon: "🤝",
              title: "Reconnect",
              desc: "Browse the map for matches. Help your neighbors get their stuff back!",
            },
          ].map((item) => (
            <Card key={item.step} className="animate-fade-in-up">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "var(--accent)",
                    letterSpacing: "0.08em",
                  }}
                >
                  STEP {item.step}
                </span>
              </div>
              <div
                className="neu-pressed"
                style={{
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-md)",
                  fontSize: "1.5rem",
                  marginBottom: "16px",
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  marginBottom: "8px",
                  color: "var(--text-primary)",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ═══ CTA Section ═══ */}
      <section
        style={{
          padding: "60px 24px 80px",
          textAlign: "center",
        }}
      >
        <div
          className="neu-card"
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: "12px",
              color: "var(--text-primary)",
            }}
          >
            Ready to Help Your Community?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "28px",
              fontSize: "0.938rem",
            }}
          >
            Sign up for free and start reporting lost or found items in your
            area.
          </p>
          <Link href="/signup" className="neu-button neu-button--accent neu-button--lg">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer
        style={{
          padding: "24px",
          textAlign: "center",
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--text-tertiary)",
          fontSize: "0.813rem",
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} Lost&Found. Built with ❤️ for the community.
        </p>
      </footer>
    </>
  );
}
