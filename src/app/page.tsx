import fs from "node:fs";
import path from "node:path";
import HomeClient from "@/components/HomeClient";
import { WallpaperProvider } from "@/components/WallpaperProvider";
import { PhotosProvider } from "@/components/PhotosProvider";
import { buildWallpapers } from "@/lib/wallpapers";
import { buildPhotos } from "@/lib/photos";
import {
  awards,
  caseStudies,
  educationHistory,
  journey,
  organizations,
  profile,
  projects,
  skills,
  socials,
} from "@/lib/content";

function listDir(...segments: string[]) {
  const dir = path.join(process.cwd(), "public", ...segments);
  return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
}

export default function Page() {
  const wallpapers = buildWallpapers(listDir("images", "wallpapers"));
  const photos = buildPhotos(listDir("images", "photos"));

  return (
    <WallpaperProvider wallpapers={wallpapers}>
      <PhotosProvider photos={photos}>
        {/* Semantic SSR content for search engine crawlers, ATS & screen readers */}
        <article className="sr-only">
          <h1>{profile.name} — {profile.role}</h1>
          <p>{profile.tagline}</p>
          <p>{profile.summary}</p>
          <p>Location: {profile.location} | Availability: {profile.availability}</p>

          <section>
            <h2>Education & Honors</h2>
            {educationHistory.map((edu) => (
              <div key={edu.institution}>
                <h3>{edu.degree} — {edu.institution} ({edu.period})</h3>
                <p>GPA: {edu.gpa} / {edu.maxGpa} (Thesis: {edu.thesis})</p>
                <p>{edu.description}</p>
              </div>
            ))}
            <ul>
              {awards.map((a) => (
                <li key={a.title}>
                  <strong>{a.title}</strong> — {a.issuer} ({a.period}): {a.description}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Work & Industry Experience</h2>
            {journey.map((j) => (
              <div key={j.title + j.period}>
                <h3>{j.title} at {j.company} ({j.period})</h3>
                <p>{j.description}</p>
                <ul>
                  {j.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h2>Technical Skills</h2>
            <ul>
              {skills.map((s) => (
                <li key={s.category}>
                  <strong>{s.category}:</strong> {s.items.join(", ")}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Featured Projects & Deployments</h2>
            <ul>
              {projects.map((p) => (
                <li key={p.id}>
                  <h3>{p.name} ({p.category})</h3>
                  <p>{p.tagline} — {p.description}</p>
                  <p>Technologies: {p.tech.join(", ")}</p>
                  {p.url && <a href={p.url}>{p.name} Live Demo</a>}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Engineering Case Studies</h2>
            {caseStudies.map((c) => (
              <div key={c.id}>
                <h3>{c.title}</h3>
                <p>Problem: {c.problem}</p>
                <p>Approach: {c.approach}</p>
                <p>Result: {c.result}</p>
              </div>
            ))}
          </section>

          <section>
            <h2>Leadership & Organizations</h2>
            <ul>
              {organizations.map((o) => (
                <li key={o.role + o.period}>
                  <strong>{o.role}</strong> — {o.organization} ({o.period})
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Contact & Social Profiles</h2>
            <p>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
            <ul>
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url}>{s.label} ({s.handle})</a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <HomeClient />
      </PhotosProvider>
    </WallpaperProvider>
  );
}
