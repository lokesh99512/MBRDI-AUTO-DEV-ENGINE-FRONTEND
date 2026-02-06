import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Project, ProjectStatus } from '@/types';

type ModalMode = 'create' | 'edit' | 'rename';

interface ProjectUpsertModalProps {
  show: boolean;
  mode: ModalMode;
  project?: Project | null;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void;
  loading?: boolean;
}

export interface ProjectFormValues {
  name: string;
  description: string;
  status: ProjectStatus;
  baseBranch: string;
  gitRepoUrl: string;
}

const statusOptions: ProjectStatus[] = ['ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

const validationSchema = Yup.object({
  name: Yup.string().required('Project name is required').min(2, 'Name must be at least 2 characters'),
  description: Yup.string().when('$mode', {
    is: (mode: ModalMode) => mode !== 'rename',
    then: (schema) => schema.required('Description is required'),
    otherwise: (schema) => schema,
  }),
  gitRepoUrl: Yup.string()
    .trim()
    .max(2048, 'Too long')
    .test(
      'repo-url',
      'Repository URL must be a valid URL (https://..., ssh://..., or git@...)',
      (value) => {
        if (!value) return true;
        return /^https?:\/\/.+/i.test(value) || /^ssh:\/\/.+/i.test(value) || /^git@.+/i.test(value);
      }
    ),
  baseBranch: Yup.string()
    .trim()
    .when('$mode', {
      is: (mode: ModalMode) => mode === 'edit',
      then: (schema) => schema.required('Base branch is required').max(100, 'Too long'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const ProjectUpsertModal = ({ show, mode, project, onClose, onSubmit, loading }: ProjectUpsertModalProps) => {
  const initialValues: ProjectFormValues = {
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'ACTIVE',
    baseBranch: project?.baseBranch || 'main',
    gitRepoUrl: project?.gitRepoUrl || '',
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Project';
      case 'edit': return 'Edit Project';
      case 'rename': return 'Rename Project';
      default: return 'Project';
    }
  };

  const handleSubmit = (values: ProjectFormValues, helpers: FormikHelpers<ProjectFormValues>) => {
    onSubmit(values);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{getTitle()}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        context={{ mode }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && !!errors.name}
                  placeholder="Enter project name"
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>

              {mode !== 'rename' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.description && !!errors.description}
                      placeholder="Enter project description"
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>

                  {mode === 'edit' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Git Repository URL</Form.Label>
                        <Form.Control
                          name="gitRepoUrl"
                          value={values.gitRepoUrl}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.gitRepoUrl && !!errors.gitRepoUrl}
                          placeholder="https://github.com/org/repo.git"
                        />
                        <Form.Control.Feedback type="invalid">{errors.gitRepoUrl}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Base Branch</Form.Label>
                        <Form.Control
                          name="baseBranch"
                          value={values.baseBranch}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.baseBranch && !!errors.baseBranch}
                          placeholder="main"
                        />
                        <Form.Control.Feedback type="invalid">{errors.baseBranch}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={values.status} onChange={handleChange} onBlur={handleBlur}>
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </>
                  )}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading && <Spinner size="sm" className="me-2" />}
                {mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ProjectUpsertModal;
