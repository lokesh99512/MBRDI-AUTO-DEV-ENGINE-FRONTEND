import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { User } from '@/types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  icon: string;
  label: string;
  roles?: User['role'][];
}

const navItems: NavItem[] = [
  { path: '/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
  { path: '/projects/new', icon: 'bi-plus-square', label: 'New Project' },
  { path: '/projects', icon: 'bi-folder', label: 'Projects' },
  { path: '/users', icon: 'bi-people', label: 'Users', roles: ['TENANT_ADMIN', 'admin', 'manager'] },
  { path: '/settings', icon: 'bi-gear', label: 'Settings' },
];

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

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

      {/* Bottom section */}
      <div className="mt-auto border-top">
        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-3 rounded-0"
          title="Favorites"
        >
          <i className="bi bi-star-fill"></i>
          {!collapsed && <span className="ms-2">Favorites</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
