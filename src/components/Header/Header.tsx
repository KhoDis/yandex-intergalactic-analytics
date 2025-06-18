import { Link } from "react-router-dom";

function Header() {
  return (
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/history">История</Link>
      <Link to="/generate">Генератор</Link>
    </nav>
  );
}

export default Header;
