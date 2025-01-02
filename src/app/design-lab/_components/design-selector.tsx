"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save, Trash2 } from "lucide-react"
import { Design } from "../page-client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DesignSelectorProps {
  currentDesign: Design | null
  onSelect: (designId: string) => void
  onSave: (design: Design) => void
}

export function DesignSelector({ currentDesign, onSelect, onSave }: DesignSelectorProps) {
  const [designs, setDesigns] = useState<Design[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [designName, setDesignName] = useState("")

  const handleSave = async () => {
    if (!currentDesign || !designName) return

    const designToSave = {
      ...currentDesign,
      name: designName,
      updatedAt: new Date()
    }

    await onSave(designToSave)
    setDesigns(prev => [...prev, designToSave])
    setIsDialogOpen(false)
    setDesignName("")
  }

  const handleDelete = async (designId: string) => {
    // Implement delete logic
    setDesigns(prev => prev.filter(d => d.id !== designId))
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Saved Designs</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Design</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Design name"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
              />
              <Button onClick={handleSave}>Save Design</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {designs.map((design) => (
            <div
              key={design.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
            >
              <button
                className="flex-1 text-left"
                onClick={() => onSelect(design.id!)}
              >
                <p className="text-sm font-medium">{design.name}</p>
                <p className="text-xs text-muted-foreground">
                  {design.updatedAt?.toLocaleDateString()}
                </p>
              </button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(design.id!)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
} 