import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    // { path: "/v1", label: "V1" },
    // { path: "/meet", label: "Join Meet" },
    { path: "/meetjoiner", label: "Room joiner" },
  ];

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <ul className="flex gap-6 text-white text-sm">
        {navLinks.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className={`hover:text-yellow-400 ${
                location.pathname === path ? "text-yellow-300 font-semibold" : ""
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
