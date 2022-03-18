import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Icon.css';

export default function Icon({ link, icon }) {
  return (
    <a className="Icon" href={link}>
      <FontAwesomeIcon icon={icon} />
    </a>
  );
}
