import { Link } from "react-router-dom";

const Header = () => (
  <header className="bg-white border-b p-4 flex justify-between items-center">
    <h1 className="text-lg font-bold">One Health Society</h1>
    <nav className="space-x-4">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/articles">Articles</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  </header>
);

export default Header;
