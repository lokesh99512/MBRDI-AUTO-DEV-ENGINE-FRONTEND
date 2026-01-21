import { ReactNode } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Header */}
      <header className="bg-dark py-3">
        <Container>
          <div className="d-flex align-items-center justify-content-center">
            <span className="text-white fw-bold fs-4">WiPPS</span>
          </div>
        </Container>
      </header>

      {/* Main content */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} xl={4}>
              {children}
            </Col>
          </Row>
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-dark py-2">
        <Container>
          <div className="text-center">
            <small className="text-white-50">
              © {new Date().getFullYear()} Enterprise Corp. All rights reserved.
            </small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default AuthLayout;
