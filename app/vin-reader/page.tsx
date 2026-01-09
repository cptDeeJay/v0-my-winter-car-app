import { PartsTracker } from "@/components/parts-tracker"

export default function VinReaderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <PartsTracker activeTab="vin" />
    </main>
  )
}
