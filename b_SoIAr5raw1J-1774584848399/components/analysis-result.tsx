"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface AnalysisResultProps {
  prediction: "fake" | "real"
  confidence: number
}

export function AnalysisResult({ prediction, confidence }: AnalysisResultProps) {
  const isFake = prediction === "fake"

  return (
    <Card className={`border-2 transition-all duration-300 ${
      isFake 
        ? "border-destructive/50 bg-destructive/5" 
        : "border-success/50 bg-success/5"
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isFake ? (
            <AlertTriangle className="w-5 h-5 text-destructive" />
          ) : (
            <CheckCircle className="w-5 h-5 text-success" />
          )}
          Analysis Result
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Prediction</span>
            <span className={`text-3xl font-bold ${
              isFake ? "text-destructive" : "text-success"
            }`}>
              {isFake ? "Likely Fake" : "Likely Real"}
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${
                isFake ? "text-destructive" : "text-success"
              }`}>
                {confidence}
              </span>
              <span className={`text-xl font-medium ${
                isFake ? "text-destructive/70" : "text-success/70"
              }`}>
                %
              </span>
            </div>
          </div>
        </div>
        
        {/* Confidence Bar */}
        <div className="mt-4">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isFake ? "bg-destructive" : "bg-success"
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground">
          {isFake 
            ? "This article contains patterns commonly associated with misinformation. We recommend verifying with trusted sources before sharing."
            : "This article appears to follow patterns consistent with credible news reporting. However, always verify important information with multiple sources."
          }
        </p>
      </CardContent>
    </Card>
  )
}
