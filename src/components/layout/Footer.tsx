import { Container } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Privacy Statement', href: '#' },
    { label: 'Legal Notice', href: '#' },
    { label: 'Provider', href: '#' },
    { label: 'Help Desk', href: '#' },
  ];

  return (
    <footer className="bg-dark text-white py-2">
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-white-50">
            © {currentYear} Enterprise Corp. All rights reserved.
          </small>
          <nav className="d-flex gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white-50 text-decoration-none small hover-text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
