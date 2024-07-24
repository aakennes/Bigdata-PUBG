import Wrapper from "components/containers/layouts/Wrapper";
import Section from "components/containers/pagesections/Section";

const AboutSection = () => {
  return (
    <Section sectionId="about">
      <Wrapper className="text-center text-white">
        <h1 className="title-1">About</h1>
        <h1 className="title-1">Purpose</h1>
        <p className="mx-auto max-w-lg">
          本网站旨在借用2017至2018年《绝地求生》(PUBG)的大批量比赛数据, 分析出死亡热点区域以及对局排名的影响因素, 以可视化的手段科学的分析游戏数据。
        </p>
        <div className="grid gap-10 py-10 md:grid-cols-2">
          <div className="space-y-2">
            <h2 className="title-2">Data</h2>
            <p className="mx-auto max-w-lg">
            数据集源自<a href="https://www.kaggle.com/datasets/skihikingkevin/pubg-match-deaths/data">Kaggle</a>,该数据集收录了2017至2018年
            超过720,000场《绝地求生》(PUBG)的比赛数据,数据大小为20.28G,共分两大部分aggregate(对局信息)和death(死亡信息),aggregate.csv包含单局游戏内的时间、队伍数量、击倒人数、队伍排名等,death.csv包含单局游戏内的一次死亡信息,即死亡方式、被击杀者信息和击杀者信息(坐标、名称和排名)。
            </p>
          </div>
          <div>
            <h2 className="title-2">D3js</h2>
            <p className="mx-auto max-w-lg">
              本网站的全部可视化页面均由D3.js绘制,是一种用于创建动态、交互式数据可视化的JavaScript库。它通过使用HTML、CSS和SVG等Web标准, 使得数据可以以一种直观和易于理解的方式进行呈现。除了提供丰富的数据绑定机制外, 通过D3.js, 开发者可以创建各种类型的图表, 如折线图、柱状图和饼图, 以直观地呈现数据的分布和趋势。 
            </p>
          </div>
          {/* <div>
            <h2 className="title-2">EXPLORE WORLDS</h2>
            <p className="mx-auto max-w-lg">
              Learn about the underground society of Cavon and the truth to the
              overground. With the layers that you traverse deeper and deeper,
              it will only make you question what made them seek the depths.
            </p>
          </div>
          <div>
            <h2 className="title-2">ENDLESS LEVELS</h2>
            <p className="mx-auto max-w-lg">
              If you haven’t had enough of the game, you find yourself in luck
              as the game features an infinite amount of levels that will never
              be the same. With the amount of challenges constantly changing,
              nothing will be identical.
            </p>
          </div> */}
        </div>
      </Wrapper>
    </Section>
  );
};

export default AboutSection;
