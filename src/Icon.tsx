import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Icon.css';

type IconProps = {
  link: string;
  icon: IconDefinition;
};

export default function Icon({ link, icon }: IconProps) {
  return (
    <a className="Icon" href={link}>
      <FontAwesomeIcon icon={icon} />
    </a>
  );
}
