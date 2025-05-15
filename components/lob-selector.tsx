"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { linesOfBusiness } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface LOBSelectorProps {
  onSelect: (lobId: string | null) => void
  selectedLOB?: string | null
  showAllOption?: boolean
  buttonVariant?: "default" | "outline" | "secondary" | "ghost"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LOBSelector({
  onSelect,
  selectedLOB = null,
  showAllOption = true,
  buttonVariant = "outline",
  buttonSize = "default",
  className,
}: LOBSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(selectedLOB)

  useEffect(() => {
    setSelected(selectedLOB)
  }, [selectedLOB])

  const handleSelect = (lobId: string | null) => {
    setSelected(lobId)
    onSelect(lobId)
    setOpen(false)
  }

  const selectedLOBName = selected
    ? linesOfBusiness.find((lob) => lob.id === selected)?.name || "Unknown LOB"
    : "All Lines of Business"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={cn("justify-between", className)}>
          {selectedLOBName}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search lines of business..." />
          <CommandList>
            <CommandEmpty>No line of business found.</CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem onSelect={() => handleSelect(null)} className="flex items-center">
                  <div className={cn("mr-2", !selected && "text-primary")}>
                    {!selected && <Check className="h-4 w-4" />}
                  </div>
                  All Lines of Business
                </CommandItem>
              )}
              {linesOfBusiness.map((lob) => (
                <CommandItem key={lob.id} onSelect={() => handleSelect(lob.id)} className="flex items-center">
                  <div className={cn("mr-2", selected === lob.id && "text-primary")}>
                    {selected === lob.id && <Check className="h-4 w-4" />}
                  </div>
                  {lob.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
