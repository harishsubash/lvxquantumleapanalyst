import Link from "next/link";
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          <path
            fill="#fff"
            d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16zm-8-18h16v4H16zm-4 8h24v4H12zm8-16h8v4h-8z"
          />
        </svg>
        <h1>LVXQuantumLeapAI</h1>
      </div>
      <nav className="nav">
        <Link href="/">Home</Link>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </nav>
    </header>
  );
}
