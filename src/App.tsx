import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Icon from './Icon';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <h1 className="title">SANS</h1>
      <div className="icons">
        <Icon link="https://github.com/choshinyoung" icon={faGithub} />
        <Icon link="mailto:choshinyoung1227@gmail.com" icon={faEnvelope} />
        <Icon link="https://discord.com/users/396163884005851137" icon={faDiscord} />
      </div>
    </div>
  );
}
