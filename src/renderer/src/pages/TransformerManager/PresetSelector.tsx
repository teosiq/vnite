import * as React from 'react'
import { Plus } from 'lucide-react'
import { cn } from '~/utils'
import { Button } from '@ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { getTransformerPresets } from './presets'
import { TransformerRule } from './types'
import { generateUUID } from '@appUtils'

interface PresetSelectorProps {
  className?: string
  onSelectPreset: (preset: TransformerRule) => void
}

export function TransformerPresetSelector({
  className,
  onSelectPreset
}: PresetSelectorProps): JSX.Element {
  const { t } = useTranslation('transformer')
  const [open, setOpen] = React.useState(false)

  const handleSelectPreset = (presetValue: string): void => {
    const selectedPreset = getTransformerPresets().find((p) => p.value === presetValue)
    if (selectedPreset) {
      // Clone the preset to avoid modifying the original
      const presetCopy = JSON.parse(JSON.stringify(selectedPreset.preset)) as TransformerRule

      // Generate a new ID to ensure uniqueness
      presetCopy.id = generateUUID()

      toast.success(t('notifications.presetAdded'))
      onSelectPreset(presetCopy)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(className)} asChild>
        <Button variant="outline" size={'sm'} className="bg-background/70">
          <Plus className="w-4 h-4 mr-2" />
          {t('presetSelector.button')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-transparent w-50">
        <Command>
          <CommandInput placeholder={t('presetSelector.searchPlaceholder')} />
          <CommandList>
            <CommandEmpty>{t('presetSelector.noResults')}</CommandEmpty>
            <CommandGroup>
              {getTransformerPresets().map((preset) => (
                <CommandItem
                  key={preset.value}
                  value={preset.value}
                  onSelect={handleSelectPreset}
                  className="pl-5"
                >
                  {preset.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
