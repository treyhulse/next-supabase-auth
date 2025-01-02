import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <div className="hidden md:flex w-72 flex-col fixed inset-y-16">
          <Sidebar />
        </div>
        
        <main className="flex-1 md:pl-72">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 