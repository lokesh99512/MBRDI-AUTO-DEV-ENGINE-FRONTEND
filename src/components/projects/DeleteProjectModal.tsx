import { Modal, Button, Spinner } from 'react-bootstrap';
import { Project } from '@/types';

interface DeleteProjectModalProps {
  show: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteProjectModal = ({ show, project, onClose, onConfirm, loading }: DeleteProjectModalProps) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete <strong>{project?.name}</strong>?</p>
        <p className="text-muted mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner size="sm" className="me-2" />}
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProjectModal;
