import { ChevronRight, ClipboardList, Search, LayoutGrid, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = true, onToggle }: SidebarProps) => {
  const navItems = [
    { icon: ClipboardList, label: "Tasks", active: false },
    { icon: Search, label: "Search", active: false },
    { icon: LayoutGrid, label: "Dashboard", active: false },
  ];

  return (
    <aside className="flex h-full w-14 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="flex h-12 items-center justify-center border-b border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <ChevronRight className={cn("h-5 w-5 transition-transform", !collapsed && "rotate-180")} />
      </button>

      {/* Navigation items */}
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded text-sidebar-foreground transition-colors",
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "hover:bg-sidebar-accent"
            )}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </nav>

      {/* Bottom star button */}
      <div className="mt-auto">
        <button className="flex h-14 w-full items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
          <Star className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
