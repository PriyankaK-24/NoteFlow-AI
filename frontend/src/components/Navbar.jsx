import { FileText, LayoutDashboard, History as HistoryIcon } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <FileText size={20} />
        </div>

        <span>NoteFlow AI</span>
      </div>

      <div className="nav-links">
        <a href="/" className="active">
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <a href="/history">
          <HistoryIcon size={18} />
          History
        </a>
      </div>
    </nav>
  );
}

export default Navbar;