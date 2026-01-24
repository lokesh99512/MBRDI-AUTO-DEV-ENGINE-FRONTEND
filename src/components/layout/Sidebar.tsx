import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
  { path: '/projects', icon: 'bi-folder', label: 'Projects' },
];

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  const filteredItems = navItems;

  return (
    <aside
      className={`bg-white border-end d-flex flex-column transition-all ${
        collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}
      style={{ 
        width: collapsed ? '56px' : '220px',
        minHeight: '100%',
        transition: 'width 0.2s ease-in-out'
      }}
    >
      {/* Toggle button */}
      <div className="border-bottom p-2">
        <button
          onClick={onToggle}
          className="btn btn-light w-100 d-flex align-items-center justify-content-center"
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      {/* Navigation items */}
      <Nav className="flex-column flex-grow-1 p-2 gap-1">
        {filteredItems.map((item) => (
          <Nav.Item key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center gap-2 rounded px-2 py-2 ${
                location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                  ? 'bg-primary text-white'
                  : 'text-dark hover-bg-light'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </Nav.Item>
        ))}
      </Nav>

      <div className="mt-auto" />
    </aside>
  );
};

export default Sidebar;
