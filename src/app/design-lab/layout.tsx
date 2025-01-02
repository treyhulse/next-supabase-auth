import { DesignNavigation } from "./_components/design-navigation"

export default function DesignLabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <DesignNavigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
} 