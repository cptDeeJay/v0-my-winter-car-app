import { PartsTracker } from "@/components/parts-tracker"
import { FloatingCalculator } from "@/components/floating-calculator"

export default function VinReaderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <PartsTracker activeTab="vin" />
      <FloatingCalculator />
    </main>
  )
}
