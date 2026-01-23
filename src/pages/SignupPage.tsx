import { useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupRequest, clearAuthError } from '@/features/auth/authSlice';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'TENANT_ADMIN' || user.role === 'admin') {
        navigate('/tenant/dashboard');
      } else {
        navigate('/projects');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const validationSchema = Yup.object({
    tenantName: Yup.string().trim().required('Tenant name is required').max(120, 'Too long'),
    name: Yup.string().trim().required('Name is required').max(120, 'Too long'),
    email: Yup.string().trim().email('Invalid email').required('Email is required').max(255, 'Too long'),
    username: Yup.string().trim().required('Username is required').max(60, 'Too long'),
    password: Yup.string().required('Password is required').min(8, 'Min 8 characters').max(255, 'Too long'),
  });

  return (
    <div className="min-vh-100 d-flex">
      {/* Left Side - Branding Section */}
      <div
        className="d-none d-lg-flex flex-column justify-content-center p-5"
        style={{ width: '50%', background: 'var(--auth-hero-gradient)' }}
      >
        <div className="text-white px-4" style={{ maxWidth: '540px', margin: '0 auto' }}>
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3"
              style={{ width: '64px', height: '64px', background: 'var(--auth-button-gradient)' }}
            >
              <i className="bi bi-cpu fs-2 text-white"></i>
            </div>
          </div>

          <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
            MBRDI AUTO DEV ENGINE
          </h1>
          <p className="fs-5 mb-4 opacity-75" style={{ lineHeight: '1.6' }}>
            Create your tenant account to onboard your organization and start managing projects.
          </p>

          <div className="mt-5 pt-4 border-top border-secondary opacity-50">
            <small>© {new Date().getFullYear()} Mercedes-Benz Research & Development India. All rights reserved.</small>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div
        className="d-flex flex-column justify-content-center align-items-center p-4"
        style={{ width: '100%', maxWidth: '100%', background: 'hsl(var(--muted))' }}
      >
        <Container style={{ maxWidth: '520px' }}>
          <div className="d-lg-none text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{ width: '56px', height: '56px', background: 'var(--auth-hero-gradient)' }}
            >
              <i className="bi bi-cpu fs-3 text-white"></i>
            </div>
            <h2 className="h4 fw-bold text-dark mb-0">MBRDI AUTO DEV ENGINE</h2>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div className="text-center mb-4">
              <h3 className="h4 fw-bold text-dark mb-2">Create Tenant Account</h3>
              <p className="text-muted small mb-0">This will register a tenant admin for your organization</p>
            </div>

            {error && (
              <Alert variant="danger" className="py-2 small" dismissible onClose={() => dispatch(clearAuthError())}>
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{ tenantName: '', name: '', email: '', username: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(signupRequest(values));
              }}
            >
              {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <Form.Label className="small fw-medium text-dark">Tenant Name</Form.Label>
                      <Form.Control
                        name="tenantName"
                        value={values.tenantName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.tenantName && errors.tenantName)}
                        placeholder="MBRDI Auto Dev"
                      />
                      <Form.Control.Feedback type="invalid">{errors.tenantName}</Form.Control.Feedback>
                    </div>

                    <div className="col-md-6">
                      <Form.Label className="small fw-medium text-dark">Name</Form.Label>
                      <Form.Control
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.name && errors.name)}
                        placeholder="Lokesh"
                        autoComplete="name"
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </div>

                    <div className="col-md-6">
                      <Form.Label className="small fw-medium text-dark">Email</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.email && errors.email)}
                        placeholder="lokesh@mbrdi.com"
                        autoComplete="email"
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </div>

                    <div className="col-md-6">
                      <Form.Label className="small fw-medium text-dark">Username</Form.Label>
                      <Form.Control
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.username && errors.username)}
                        placeholder="lokesh_admin"
                        autoComplete="username"
                      />
                      <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    </div>

                    <div className="col-md-6">
                      <Form.Label className="small fw-medium text-dark">Password</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.password && errors.password)}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-100 mt-4 py-2 fw-medium"
                    disabled={loading || isSubmitting}
                    style={{ background: 'var(--auth-button-gradient)', border: 'none' }}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-building-add me-2"></i>
                        Create Tenant Account
                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-4 text-center">
              <span className="small text-muted">Already have an account? </span>
              <Link to="/login" className="small text-primary text-decoration-none">
                Sign in
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default SignupPage;
