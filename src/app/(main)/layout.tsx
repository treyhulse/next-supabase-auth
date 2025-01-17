import Footer from "@/components/footer/main-footer";
import Navbar from "@/components/navbar/main-navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />

      <main className="container p-4 sm:p-6 flex-1">{children}</main>

      <Footer />
    </>
  );
}
