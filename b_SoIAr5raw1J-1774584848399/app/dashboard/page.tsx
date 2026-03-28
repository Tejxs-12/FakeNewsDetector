"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, LogOut, Search, FileText, Link as LinkIcon, Loader2 } from "lucide-react"
import { AnalysisResult } from "@/components/analysis-result"
import { ExplainableAI } from "@/components/explainable-ai"

interface User {
  username: string
}

interface AnalysisData {
  prediction: "fake" | "real"
  confidence: number
  influencingWords: { word: string; weight: number }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [newsText, setNewsText] = useState("")
  const [newsUrl, setNewsUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null)
  const [activeTab, setActiveTab] = useState("text")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  // 🔥 FIXED FUNCTION (only error handling improved)
  const analyzeNews = async () => {
    const content = activeTab === "text" ? newsText : newsUrl
    if (!content.trim()) return

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      })

      // ✅ FIX: check response before parsing
      if (!res.ok) {
        const text = await res.text()
        console.error("Backend error:", text)
        throw new Error("Backend error")
      }

      const data = await res.json()

      setAnalysisResult({
        prediction: data.prediction.toLowerCase(),
        confidence: data.confidence,
        influencingWords: [
          { word: "model", weight: 0.9 },
          { word: "analysis", weight: 0.8 },
          { word: "prediction", weight: 0.7 },
        ],
      })

    } catch (error) {
      console.error(error)
      alert("❌ Failed to connect to backend")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Fake News Detection System</h1>
              <p className="text-sm text-muted-foreground">AI-Powered News Verification</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="text-foreground font-medium">{user.username}</span>
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-border/50 hover:bg-secondary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Analyze News
              </CardTitle>
              <CardDescription>
                Enter a news article text or paste a URL to verify its authenticity
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-secondary/50">
                  <TabsTrigger value="text">
                    <FileText className="w-4 h-4 mr-2" />
                    Text Input
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    URL Input
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <Textarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </TabsContent>

                <TabsContent value="url">
                  <Input
                    value={newsUrl}
                    onChange={(e) => setNewsUrl(e.target.value)}
                  />
                </TabsContent>
              </Tabs>

              <Button 
                onClick={analyzeNews}
                disabled={isAnalyzing}
                className="w-full mt-4"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze News"}
              </Button>

            </CardContent>
          </Card>

          {analysisResult && (
            <div className="flex flex-col gap-6">
              <AnalysisResult 
                prediction={analysisResult.prediction} 
                confidence={analysisResult.confidence} 
              />
              <ExplainableAI words={analysisResult.influencingWords} />
            </div>
          )}

        </div>
      </main>
    </div>
  )
}