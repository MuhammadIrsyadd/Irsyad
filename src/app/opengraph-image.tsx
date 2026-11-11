import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const alt = `${profile.name} — ${profile.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b0d13 0%, #19142a 52%, #0d222c 100%)",
          color: "#f4f4f8",
          padding: "54px 64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top macOS-inspired Liquid Glass Menu Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 26px",
            borderRadius: "18px",
            background: "rgba(255, 255, 255, 0.07)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ff5f56", display: "flex" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ffbd2e", display: "flex" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#27c93f", display: "flex" }} />
            <span style={{ marginLeft: 12, fontSize: 20, fontWeight: 700, color: "#ffd9a8" }}>
              Portfolio OS — Liquid Glass Edition
            </span>
          </div>
          <span style={{ fontSize: 18, color: "rgba(255, 255, 255, 0.65)" }}>muhirsyad.my.id</span>
        </div>

        {/* Main Hero Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            padding: "44px 48px",
            borderRadius: "28px",
            background: "rgba(17, 19, 25, 0.78)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#34d399",
                display: "flex",
              }}
            />
            <span style={{ fontSize: 18, fontWeight: 600, color: "#34d399", letterSpacing: "0.02em" }}>
              {profile.availability} · {profile.location}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "#ffffff",
            }}
          >
            {profile.name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              color: "#ffc174",
            }}
          >
            {profile.role}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 20,
              lineHeight: 1.45,
              color: "rgba(255, 255, 255, 0.75)",
              maxWidth: "960px",
            }}
          >
            {profile.tagline}
          </div>
        </div>

        {/* Bottom Dock Pill Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {["Next.js & React", "Laravel ERP", "Kotlin & Compose", "GPA 3.93 / 4.00"].map((badge) => (
              <div
                key={badge}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  background: "rgba(245, 158, 11, 0.14)",
                  border: "1px solid rgba(255, 193, 116, 0.35)",
                  color: "#ffd9a8",
                  fontSize: 17,
                  fontWeight: 600,
                }}
              >
                {badge}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 17,
              color: "rgba(255, 255, 255, 0.55)",
            }}
          >
            Interactive macOS Desktop Experience
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
