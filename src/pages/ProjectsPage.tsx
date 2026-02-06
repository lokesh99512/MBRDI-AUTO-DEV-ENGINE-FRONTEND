import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import MainLayout from '@/components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjectsRequest } from '@/features/projects/projectSlice';
import { ProjectStatus } from '@/types';

const statusOptions: { label: string; value: '' | ProjectStatus }[] = [
  { label: 'Any status', value: '' },
  { label: 'ACTIVE', value: 'ACTIVE' },
  { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
  { label: 'COMPLETED', value: 'COMPLETED' },
  { label: 'ARCHIVED', value: 'ARCHIVED' },
];

const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((s) => s.projects);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'' | ProjectStatus>('');

  const filters = useMemo(
    () => ({
      page: 1,
      pageSize: 24,
      search: search.trim() || undefined,
      status: status || undefined,
    }),
    [search, status]
  );

  useEffect(() => {
    dispatch(fetchProjectsRequest(filters));
  }, [dispatch, filters]);

  return (
    <MainLayout>
      <Container fluid className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="mb-1">Projects</h4>
            <p className="text-muted mb-0">Manage and track all tenant projects</p>
          </div>
          <Link to="/projects/new">
            <Button variant="primary">
              <i className="bi bi-plus-lg me-2"></i>
              New project
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-3 border p-3 mb-4">
          <Row className="g-2 align-items-center">
            <Col lg={6}>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-search"></i>
                </span>
                <Form.Control
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                {statusOptions.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} md={6} lg={3} className="text-lg-end">
              <Button variant="outline-secondary" onClick={() => { setSearch(''); setStatus(''); }}>
                Reset filters
              </Button>
            </Col>
          </Row>
        </div>

        {loading && (
          <div className="d-flex align-items-center gap-2 text-muted mb-3">
            <Spinner size="sm" />
            Loading projects...
          </div>
        )}

        <Row className="g-3">
          {/* Create tile */}
          <Col sm={6} lg={4} xl={3}>
            <Link to="/projects/new" className="text-decoration-none">
              <Card className="h-100 border-2" style={{ borderStyle: 'dashed' }}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <div className="rounded-circle border d-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                    <i className="bi bi-plus fs-3"></i>
                  </div>
                  <div className="fw-semibold text-dark">Create new project</div>
                  <div className="small text-muted">Start a new automation workflow</div>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          {projects.map((p) => (
            <Col key={String(p.id)} sm={6} lg={4} xl={3}>
              <Card className="h-100 shadow-sm">
                <div className="bg-light" style={{ height: 110 }} />
                <Card.Body>
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div>
                      <div className="fw-semibold text-dark text-truncate" title={p.name}>{p.name}</div>
                      <div className="small text-muted text-truncate" title={p.description}>{p.description}</div>
                    </div>
                    <span className="badge bg-secondary">{p.status}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </MainLayout>
  );
};

export default ProjectsPage;