import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Nav, Dropdown } from 'react-bootstrap';
import { MoreHorizontal, Plus } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjectsRequest, createProjectRequest, updateProjectRequest, deleteProjectRequest } from '@/features/projects/projectSlice';
import { Project, ProjectStatus } from '@/types';
import ProjectUpsertModal, { ProjectFormValues } from '@/components/projects/ProjectUpsertModal';
import DeleteProjectModal from '@/components/projects/DeleteProjectModal';

type ModalMode = 'create' | 'edit' | 'rename';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { projects, loading } = useAppSelector((s) => s.projects);

  const [activeTab, setActiveTab] = useState('recent');

  // Modal states
  const [showUpsertModal, setShowUpsertModal] = useState(false);
  const [upsertMode, setUpsertMode] = useState<ModalMode>('create');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjectsRequest({ page: 1, pageSize: 24 }));
  }, [dispatch]);

  // Handlers
  const openCreateModal = () => {
    setSelectedProject(null);
    setUpsertMode('create');
    setShowUpsertModal(true);
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setUpsertMode('edit');
    setShowUpsertModal(true);
  };

  const openRenameModal = (project: Project) => {
    setSelectedProject(project);
    setUpsertMode('rename');
    setShowUpsertModal(true);
  };

  const openDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleUpsertSubmit = (values: ProjectFormValues) => {
    if (upsertMode === 'create') {
      dispatch(createProjectRequest({ name: values.name, description: values.description, status: values.status }));
    } else {
      const data: Partial<Project> = upsertMode === 'rename' ? { name: values.name } : { name: values.name, description: values.description, status: values.status };
      dispatch(updateProjectRequest({ id: String(selectedProject!.id), data }));
    }
    setShowUpsertModal(false);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      dispatch(deleteProjectRequest(String(projectToDelete.id)));
    }
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleStatusChange = (project: Project, status: ProjectStatus) => {
    dispatch(updateProjectRequest({ id: String(project.id), data: { status } }));
  };

  const getStatusBadgeClass = (status: ProjectStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'IN_PROGRESS': return 'bg-warning text-dark';
      case 'COMPLETED': return 'bg-info';
      case 'ARCHIVED': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  return (
    <MainLayout>
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #e8f4f8 0%, #f0e6f6 100%)' }}>
        <Container fluid className="py-5">
          <div className="text-center mb-5">
            <h2 className="fw-semibold text-dark">
              Ready to build, <span className="text-primary">{user?.name || user?.firstName || 'MBRDI'}</span>?
            </h2>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom-0 pt-3 pb-0">
              <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'recent')}>
                <Nav.Item>
                  <Nav.Link eventKey="recent" className="px-4">Recently viewed</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="my" className="px-4">My projects</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="templates" className="px-4">Templates</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body className="p-4">
              <div className="row g-3">
                {/* Create Tile */}
                <div className="col-sm-6 col-lg-4 col-xl-3">
                  <Card
                    className="h-100 border-2 text-center d-flex align-items-center justify-content-center"
                    style={{ borderStyle: 'dashed', minHeight: 180, cursor: 'pointer' }}
                    onClick={openCreateModal}
                  >
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                      <div
                        className="rounded-circle border d-flex align-items-center justify-content-center mb-3"
                        style={{ width: 48, height: 48 }}
                      >
                        <Plus size={24} />
                      </div>
                      <div className="fw-semibold">Create new project</div>
                      <div className="small text-muted">Start a new automation workflow</div>
                    </Card.Body>
                  </Card>
                </div>

                {/* Project Cards */}
                {projects.map((p) => (
                  <div key={String(p.id)} className="col-sm-6 col-lg-4 col-xl-3">
                    <Card 
                      className="h-100 shadow-sm" 
                      style={{ minHeight: 180, cursor: 'pointer' }}
                      onClick={() => navigate(`/projects/${p.id}/executions`)}
                    >
                      <div className="bg-light" style={{ height: 90 }} />
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div className="overflow-hidden">
                            <div className="fw-semibold text-dark text-truncate" title={p.name}>{p.name}</div>
                            <div className="small text-muted text-truncate" title={p.description}>{p.description}</div>
                          </div>
                          <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                            <Dropdown.Toggle as="button" className="btn btn-sm btn-light border-0 p-1" id={`dropdown-${p.id}`}>
                              <MoreHorizontal size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => openEditModal(p)}>Edit</Dropdown.Item>
                              <Dropdown.Item onClick={() => openRenameModal(p)}>Rename</Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Header>Change Status</Dropdown.Header>
                              {(['ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'] as ProjectStatus[]).map((s) => (
                                <Dropdown.Item key={s} active={p.status === s} onClick={() => handleStatusChange(p, s)}>
                                  {s}
                                </Dropdown.Item>
                              ))}
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger" onClick={() => openDeleteModal(p)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        <span className={`badge mt-auto align-self-start ${getStatusBadgeClass(p.status)}`}>{p.status}</span>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Modals */}
      <ProjectUpsertModal
        show={showUpsertModal}
        mode={upsertMode}
        project={selectedProject}
        onClose={() => setShowUpsertModal(false)}
        onSubmit={handleUpsertSubmit}
        loading={loading}
      />
      <DeleteProjectModal
        show={showDeleteModal}
        project={projectToDelete}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </MainLayout>
  );
};

export default DashboardPage;
