import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Icon from './components/Icon';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <h1 className="title">CHOSHINYOUNG</h1>
      <div className="icons">
        <Icon link="https://github.com/choshinyoung" icon={faGithub} />
        <Icon link="mailto:choshinyoung1227@gmail.com" icon={faEnvelope} />
      </div>
    </div>
  );
}
