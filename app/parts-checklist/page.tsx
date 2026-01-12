import { PartsTracker } from "@/components/parts-tracker"
import { FloatingCalculator } from "@/components/floating-calculator"

export default function PartsChecklistPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <PartsTracker activeTab="parts" />
      <FloatingCalculator />
    </main>
  )
}
