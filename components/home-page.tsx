"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Phone, Map, Car, FileText, ExternalLink, BookOpen, Moon, Sun } from "lucide-react"
import Link from "next/link"

const POPULAR_GUIDES = [
  {
    title: "Corris Rivett - Complete Building Guide with Wiring",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3640150636",
  },
  {
    title: "Complete parts list PSK Tuning Fleetari Classifieds",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3637886633",
  },
  {
    title: "The BEST Way to Get Sober",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3637231606",
  },
  {
    title: "Rivett Part Checklist",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3637443843",
  },
  {
    title: "Understanding the Basics of the Game",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3639007114",
  },
]

export function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedDarkMode = localStorage.getItem("rivetta-dark-mode")
    if (savedDarkMode === "true") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-balance">My Winter Car Companion</h1>
        <p className="text-xl text-muted-foreground text-pretty mb-6">
          Your ultimate toolkit for managing the Rivetta and surviving Finnish winter
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg" className="gap-2">
            <a
              href="https://store.steampowered.com/app/4164420/My_Winter_Car/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-5 h-5" />
              View on Steam Store
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
            <a
              href="https://steamcommunity.com/app/4164420/guides/?browsesort=trend&browsefilter=trend&requiredtags%5B0%5D=english&p=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="w-5 h-5" />
              Community Guides
            </a>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link href="/parts-checklist">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Package className="w-12 h-12 mb-3 text-primary" />
              <CardTitle>Parts Checklist</CardTitle>
              <CardDescription>Track all Rivetta parts with quantities and progress monitoring</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/phone-orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Phone className="w-12 h-12 mb-3 text-primary" />
              <CardTitle>Phone Orders</CardTitle>
              <CardDescription>Manage part orders with prices, phone numbers, and delivery tracking</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/game-map">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Map className="w-12 h-12 mb-3 text-primary" />
              <CardTitle>Game Map</CardTitle>
              <CardDescription>Mark job locations on the interactive My Winter Car map</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/vin-reader">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Car className="w-12 h-12 mb-3 text-primary" />
              <CardTitle>VIN Reader</CardTitle>
              <CardDescription>Decode your Rivetta VIN to discover all factory specifications</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/changelog">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <FileText className="w-12 h-12 mb-3 text-primary" />
              <CardTitle>Game Changelog</CardTitle>
              <CardDescription>View the latest updates and changes to My Winter Car</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Popular Community Guides
          </CardTitle>
          <CardDescription>Trending guides from the Steam Community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {POPULAR_GUIDES.map((guide, index) => (
              <a
                key={index}
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm flex-1 group-hover:text-primary transition-colors">{guide.title}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
