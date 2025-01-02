import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  ClipboardList, 
  Building2, 
  Package,
  Image,
  LayoutDashboard
} from "lucide-react";

const routes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Products",
    icon: ShoppingBag,
    href: "/dashboard/products",
  },
  {
    label: "Orders",
    icon: ClipboardList,
    href: "/dashboard/orders",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/dashboard/inventory",
  },
  {
    label: "Tenants",
    icon: Building2,
    href: "/dashboard/tenants",
  },
  {
    label: "Users",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    label: "Media",
    icon: Image,
    href: "/dashboard/media",
  },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-background border-r border-border p-4">
      <div className="space-y-4">
        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="flex items-center gap-3 px-4 py-2 text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              <route.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 