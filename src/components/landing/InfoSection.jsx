import { Card } from '../ui/Card';

const sections = [
  'Getting a project done can be frustrating. You may not know the best option in your area, and reaching out to multiple contractors for quotes takes time. Contractor Connect flips that around. Post your job once, add photos and details, and let contractors reach out to you.',
  'Trust matters. Contractor Connect is built around real profiles, moderation, and authentic reviews. When a contractor reaches out, customers should be able to see what they do, the services they offer, their photos, and feedback from past jobs.',
  'For contractors, Contractor Connect helps fill gaps in the schedule. If work slows down, a client cancels, or there is downtime in the season, contractors can browse active local job posts and connect with real customers looking for help.',
  'The goal is to make it easier for good contractors and real customers to find each other without the spam, randomness, and wasted time common on generic online marketplaces.',
];

export function InfoSection() {
  return (
    <section className="info-grid">
      {sections.map((section, index) => (
        <Card key={section} className="info-card">
          <span className="eyebrow">Why it matters · 0{index + 1}</span>
          <p>{section}</p>
        </Card>
      ))}
    </section>
  );
}
