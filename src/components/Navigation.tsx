import { FunctionComponent } from "react";
import NavItem from "./NavItem";

interface Props {
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  buttonClassName?: string;
  closeMenu?: () => void;
  mobile?: boolean;
}

const Navigation: FunctionComponent<Props> = (props) => {
  const {
    className,
    listClassName,
    closeMenu = () => {},
    itemClassName,
    buttonClassName,
  } = props;
  // console.log(itemClassName);
  return (
    <nav aria-label="main navigation" className={className}>
      <ul className={listClassName}>
        <NavItem
          title="Home"
          path="#home"
          closeMenu={closeMenu}
          className={itemClassName}
        />
        <NavItem
          title="About"
          path="#about"
          closeMenu={closeMenu}
          className={itemClassName}
        />
        <NavItem
          title="Statistics"
          path="#features"
          closeMenu={closeMenu}
          className={itemClassName}
        />
      </ul>
    </nav>
  );
};

export default Navigation;
