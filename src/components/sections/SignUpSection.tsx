import Wrapper from "components/containers/layouts/Wrapper";
import ImageSection from "components/containers/pagesections/ImageSection";
import { default as heroImage } from "../../../public/images/background1.jpg";
const SignUpSection = () => {
  return (
    <ImageSection
      image={heroImage}
      className="bg-black bg-opacity-70"
      height="h-[500px]"
      sectionId="sign-up"
    >
      <div className="absolute top-[50%] w-full translate-y-[-50%]">
        <Wrapper className="h-full space-y-20 text-center text-white">
          <div className="space-y-5">
            <h1 className="title-page mx-auto max-w-4xl">
              Look for More Information
            </h1>
            <p className="mx-auto max-w-md">
              欢迎fork我们的<a href="https://github.com/aakennes/Bigdata-PUBG" className="text-orange">仓库</a><br/>
              您可以通过仓库里的的联系方式联系我们<br/>
              期待您对我们网站的建设
            </p>
          </div>
        </Wrapper>
      </div>
    </ImageSection>
  );
};

export default SignUpSection;
