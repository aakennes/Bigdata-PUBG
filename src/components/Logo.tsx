import Image from "next/image";
import Link from "next/link";
import logoImage from "../../public/images/logo.png";

const Logo = () => {
  return (
    <Link href="/">
      <a
        aria-label="Go to home page"
        className={"flex h-full items-center gap-2 text-inherit"}
      >
        <Image src={logoImage} alt="Cavon logo" width={100} height={100} />
        <p className="text-2xl font-bold uppercase text-inherit">PUBG-STATISTICS</p>
      </a>
    </Link>
  );
};

export default Logo;
