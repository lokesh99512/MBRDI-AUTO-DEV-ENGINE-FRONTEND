import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutRequest } from '@/features/auth/authSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-2 border-bottom border-secondary">
      <Container fluid className="px-4">
        {/* Left section */}
        <div className="d-flex align-items-center gap-3">
          <Navbar.Brand href="/tenant/dashboard" className="fw-bold fs-5 mb-0">
            MBRDI AUTO DEV ENGINE
          </Navbar.Brand>
          <Badge bg="danger" className="text-uppercase small">
            Confidential
          </Badge>
          <Badge bg="light" text="dark" className="border small">
            DEV
          </Badge>
        </div>

        {/* Center - Logo */}
        <div className="position-absolute start-50 translate-middle-x d-none d-md-block">
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              d="M50 10 L50 90 M50 10 L20 85 M50 10 L80 85"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Right section */}
        {isAuthenticated && user && (
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <span className="text-white small">{user.name || user.username}</span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
              title="Logout"
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
