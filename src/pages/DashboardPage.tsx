import { Container, Card, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import MainLayout from '@/components/layout/MainLayout';

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <MainLayout>
      <div className="py-5" style={{ background: 'linear-gradient(180deg, rgba(13,110,253,0.14) 0%, rgba(13,110,253,0) 60%)' }}>
        <Container fluid className="px-4">
          <div className="text-center mb-4">
            <h1 className="display-6 fw-bold mb-2">Ready to build, {user?.name || user?.firstName || 'MBRDI'}?</h1>
            <p className="text-muted mb-0">Start from your projects dashboard.</p>
          </div>

          <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-0">
              <div className="border-bottom bg-white px-4 pt-3">
                <Nav variant="tabs" defaultActiveKey="recent" className="border-0">
                  <Nav.Item>
                    <Nav.Link eventKey="recent" className="border-0">Recently viewed</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="my" className="border-0" disabled>My projects</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="templates" className="border-0" disabled>Templates</Nav.Link>
                  </Nav.Item>
                  <div className="ms-auto pb-2">
                    <Link to="/projects" className="btn btn-link text-decoration-none">
                      Browse all <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </Nav>
              </div>

              <div className="p-4 bg-light">
                <Link to="/projects" className="text-decoration-none">
                  <Card className="border-0 shadow-sm rounded-4">
                    <div className="bg-white" style={{ height: 220 }} />
                    <Card.Body className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                        style={{ width: 44, height: 44 }}
                        aria-hidden="true"
                      >
                        <span className="fw-bold">M</span>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">MBRDI AUTO DEV ENGINE</div>
                        <div className="small text-muted">Open Projects</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
