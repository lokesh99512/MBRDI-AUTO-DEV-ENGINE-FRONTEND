const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Privacy Statement", href: "#" },
    { label: "Legal Notice", href: "#" },
    { label: "Provider", href: "#" },
    { label: "Help Desk", href: "#" },
  ];

  return (
    <footer className="flex h-10 items-center justify-between bg-footer px-4 text-footer-foreground">
      <span className="text-xs">
        © {currentYear} Mercedes-Benz Group AG. All rights reserved.
      </span>
      <nav className="flex gap-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-xs text-footer-foreground/80 transition-colors hover:text-footer-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
