/**
 * Landing page composer.
 * Section order mirrors landing-v2/app.jsx exactly.
 */

import { Nav } from '@/components/Nav';
import { HeroV2 } from '@/components/HeroV2';
import { TrustBarV2 } from '@/components/TrustBarV2';
import { Problem } from '@/components/sections/Problem';
import { Solution } from '@/components/sections/Solution';
import { PhoneShowcase } from '@/components/sections/PhoneShowcase';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';
import { Calculator } from '@/components/sections/Calculator';
import { Privacy } from '@/components/sections/Privacy';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <HeroV2 />
        <TrustBarV2 />
        <Problem />
        <Solution />
        <PhoneShowcase />
        <FeaturesGrid />
        <Calculator />
        <Privacy />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
