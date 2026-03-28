"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface Word {
  word: string
  weight: number
}

interface ExplainableAIProps {
  words: Word[]
}

export function ExplainableAI({ words }: ExplainableAIProps) {
  const maxWeight = Math.max(...words.map(w => w.weight))

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Explainable AI Insights
        </CardTitle>
        <CardDescription>
          Top influencing words that contributed to the prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {words.map((item, index) => (
            <div key={item.word} className="flex items-center gap-4">
              <span className="w-6 text-sm text-muted-foreground font-mono">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {item.word}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {(item.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${(item.weight / maxWeight) * 100}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-2">How to interpret</h4>
          <p className="text-sm text-muted-foreground">
            These words had the highest influence on the AI model&apos;s decision. Words with higher percentages 
            contributed more significantly to the final prediction. This helps understand why the model 
            classified the article as it did.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
