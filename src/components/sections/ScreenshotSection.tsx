import Wrapper from "components/containers/layouts/Wrapper";
import Section from "components/containers/pagesections/Section";
import ImageCarousel from "components/ImageCarousel";
import Screenshot from "components/Screenshot";
import { SwiperSlide } from "swiper/react";
import image2 from "../../../public/images/gameplay/rollingpicture2.png";
import image3 from "../../../public/images/gameplay/rollingpicture3.png";
import image1 from "../../../public/images/gameplay/rollingpicture1.png";
import image4 from "../../../public/images/gameplay/rollingpicture4.png";
import image5 from "../../../public/images/gameplay/rollingpicture5.png";

const ScreenshotSection = () => {
  return (
    <Section
      sectionId="screenshots"
      className="bg-surface py-10 text-on-surface"
      padding={false}
    >
      <div className="title-about-1-container">
        <h1 className="title-about-1">绘图总览</h1>
      </div>
      <Wrapper>
        
        <ImageCarousel>
          <SwiperSlide>
            <Screenshot image={image1} />
          </SwiperSlide>
          <SwiperSlide>
            <Screenshot image={image2} />
          </SwiperSlide>
          <SwiperSlide>
            <Screenshot image={image3} />
          </SwiperSlide>
          <SwiperSlide>
            <Screenshot image={image4} />
          </SwiperSlide>
          <SwiperSlide>
            <Screenshot image={image5} />
          </SwiperSlide>
        </ImageCarousel>
      </Wrapper>
    </Section>
  );
};

export default ScreenshotSection;
