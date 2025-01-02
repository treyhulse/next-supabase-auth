"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, GripVertical } from "lucide-react"
import { DesignLayer } from "../page-client"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface DesignLayersProps {
  layers: DesignLayer[]
  onChange: (layers: DesignLayer[]) => void
}

export function DesignLayers({ layers, onChange }: DesignLayersProps) {
  const toggleVisibility = (layerId: string) => {
    onChange(
      layers.map(layer =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    )
  }

  const updateDPI = (layerId: string, dpi: number) => {
    onChange(
      layers.map(layer =>
        layer.id === layerId
          ? { ...layer, dpi }
          : layer
      )
    )
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(layers)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update z-index values
    const updatedLayers = items.map((layer, index) => ({
      ...layer,
      zIndex: items.length - index
    }))

    onChange(updatedLayers)
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Layers</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {layers.map((layer, index) => (
                <Draggable
                  key={layer.id}
                  draggableId={layer.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-2 p-2 bg-accent rounded-lg"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleVisibility(layer.id)}
                      >
                        {layer.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Input
                        type="number"
                        value={layer.dpi}
                        onChange={(e) => updateDPI(layer.id, Number(e.target.value))}
                        className="w-20"
                        min={72}
                        max={300}
                      />
                      <span className="text-sm">DPI</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  )
} 