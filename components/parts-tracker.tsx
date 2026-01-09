"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Wrench,
  RotateCcw,
  Package,
  Phone,
  Plus,
  Trash2,
  MapPin,
  Home,
  Fuel,
  Minus,
  Car,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import confetti from "canvas-confetti"
import Link from "next/link"
import { DEFAULT_MAP_MARKERS, type MapMarker } from "@/config/map-locations"

interface Part {
  id: string
  name: string
  category: string
}

interface PartStatus {
  acquired: boolean
  quantity: number
}

interface PhoneOrder {
  id: string
  partName: string
  phoneNumber: string
  price: number
  delivered: boolean
}

const RIVETTA_PARTS: Part[] = [
  // Engine Parts
  { id: "engine-block", name: "Engine Block", category: "Engine" },
  { id: "crankshaft", name: "Crankshaft", category: "Engine" },
  { id: "pistons", name: "Pistons (x4)", category: "Engine" },
  { id: "connecting-rods", name: "Connecting Rods (x4)", category: "Engine" },
  { id: "camshaft", name: "Camshaft", category: "Engine" },
  { id: "cylinder-head", name: "Cylinder Head", category: "Engine" },
  { id: "head-gasket", name: "Head Gasket", category: "Engine" },
  { id: "timing-chain", name: "Timing Chain", category: "Engine" },
  { id: "oil-pan", name: "Oil Pan", category: "Engine" },
  { id: "oil-filter", name: "Oil Filter", category: "Engine" },
  { id: "spark-plugs", name: "Spark Plugs (x4)", category: "Engine" },
  { id: "distributor", name: "Distributor", category: "Engine" },
  { id: "ignition-coil", name: "Ignition Coil", category: "Engine" },
  { id: "air-filter", name: "Air Filter", category: "Engine" },
  { id: "carburetor", name: "Carburetor", category: "Engine" },
  { id: "fuel-pump", name: "Fuel Pump", category: "Engine" },
  { id: "alternator", name: "Alternator", category: "Engine" },
  { id: "starter-motor", name: "Starter Motor", category: "Engine" },
  { id: "water-pump", name: "Water Pump", category: "Engine" },
  { id: "radiator", name: "Radiator", category: "Engine" },
  { id: "gearbox", name: "Gearbox", category: "Drivetrain" },
  { id: "clutch-plate", name: "Clutch Plate", category: "Drivetrain" },
  { id: "clutch-pressure-plate", name: "Clutch Pressure Plate", category: "Drivetrain" },
  { id: "flywheel", name: "Flywheel", category: "Drivetrain" },
  { id: "drive-shaft", name: "Drive Shaft", category: "Drivetrain" },
  { id: "differential", name: "Differential", category: "Drivetrain" },
  { id: "halfshafts", name: "Halfshafts (x2)", category: "Drivetrain" },
  { id: "front-struts", name: "Front Struts (x2)", category: "Suspension" },
  { id: "rear-shocks", name: "Rear Shock Absorbers (x2)", category: "Suspension" },
  { id: "front-springs", name: "Front Springs (x2)", category: "Suspension" },
  { id: "rear-springs", name: "Rear Springs (x2)", category: "Suspension" },
  { id: "steering-rack", name: "Steering Rack", category: "Suspension" },
  { id: "steering-column", name: "Steering Column", category: "Suspension" },
  { id: "control-arms", name: "Control Arms (x2)", category: "Suspension" },
  { id: "brake-master-cylinder", name: "Brake Master Cylinder", category: "Brakes" },
  { id: "front-brake-discs", name: "Front Brake Discs (x2)", category: "Brakes" },
  { id: "front-brake-pads", name: "Front Brake Pads (x2)", category: "Brakes" },
  { id: "rear-brake-drums", name: "Rear Brake Drums (x2)", category: "Brakes" },
  { id: "rear-brake-shoes", name: "Rear Brake Shoes (x2)", category: "Brakes" },
  { id: "wheels", name: "Wheels (x4)", category: "Wheels" },
  { id: "tires", name: "Tires (x4)", category: "Wheels" },
  { id: "hubcaps", name: "Hubcaps (x4)", category: "Wheels" },
  { id: "hood", name: "Hood", category: "Body" },
  { id: "front-bumper", name: "Front Bumper", category: "Body" },
  { id: "rear-bumper", name: "Rear Bumper", category: "Body" },
  { id: "doors", name: "Doors (x2)", category: "Body" },
  { id: "trunk-lid", name: "Trunk Lid", category: "Body" },
  { id: "headlights", name: "Headlights (x2)", category: "Body" },
  { id: "taillights", name: "Taillights (x2)", category: "Body" },
  { id: "windshield", name: "Windshield", category: "Body" },
  { id: "side-windows", name: "Side Windows (x2)", category: "Body" },
  { id: "seats", name: "Seats (x2)", category: "Interior" },
  { id: "dashboard", name: "Dashboard", category: "Interior" },
  { id: "steering-wheel", name: "Steering Wheel", category: "Interior" },
  { id: "fuel-tank", name: "Fuel Tank", category: "Body" },
  { id: "exhaust-pipe", name: "Exhaust Pipe", category: "Body" },
  { id: "muffler", name: "Muffler", category: "Body" },
  { id: "battery", name: "Battery", category: "Electrical" },
  { id: "wiring-harness", name: "Wiring Harness", category: "Electrical" },
]

