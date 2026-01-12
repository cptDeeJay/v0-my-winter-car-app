"use client"

import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"
import { Input } from "@/components/ui/input"

export function FloatingCalculator() {
  const [calculatorInput, setCalculatorInput] = useState("")
  const [calculatorResult, setCalculatorResult] = useState<string>("")
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (!calculatorInput.trim()) {
      setCalculatorResult("")
      return
    }

    try {
      // Sanitize input to only allow numbers, operators, parentheses, decimal points, and spaces
      const sanitized = calculatorInput.replace(/[^0-9+\-*/().\s]/g, "")

      if (!sanitized) {
        setCalculatorResult("")
        return
      }

      // Use Function constructor as a safer alternative to eval for math expressions
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)()

      if (typeof result === "number" && !Number.isNaN(result)) {
        setCalculatorResult(result.toString())
      } else {
        setCalculatorResult("Error")
      }
    } catch {
      setCalculatorResult("Error")
    }
  }, [calculatorInput])

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="Open Calculator"
        >
          <Calculator className="w-5 h-5" />
        </button>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-2xl p-4 min-w-[320px] animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Calculator</span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-muted-foreground hover:text-foreground text-xl leading-none px-2"
              aria-label="Minimize"
            >
              −
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="e.g., 3*7 or (100-25)*2"
              value={calculatorInput}
              onChange={(e) => setCalculatorInput(e.target.value)}
              className="flex-1 text-sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">=</span>
              <div className="min-w-[80px] px-3 py-1.5 bg-background border rounded text-sm font-medium text-right">
                {calculatorResult || "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
