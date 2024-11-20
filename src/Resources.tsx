import { Link } from 'react-router-dom';
import './Resources.css';

const Resources = () => {
  return (
    <div className="Resources">
      <header className="App-header">
        <h1>🏳️‍⚧️ All hands on board 🏳️‍⚧️</h1>
      </header>

      <Link to={'/'}>
        <button>Back to search</button>
      </Link>

      <h2>Glossary</h2>

      <ul>
        <li>LGR - Legal Gender Recognition</li>
        <li>MTF - Male To Female</li>
        <li>FTM - Female To Male</li>
        <li>HRT - Hormone Replacement Therapy</li>
        <li>SRS - Sex Reassignment Surgery</li>
        <li>FFS - Face Feminization Surgery</li>
      </ul>

      <h2>Useful links</h2>

      <ul>
        <li>
          <a href="https://www.asherfergusson.com/global-trans-rights-index/?nocache=1">
            203 Best (& Worst) Countries for Trans Rights in 2023
          </a>
        </li>
        <li>
          <a href="https://www.expat.com/en/expat-mag/10092-understanding-global-challenges-and-safe-havens-for-transgender-expats.html">
            Living abroad: Challenges faced by transgender expats
          </a>
        </li>
        <li>
          <a href="https://transrightsmap.tgeu.org/home/">
            Trans Rights Map (Europe and Central Asia, mostly legal information)
          </a>
        </li>
        <li>
          <a href="https://tgeu.org/">
            Trans rights and wellbeing in Europe & Central Asia
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Resources;