// Removed DEFAULT_MAP_MARKERS array and MapMarker interface

interface PartsTrackerProps {
  activeTab?: "parts" | "orders" | "map" | "vin"
}

export function PartsTracker({ activeTab = "parts" }: PartsTrackerProps) {
  const [partStatus, setPartStatus] = useState<Record<string, PartStatus>>({})
  const [phoneOrders, setPhoneOrders] = useState<PhoneOrder[]>([])
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(DEFAULT_MAP_MARKERS)
  const [mounted, setMounted] = useState(false)
  const hasShownConfetti = useRef(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const [newOrderPartName, setNewOrderPartName] = useState("")
  const [newOrderPhone, setNewOrderPhone] = useState("")
  const [newOrderPrice, setNewOrderPrice] = useState("")

  const [newMarkerName, setNewMarkerName] = useState("")
  const [newMarkerType, setNewMarkerType] = useState<MapMarker["type"]>("job")
  const [newMarkerDescription, setNewMarkerDescription] = useState("")
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [isConfigMode, setIsConfigMode] = useState(false)

  const [vinSegment1, setVinSegment1] = useState("") // Vehicle No (8 chars)
  const [vinSegment2, setVinSegment2] = useState("") // Drive and colors (9 chars)
  const [vinSegment3, setVinSegment3] = useState("") // Equipment (8 chars)

  const [calculatorInput, setCalculatorInput] = useState("")
  const [calculatorResult, setCalculatorResult] = useState<string>("")

  useEffect(() => {
    setMounted(true)
    const savedParts = localStorage.getItem("rivetta-parts-status")
    const savedOrders = localStorage.getItem("rivetta-phone-orders")
    const savedMarkers = localStorage.getItem("rivetta-map-markers")
    const savedVin1 = localStorage.getItem("rivetta-vin-segment1")
    const savedVin2 = localStorage.getItem("rivetta-vin-segment2")
    const savedVin3 = localStorage.getItem("rivetta-vin-segment3")
    const savedDarkMode = localStorage.getItem("rivetta-dark-mode")
    const savedExpandedSections = localStorage.getItem("rivetta-expanded-sections")

    if (savedParts) {
      setPartStatus(JSON.parse(savedParts))
    }
    if (savedOrders) {
      setPhoneOrders(JSON.parse(savedOrders))
    }
    if (savedMarkers) {
      const customMarkers = JSON.parse(savedMarkers)
      setMapMarkers([...DEFAULT_MAP_MARKERS, ...customMarkers.filter((m: MapMarker) => !m.isFixed)])
    }
    if (savedVin1) setVinSegment1(savedVin1)
    if (savedVin2) setVinSegment2(savedVin2)
    if (savedVin3) setVinSegment3(savedVin3)

    if (savedDarkMode === "true") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    if (savedExpandedSections) {
      setExpandedSections(JSON.parse(savedExpandedSections))
    } else {
      const allCategories = Array.from(new Set(RIVETTA_PARTS.map((p) => p.category)))
      const defaultExpanded: Record<string, boolean> = {}
      allCategories.forEach((cat) => {
        defaultExpanded[cat] = true
      })
      setExpandedSections(defaultExpanded)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rivetta-parts-status", JSON.stringify(partStatus))
    }
  }, [partStatus, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rivetta-phone-orders", JSON.stringify(phoneOrders))
    }
  }, [phoneOrders, mounted])

  useEffect(() => {
    if (mounted) {
      const customMarkers = mapMarkers.filter((m) => !m.isFixed)
      localStorage.setItem("rivetta-map-markers", JSON.stringify(customMarkers))
    }
  }, [mapMarkers, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rivetta-vin-segment1", vinSegment1)
    }
  }, [vinSegment1, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rivetta-vin-segment2", vinSegment2)
    }
  }, [vinSegment2, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rivetta-vin-segment3", vinSegment3)
    }
  }, [vinSegment3, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rivetta-dark-mode", isDarkMode.toString())
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [isDarkMode, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rivetta-expanded-sections", JSON.stringify(expandedSections))
    }
  }, [expandedSections, mounted])

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

  useEffect(() => {
    if (mounted) {
      const allAcquired = RIVETTA_PARTS.every((part) => partStatus[part.id]?.acquired)
      if (allAcquired && RIVETTA_PARTS.length > 0 && !hasShownConfetti.current) {
        hasShownConfetti.current = true
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
          })
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
          })

          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        }
        frame()
      } else if (!allAcquired) {
        hasShownConfetti.current = false
      }
    }
  }, [partStatus, mounted])

  const togglePart = (partId: string) => {
    setPartStatus((prev) => ({
      ...prev,
      [partId]: {
        acquired: !prev[partId]?.acquired,
        quantity: prev[partId]?.quantity || 0,
      },
    }))
  }

  const updatePartQuantity = (partId: string, quantity: number) => {
    setPartStatus((prev) => ({
      ...prev,
      [partId]: {
        acquired: prev[partId]?.acquired || false,
        quantity: Math.max(0, quantity),
      },
    }))
  }

  const markAllComplete = () => {
    const allComplete: Record<string, PartStatus> = {}
    RIVETTA_PARTS.forEach((part) => {
      allComplete[part.id] = {
        acquired: true,
        quantity: partStatus[part.id]?.quantity || 0,
      }
    })
    setPartStatus(allComplete)
  }

  const addPhoneOrder = () => {
    if (!newOrderPartName.trim() || !newOrderPhone.trim() || !newOrderPrice) {
      return
    }

    const newOrder: PhoneOrder = {
      id: Date.now().toString(),
      partName: newOrderPartName.trim(),
      phoneNumber: newOrderPhone.trim(),
      price: Number.parseFloat(newOrderPrice),
      delivered: false,
    }

    setPhoneOrders((prev) => [...prev, newOrder])
    setNewOrderPartName("")
    setNewOrderPhone("")
    setNewOrderPrice("")
  }

  const toggleOrderDelivered = (orderId: string) => {
    setPhoneOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, delivered: !order.delivered } : order)),
    )
  }

  const deleteOrder = (orderId: string) => {
    setPhoneOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  const resetPartsProgress = () => {
    if (confirm("Are you sure you want to reset all parts progress?")) {
      setPartStatus({})
      hasShownConfetti.current = false
    }
  }

  const resetOrders = () => {
    if (confirm("Are you sure you want to delete all orders?")) {
      setPhoneOrders([])
    }
  }

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleMapDoubleClick = () => {
    setIsConfigMode((prev) => !prev)
    // Exit adding marker mode when toggling config mode
    if (!isConfigMode) {
      setIsAddingMarker(false)
    }
  }

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMarker) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (newMarkerName.trim()) {
      const newMarker: MapMarker = {
        id: Date.now().toString(),
        x,
        y,
        name: newMarkerName.trim(),
        type: newMarkerType,
        description: newMarkerDescription.trim(),
      }

      setMapMarkers((prev) => [...prev, newMarker])
      setNewMarkerName("")
      setNewMarkerDescription("")
      setNewMarkerType("job")
      setIsAddingMarker(false)
    }
  }

  const deleteMarker = (markerId: string) => {
    setMapMarkers((prev) => prev.filter((marker) => marker.id !== markerId))
  }

  const resetMarkers = () => {
    if (confirm("Are you sure you want to delete all custom markers? Key locations will remain.")) {
      setMapMarkers(DEFAULT_MAP_MARKERS)
    }
  }

  const getMarkerIcon = (type: MapMarker["type"]) => {
    switch (type) {
      case "house":
        return <Home className="w-4 h-4" />
      case "gas-station":
        return <Fuel className="w-4 h-4" />
      case "shop":
        return <Package className="w-4 h-4" />
      case "repair-shop":
        return <Wrench className="w-4 h-4" />
      case "job":
        return <MapPin className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getMarkerColor = (type: MapMarker["type"]) => {
    switch (type) {
      case "house":
        return "bg-blue-500 border-blue-600"
      case "gas-station":
        return "bg-green-500 border-green-600"
      case "shop":
        return "bg-purple-500 border-purple-600"
      case "repair-shop":
        return "bg-orange-500 border-orange-600"
      case "job":
        return "bg-destructive border-destructive"
      default:
        return "bg-muted-foreground border-muted"
    }
  }

  const decodeVIN = (vin: string) => {
    if (vin.length < 8) return null

    const country = vin[0] === "U" ? "UK (United Kingdom)" : "Unknown"

    const factory: Record<string, string> = {
      A: "Dagenham",
      B: "Manchester",
      C: "Saarlouis",
      K: "Rheine",
    }

    const model = vin[2] === "B" ? "Rivett" : "Unknown"

    const body = vin[3] === "B" ? "2-door Sedan" : "Unknown"

    const trim: Record<string, string> = {
      D: "L (Base)",
      E: "LX",
      G: "SLX (Premium)",
      P: "GT (Sport)",
    }

    const year: Record<string, string> = {
      L: "1971",
      M: "1972",
      N: "1973",
      P: "1974 (Facelift)",
      R: "1975",
      S: "1976",
    }

    const month: Record<string, string> = {
      C: "January",
      K: "February",
      D: "March",
      E: "April",
      L: "May",
      Y: "June",
      S: "July",
      J: "September",
      U: "October",
      M: "November",
      P: "December",
    }

    return {
      country,
      factory: factory[vin[1]] || "Unknown",
      model,
      body,
      trim: trim[vin[4]] || "Unknown",
      year: year[vin[5]] || "Unknown",
      month: month[vin[6]] || "Unknown",
      serial: vin[7] || "?",
    }
  }

  const decodeDrivetrainAndColors = (code: string) => {
    if (code.length < 6) return null

    const drive = code[0] === "1" ? "RWD (Rear Wheel Drive)" : "Unknown"

    const engine: Record<string, string> = {
      NA: "Standard 2.0",
      NE: "High-Performance 2.0",
    }

    const trans: Record<string, string> = {
      "7": "3-speed Automatic",
      B: "4-speed Manual",
    }

    const axleRatio: Record<string, string> = {
      S: "3.44",
      B: "3.75",
      C: "3.89",
      N: "4.11",
      E: "4.44",
    }

    const axleType: Record<string, string> = {
      A: "Open",
      B: "LSD (Limited Slip Differential)",
    }

    const bodyColors: Record<string, string> = {
      A: "Dark Gray",
      B: "Natural White",
      C: "Sandy",
      D: "Asphalt Gray",
      E: "Blue",
      F: "Sunny Yellow",
      G: "Dark Navy",
      H: "Royal Red",
      I: "Brown",
      J: "Red",
      K: "Electric Green",
      L: "White Pearl",
      M: "Spring Green",
      R: "Purple",
      T: "Yellow",
      U: "Sky Blue",
      V: "Orange",
      X: "Navy Blue",
      Y: "White with 2 blue stripes (GT)",
    }

    const roofColors: Record<string, string> = {
      "-": "Body Color",
      A: "Black",
      B: "White",
      C: "Light Brown/Tan",
      K: "Blue",
      M: "Dark Brown",
    }

    const interiorColors: Record<string, string> = {
      N: "Red",
      A: "Black",
      K: "Light Brown/Tan",
      F: "Blue",
      Y: "Special Pattern (GT)",
    }

    const engineCode = code.slice(1, 3)
    const transCode = code[3]
    const axleRatioCode = code[4]
    const axleTypeCode = code[5]
    const bodyColorCode = code.length > 6 ? code[6] : ""
    const roofColorCode = code.length > 7 ? code[7] : ""
    const interiorCode = code.length > 8 ? code[8] : ""

    return {
      drive,
      engine: engine[engineCode] || "Unknown",
      transmission: trans[transCode] || "Unknown",
      axleRatio: axleRatio[axleRatioCode] || "Unknown",
      axleType: axleTypeCode ? axleType[axleTypeCode] || "Unknown" : "",
      bodyColor: bodyColorCode ? bodyColors[bodyColorCode] || "Unknown" : "",
      roofColor: roofColorCode ? roofColors[roofColorCode] || "Body Color" : "",
      interiorColor: interiorCode ? interiorColors[interiorCode] || "Unknown" : "",
    }
  }

  const decodeEquipment = (code: string) => {
    if (code.length < 8) return null

    const radio: Record<string, string> = {
      "-": "No Radio",
      J: "Radio",
    }

    const dashboard: Record<string, string> = {
      "-": "Standard",
      G: "Clock",
      M: "Tachometer",
    }

    const windshield: Record<string, string> = {
      "1": "Regular",
      "2": "Tinted",
      F: "Sun Strip",
    }

    const seats: Record<string, string> = {
      "8": "Standard",
      B: "Bucket Seats",
    }

    const suspension: Record<string, string> = {
      A: "Standard",
      B: "Standard + Stiffer",
      "4": "Lowered",
      M: "Lowered + Stiffer",
    }

    const brakes: Record<string, string> = {
      "-": "Standard",
      B: "Power-Assisted",
    }

    const wheels: Record<string, string> = {
      A: '13" Steel',
      B: '13" Steel + Hub Caps',
      "4": '14" Sport',
      M: '14" Steel / 14" 8-spoke',
    }

    const rearWindow: Record<string, string> = {
      "-": "Standard",
      B: "Heated",
      M: "Standard + Louvers",
    }

    return {
      radio: radio[code[0]] || "Unknown",
      dashboard: dashboard[code[1]] || "Standard",
      windshield: windshield[code[2]] || "Unknown",
      seats: seats[code[3]] || "Unknown",
      suspension: suspension[code[4]] || "Unknown",
      brakes: brakes[code[5]] || "Standard",
      wheels: wheels[code[6]] || "Unknown",
      rearWindow: rearWindow[code[7]] || "Standard",
    }
  }

  const categories = Array.from(new Set(RIVETTA_PARTS.map((p) => p.category)))
  const totalParts = RIVETTA_PARTS.length
  const acquiredCount = Object.values(partStatus).filter((status) => status.acquired).length
  const progressPercentage = (acquiredCount / totalParts) * 100

  const pendingOrdersTotal = phoneOrders
    .filter((order) => !order.delivered)
    .reduce((sum, order) => sum + order.price, 0)

  const getCategoryStats = (category: string) => {
    const categoryParts = RIVETTA_PARTS.filter((p) => p.category === category)
    const acquired = categoryParts.filter((p) => partStatus[p.id]?.acquired).length
    return { total: categoryParts.length, acquired }
  }

  const vinInfo = vinSegment1.length >= 8 ? decodeVIN(vinSegment1) : null
  const drivetrainInfo = vinSegment2.length >= 6 ? decodeDrivetrainAndColors(vinSegment2) : null
  const equipmentInfo = vinSegment3.length >= 8 ? decodeEquipment(vinSegment3) : null

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-4xl font-bold mb-2 text-balance">My Winter Car Companion</CardTitle>
              <CardDescription className="text-lg text-pretty">
                Track your Rivetta parts, manage orders, and navigate the Finnish winter
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className="flex-shrink-0">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="parts">Parts Checklist</TabsTrigger>
              <TabsTrigger value="orders">Phone Orders</TabsTrigger>
              <TabsTrigger value="map">Game Map</TabsTrigger>
              <TabsTrigger value="vin">VIN Reader</TabsTrigger>
            </TabsList>

            <TabsContent value="parts" className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall Progress</span>
                    <Button variant="outline" size="sm" onClick={resetPartsProgress} className="gap-2 bg-transparent">
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {acquiredCount} of {totalParts} parts collected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{Math.round(progressPercentage)}% Complete</span>
                      <span>{totalParts - acquiredCount} parts remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {categories.map((category) => {
                  const { total, acquired } = getCategoryStats(category)
                  const categoryParts = RIVETTA_PARTS.filter((p) => p.category === category)
                  const isComplete = acquired === total
                  const isExpanded = expandedSections[category] !== false

                  return (
                    <Card key={category}>
                      <CardHeader
                        className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                        onClick={() => toggleSection(category)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                            <CardTitle className="text-lg">{category}</CardTitle>
                            <Badge variant={isComplete ? "default" : "secondary"}>
                              {acquired}/{total}
                            </Badge>
                          </div>
                          {isComplete && <Badge variant="default">Complete</Badge>}
                        </div>
                      </CardHeader>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                        style={{
                          display: "grid",
                        }}
                      >
                        <div className="overflow-hidden">
                          <CardContent className="space-y-2">
                            {categoryParts.map((part) => {
                              const isAcquired = partStatus[part.id]?.acquired
                              const quantity = partStatus[part.id]?.quantity || 0

                              return (
                                <div
                                  key={part.id}
                                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <Checkbox
                                      id={part.id}
                                      checked={isAcquired}
                                      onCheckedChange={() => togglePart(part.id)}
                                    />
                                    <Label
                                      htmlFor={part.id}
                                      className={`cursor-pointer flex-1 ${
                                        isAcquired ? "line-through text-muted-foreground" : ""
                                      }`}
                                    >
                                      {part.name}
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 bg-transparent"
                                      onClick={() => updatePartQuantity(part.id, quantity - 1)}
                                      disabled={quantity === 0}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{quantity}</span>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 bg-transparent"
                                      onClick={() => updatePartQuantity(part.id, quantity + 1)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllComplete}
                  className="text-xs text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-transparent"
                >
                  Complete All
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order Summary</span>
                    {phoneOrders.length > 0 && (
                      <Button variant="outline" size="sm" onClick={resetOrders} className="gap-2 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>Track your phone orders and delivery status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-sm text-muted-foreground mb-1">Total Orders</div>
                        <div className="text-2xl font-bold">{phoneOrders.length}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="text-sm text-muted-foreground mb-1">Pending Payment</div>
                        <div className="text-2xl font-bold text-destructive">{pendingOrdersTotal.toFixed(2)} mk</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-part-name">Part Name</Label>
                        <Input
                          id="new-part-name"
                          placeholder="e.g., Carburetor"
                          value={newOrderPartName}
                          onChange={(e) => setNewOrderPartName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-phone">Phone Number</Label>
                        <Input
                          id="new-phone"
                          type="tel"
                          placeholder="e.g., 555-1234"
                          value={newOrderPhone}
                          onChange={(e) => setNewOrderPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-price">Price (mk)</Label>
                        <Input
                          id="new-price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={newOrderPrice}
                          onChange={(e) => setNewOrderPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={addPhoneOrder} className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Add Order
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {phoneOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No orders yet. Add your first phone order above.</p>
                    </CardContent>
                  </Card>
                ) : (
                  phoneOrders.map((order) => (
                    <Card
                      key={order.id}
                      className={order.delivered ? "border-accent/30 bg-accent/5" : "border-destructive/30"}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">{order.partName}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5" />
                                  {order.phoneNumber}
                                </div>
                                <Badge variant={order.delivered ? "default" : "destructive"} className="font-mono">
                                  {order.price.toFixed(2)} mk
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`delivered-${order.id}`}
                                  checked={order.delivered}
                                  onCheckedChange={() => toggleOrderDelivered(order.id)}
                                  className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                                />
                                <label
                                  htmlFor={`delivered-${order.id}`}
                                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                                >
                                  <Package className="w-4 h-4" />
                                  {order.delivered ? "Delivered" : "Mark as Delivered"}
                                </label>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteOrder(order.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="map" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Game World Map</span>
                    {mapMarkers.filter((m) => !m.isFixed).length > 0 && (
                      <Button variant="outline" size="sm" onClick={resetMarkers} className="gap-2 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                        Reset Custom
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>Key locations and job markers for My Winter Car</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isConfigMode && (
                      <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-primary">Configuration Mode Active</h3>
                            <p className="text-sm text-muted-foreground">
                              Add new markers or delete existing custom locations
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsConfigMode(false)}
                            className="bg-background"
                          >
                            Exit Config Mode
                          </Button>
                        </div>
                      </div>
                    )}

                    {isConfigMode && (
                      <div className="space-y-4 p-4 rounded-lg border bg-card">
                        <div className="space-y-2">
                          <Label htmlFor="marker-name">Location Name</Label>
                          <Input
                            id="marker-name"
                            placeholder="e.g., Firewood Delivery"
                            value={newMarkerName}
                            onChange={(e) => setNewMarkerName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="marker-type">Location Type</Label>
                          <select
                            id="marker-type"
                            className="w-full px-3 py-2 rounded-md border bg-background"
                            value={newMarkerType}
                            onChange={(e) => setNewMarkerType(e.target.value as MapMarker["type"])}
                          >
                            <option value="job">Job Location</option>
                            <option value="house">House</option>
                            <option value="gas-station">Gas Station</option>
                            <option value="shop">Shop</option>
                            <option value="repair-shop">Repair Shop</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="marker-description">Description (Optional)</Label>
                          <Input
                            id="marker-description"
                            placeholder="e.g., Delivers firewood daily"
                            value={newMarkerDescription}
                            onChange={(e) => setNewMarkerDescription(e.target.value)}
                          />
                        </div>

                        <Button
                          onClick={() => {
                            if (newMarkerName.trim()) {
                              setIsAddingMarker(true)
                            }
                          }}
                          disabled={!newMarkerName.trim() || isAddingMarker}
                          className="w-full"
                        >
                          {isAddingMarker ? "Click on map to place marker..." : "Start Adding Marker"}
                        </Button>

                        {isAddingMarker && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingMarker(false)
                              setNewMarkerName("")
                              setNewMarkerDescription("")
                            }}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                      {isConfigMode
                        ? isAddingMarker
                          ? "Click anywhere on the map to place your marker"
                          : "Double-click the map again to exit configuration mode"
                        : "Double-click on the map to enter configuration mode"}
                    </p>

                    <div
                      className={`relative w-full aspect-square bg-muted rounded-lg overflow-hidden border-2 border-border ${
                        isAddingMarker ? "cursor-crosshair" : isConfigMode ? "cursor-pointer" : "cursor-default"
                      }`}
                      onClick={handleMapClick}
                      onDoubleClick={handleMapDoubleClick}
                      style={{
                        backgroundImage: "url('/my-winter-car-map.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {mapMarkers.map((marker) => (
                        <div
                          key={marker.id}
                          className="absolute group"
                          style={{
                            left: `${marker.x}%`,
                            top: `${marker.y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div
                            className={`w-8 h-8 rounded-full border-2 ${getMarkerColor(marker.type)} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
                          >
                            {getMarkerIcon(marker.type)}
                          </div>

                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="font-semibold">{marker.name}</div>
                            {marker.description && <div className="text-gray-300">{marker.description}</div>}
                            {!marker.isFixed && isConfigMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteMarker(marker.id)
                                }}
                                className="mt-1 text-destructive hover:text-destructive/80 pointer-events-auto"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isConfigMode && mapMarkers.filter((m) => !m.isFixed).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Job Markers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mapMarkers
                        .filter((m) => !m.isFixed)
                        .map((marker) => (
                          <div
                            key={marker.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border ${getMarkerColor(marker.type)} text-white flex items-center justify-center text-xs`}
                              >
                                {getMarkerIcon(marker.type)}
                              </div>
                              <div>
                                <div className="font-medium">{marker.name}</div>
                                {marker.description && (
                                  <div className="text-sm text-muted-foreground">{marker.description}</div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMarker(marker.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="vin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    VIN Code Decoder
                  </CardTitle>
                  <CardDescription>Enter your Rivetta's VIN code to decode factory specifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 3 separate inputs matching the guide format */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="vin-segment1">Vehicle No. (8 characters)</Label>
                      <Input
                        id="vin-segment1"
                        type="text"
                        placeholder="UABBDRCM"
                        value={vinSegment1}
                        onChange={(e) => setVinSegment1(e.target.value.toUpperCase())}
                        maxLength={8}
                        className="font-mono tracking-wider"
                      />
                      <p className="text-xs text-muted-foreground">
                        Country, Factory, Model, Body, Trim, Year, Month, Serial
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vin-segment2">Drive & Colors (6-9 characters)</Label>
                      <Input
                        id="vin-segment2"
                        type="text"
                        placeholder="1NABSAmeter"
                        value={vinSegment2}
                        onChange={(e) => setVinSegment2(e.target.value.toUpperCase())}
                        maxLength={9}
                        className="font-mono tracking-wider"
                      />
                      <p className="text-xs text-muted-foreground">
                        Drive, Engine, Trans, Axle Ratio, Axle Type, Body Color, Roof Color, Interior
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vin-segment3">Equipment (8 characters)</Label>
                      <Input
                        id="vin-segment3"
                        type="text"
                        placeholder="JM1BA-BM"
                        value={vinSegment3}
                        onChange={(e) => setVinSegment3(e.target.value.toUpperCase())}
                        maxLength={8}
                        className="font-mono tracking-wider"
                      />
                      <p className="text-xs text-muted-foreground">
                        Radio, Dashboard, Windshield, Seats, Suspension, Brakes, Wheels, Rear Window
                      </p>
                    </div>
                  </div>

                  {vinInfo && (
                    <div className="mt-6 space-y-6">
                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-3">Vehicle Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Country:</span>
                            <p className="font-medium">{vinInfo.country}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Factory:</span>
                            <p className="font-medium">{vinInfo.factory}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Model:</span>
                            <p className="font-medium">{vinInfo.model}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Body Type:</span>
                            <p className="font-medium">{vinInfo.body}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Trim Level:</span>
                            <p className="font-medium">{vinInfo.trim}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Production Date:</span>
                            <p className="font-medium">
                              {vinInfo.month} {vinInfo.year}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Serial Number:</span>
                            <p className="font-medium">{vinInfo.serial}</p>
                          </div>
                        </div>
                      </div>

                      {drivetrainInfo && (
                        <div className="border-t pt-4">
                          <h3 className="font-semibold text-lg mb-3">Drivetrain & Colors</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Drive Type:</span>
                              <p className="font-medium">{drivetrainInfo.drive}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Engine:</span>
                              <p className="font-medium">{drivetrainInfo.engine}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Transmission:</span>
                              <p className="font-medium">{drivetrainInfo.transmission}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Axle Ratio:</span>
                              <p className="font-medium">{drivetrainInfo.axleRatio}</p>
                            </div>
                            {drivetrainInfo.axleType && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Axle Type:</span>
                                <p className="font-medium">{drivetrainInfo.axleType}</p>
                              </div>
                            )}
                            {drivetrainInfo.bodyColor && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Body Color:</span>
                                <p className="font-medium">{drivetrainInfo.bodyColor}</p>
                              </div>
                            )}
                            {drivetrainInfo.roofColor && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Roof Color:</span>
                                <p className="font-medium">{drivetrainInfo.roofColor}</p>
                              </div>
                            )}
                            {drivetrainInfo.interiorColor && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Interior Color:</span>
                                <p className="font-medium">{drivetrainInfo.interiorColor}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {equipmentInfo && (
                        <div className="border-t pt-4">
                          <h3 className="font-semibold text-lg mb-3">Equipment</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Radio:</span>
                              <p className="font-medium">{equipmentInfo.radio}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Dashboard:</span>
                              <p className="font-medium">{equipmentInfo.dashboard}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Windshield:</span>
                              <p className="font-medium">{equipmentInfo.windshield}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Seats:</span>
                              <p className="font-medium">{equipmentInfo.seats}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Suspension:</span>
                              <p className="font-medium">{equipmentInfo.suspension}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Brakes:</span>
                              <p className="font-medium">{equipmentInfo.brakes}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Wheels:</span>
                              <p className="font-medium">{equipmentInfo.wheels}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Rear Window:</span>
                              <p className="font-medium">{equipmentInfo.rearWindow}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!vinInfo && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Enter your VIN code segments to decode vehicle specifications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 mb-4">
        <div className="flex items-center gap-3 bg-muted/30 border rounded-lg p-3">
          <Input
            type="text"
            placeholder="Enter calculation (e.g., 3*7)"
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

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Progress is automatically saved to your browser</p>
      </div>
    </div>
  )
}
