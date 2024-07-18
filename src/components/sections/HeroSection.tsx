import ImageSection from "components/containers/pagesections/ImageSection";
import { default as heroImage } from "../../../public/images/background1.jpg";

const HeroSection = () => {
  return (
    <ImageSection
      image={heroImage}
      className="bg-black bg-opacity-50"
      height="h-screen"
      sectionId="top"
    >
      <div className="absolute left-[50%] bottom-[40%] m-auto translate-x-[-50%] space-y-6 text-center text-white sm:bottom-10">
        <p className="text-3xl font-bold">EXPLORE NOW</p>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
        <a
          href="https://store.steampowered.com/app/578080/PUBG_BATTLEGROUNDS/"
          className="btn-primary text-xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          HAVE A LOOK ON STEAM
        </a>
        <a
          href="https://pubgmap.io/"
          className="btn-primary text-xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          TO ANOTHER STATISTICS MAP
        </a>
      </div>
      </div>
    </ImageSection>
  );
};
// 
export default HeroSection;
