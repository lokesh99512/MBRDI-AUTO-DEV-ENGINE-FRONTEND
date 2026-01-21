import { Languages } from "lucide-react";

const Header = () => {
  return (
    <header className="flex h-14 items-center justify-between bg-header px-4 text-header-foreground">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight">WiPPS</span>
        <span className="rounded bg-error-foreground px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          Confidential
        </span>
        <span className="rounded border border-header-foreground/30 px-2 py-0.5 text-xs font-medium">
          DEV
        </span>
      </div>

      {/* Center - Logo */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-header-foreground"
        >
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" fill="none" />
          <path
            d="M50 10 L50 90 M50 10 L20 85 M50 10 L80 85"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Felix Baumgartner</span>
        <Languages className="h-5 w-5" />
      </div>
    </header>
  );
};

export default Header;
