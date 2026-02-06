import { useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginRequest, clearAuthError } from '@/features/auth/authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Redirect based on role after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      // All users land on dashboard
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const validationSchema = Yup.object({
    username: Yup.string().trim().required('Username or email is required').max(255, 'Too long'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(255, 'Too long'),
    rememberMe: Yup.boolean().default(false),
  });

  return (
    <div className="min-vh-100 d-flex">
      {/* Left Side - Branding Section */}
      <div 
        className="d-none d-lg-flex flex-column justify-content-center p-5"
        style={{
          width: '50%',
          background: 'var(--auth-hero-gradient)',
        }}
      >
        <div className="text-white px-4" style={{ maxWidth: '540px', margin: '0 auto' }}>
          {/* Logo / Brand Icon */}
          <div className="mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-3"
              style={{ 
                width: '64px', 
                height: '64px', 
                background: 'var(--auth-button-gradient)',
              }}
            >
              <i className="bi bi-cpu fs-2 text-white"></i>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
            MBRDI AUTO DEV ENGINE
          </h1>
          
          {/* Subtext */}
          <p className="fs-5 mb-4 opacity-75" style={{ lineHeight: '1.6' }}>
            AI-powered platform to automate development, manage projects, and accelerate innovation.
          </p>

          {/* Feature List */}
          <div className="mt-5">
            <div className="d-flex align-items-start mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'rgba(0, 212, 255, 0.2)' 
                }}
              >
                <i className="bi bi-shield-check text-info small"></i>
              </div>
              <div>
                <div className="fw-semibold">Secure Multi-Tenant Architecture</div>
                <small className="opacity-50">Enterprise-grade security with isolated tenant data</small>
              </div>
            </div>

            <div className="d-flex align-items-start mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'rgba(0, 212, 255, 0.2)' 
                }}
              >
                <i className="bi bi-people text-info small"></i>
              </div>
              <div>
                <div className="fw-semibold">Role-Based Access Control</div>
                <small className="opacity-50">Granular permissions for admins and users</small>
              </div>
            </div>

            <div className="d-flex align-items-start">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'rgba(0, 212, 255, 0.2)' 
                }}
              >
                <i className="bi bi-gear-wide-connected text-info small"></i>
              </div>
              <div>
                <div className="fw-semibold">Project & Automation Management</div>
                <small className="opacity-50">Streamlined workflows with AI-powered tools</small>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-top border-secondary opacity-50">
            <small>© {new Date().getFullYear()} Mercedes-Benz Research & Development India. All rights reserved.</small>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div 
        className="d-flex flex-column justify-content-center align-items-center p-4"
        style={{ 
          width: '100%',
          maxWidth: '100%',
          background: 'hsl(var(--muted))',
        }}
      >
        <Container style={{ maxWidth: '420px' }}>
          {/* Mobile Logo */}
          <div className="d-lg-none text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{ 
                width: '56px', 
                height: '56px', 
                background: 'var(--auth-hero-gradient)',
              }}
            >
              <i className="bi bi-cpu fs-3 text-white"></i>
            </div>
            <h2 className="h4 fw-bold text-dark mb-0">MBRDI AUTO DEV ENGINE</h2>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div className="text-center mb-4">
              <h3 className="h4 fw-bold text-dark mb-2">Sign in to your account</h3>
              <p className="text-muted small mb-0">Enter your credentials to continue</p>
            </div>

            {error && (
              <Alert variant="danger" className="py-2 small" dismissible onClose={() => dispatch(clearAuthError())}>
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{ username: '', password: '', rememberMe: false }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                dispatch(loginRequest(values));
                // Formik keeps isSubmitting=true unless we reset it.
                setSubmitting(false);
              }}
            >
              {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-medium text-dark">Username or Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <Form.Control
                        name="username"
                        type="text"
                        placeholder="Enter username or email"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.username && errors.username)}
                        className="border-start-0 ps-0"
                        style={{ boxShadow: 'none' }}
                        autoComplete="username"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-medium text-dark">Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.password && errors.password)}
                        className="border-start-0 ps-0"
                        style={{ boxShadow: 'none' }}
                        autoComplete="current-password"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      label={<span className="small">Remember me</span>}
                      checked={values.rememberMe}
                      onChange={handleChange}
                    />
                    <button type="button" className="btn btn-link small text-primary text-decoration-none p-0" disabled>
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-medium"
                    disabled={loading || isSubmitting}
                    style={{ background: 'var(--auth-button-gradient)', border: 'none' }}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Info Text */}
            <div className="mt-4 text-center">
              <p className="small text-muted mb-3">
                <i className="bi bi-info-circle me-1"></i>
                This login works for both tenant admins and users
              </p>
              <Link to="/signup" className="small text-primary text-decoration-none">
                <i className="bi bi-building me-1"></i>
                Create Tenant Account
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default LoginPage;
