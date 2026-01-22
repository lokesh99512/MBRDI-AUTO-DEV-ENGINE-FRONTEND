import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginRequest, clearAuthError } from '@/features/auth/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [validated, setValidated] = useState(false);

  // Redirect based on role after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'TENANT_ADMIN' || user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/projects');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    dispatch(loginRequest(formData));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-vh-100 d-flex">
      {/* Left Side - Branding Section */}
      <div 
        className="d-none d-lg-flex flex-column justify-content-center p-5"
        style={{
          width: '50%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
                background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
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
          background: '#f8f9fa',
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
                background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
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

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-medium text-dark">Username or Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter username or email"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    className="border-start-0 ps-0"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  Please enter your username or email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-medium text-dark">Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    minLength={6}
                    className="border-start-0 ps-0"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  Password must be at least 6 characters.
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label={<span className="small">Remember me</span>}
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                />
                <a href="#" className="small text-primary text-decoration-none">
                  Forgot password?
                </a>
              </div>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2 fw-medium"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                  border: 'none',
                }}
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

            {/* Info Text */}
            <div className="mt-4 text-center">
              <p className="small text-muted mb-3">
                <i className="bi bi-info-circle me-1"></i>
                This login works for both tenant admins and users
              </p>
              <a href="#" className="small text-primary text-decoration-none">
                <i className="bi bi-building me-1"></i>
                Create Tenant Account
              </a>
            </div>
          </div>

          {/* Demo Credentials */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-light rounded-3 border">
              <div className="small text-muted text-center">
                <i className="bi bi-lightbulb me-1"></i>
                <strong>Demo Credentials:</strong>
                <br />
                Username: <code>lokesh_admin</code> | Password: <code>Admin@123</code>
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default LoginPage;
