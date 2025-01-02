import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  ClipboardList, 
  Building2, 
  Package,
  Image
} from "lucide-react";

const routes = [
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
    <div className="w-64 h-screen bg-gray-50 border-r p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <route.icon className="w-5 h-5" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 