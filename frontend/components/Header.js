import Link from 'next/link';
import Nav from './Nav';

const Header = () => (
  <div>
    <div className="bar">
      <Link href="/">
        <a>Sick Fits</a>
      </Link>
      <Nav />
    </div>
    <div className="sub-bar">
      <p>Search</p>
    </div>
    <div className="">Cart</div>
  </div>
);

export default Header;
