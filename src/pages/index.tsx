import Page from "components/containers/pagelayouts/Page";
import AboutSection from "components/sections/AboutSection";
import FeatureSection from "components/sections/FeatureSection";
import HeroSection from "components/sections/HeroSection";
import DotSection from "components/sections/DotSection";
import MediaSection from "components/sections/MediaSection";
import ScreenshotSection from "components/sections/ScreenshotSection";
import SignUpSection from "components/sections/SignUpSection";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Page title="Cavon">
      {/* Hero section */}
      <HeroSection />

      {/* About Us section */}
      <AboutSection />

      {/* Screenshot section */}
      <ScreenshotSection />

      {/* Feature section */}
      <FeatureSection />

      {/* Dot Section */}
      <DotSection/>

      {/* Media section */}
      <MediaSection />

      {/* Sign Up section */}
      <SignUpSection />
    </Page>
  );
};

export default Home;
