"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ChangelogViewer() {
  const [changelog, setChangelog] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch("/changelog.txt")
      .then((response) => response.text())
      .then((text) => setChangelog(text))
      .catch(() => setChangelog("Unable to load changelog."))
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Winter Car - Game Changelog</CardTitle>
          <CardDescription>Latest updates and changes to the game</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">{changelog}</pre>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Note</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            To update this changelog, edit the <code className="bg-muted px-1.5 py-0.5 rounded">changelog.txt</code>{" "}
            file in the public directory of your project.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
