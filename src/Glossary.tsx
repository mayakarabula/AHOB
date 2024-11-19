import { Link } from 'react-router-dom';
import './Glossary.css';

const Glossary = () => {
  return (
    <div className="glossary">
      <h1>🏳️‍⚧️ Glossary 🏳️‍⚧️</h1>

      <Link to={'/'}>
        <button>Back to search</button>
      </Link>

      <ul>
        <li>LGR - Legal Gender Recognition</li>
        <li>MTF - Male To Female</li>
        <li>FTM - Female To Male</li>
        <li>HRT - Hormone Replacement Therapy</li>
        <li>SRS - Sex Reassignment Surgery</li>
        <li>FFS - Face Feminization Surgery</li>
      </ul>
    </div>
  );
};

export default Glossary;
