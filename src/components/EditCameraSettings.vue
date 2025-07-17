<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Camera {
  ip_address: string
}

interface CameraSettings {
  width: number | undefined
  height: number | undefined
  offset_x: number | undefined
  offset_y: number | undefined
  pixel_format: string | undefined
  fps: number | undefined
  exposure: number | undefined
  exposure_mode: string | undefined
  gain: number | undefined
  gev_scpd: string | undefined
}

const props = defineProps<{
  open: boolean
  camera: Camera | null
  settings: CameraSettings | null
}>()
console.log(props)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save'): void
}>()

const handleSave = () => {
  emit('save')
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Изменение настроек камеры для {{ camera?.ip_address }}</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <div>
          <Label for="width">Ширина</Label>
          <Input id="width" v-model="settings!.width" type="number" />
        </div>
        <div>
          <Label for="height">Высота</Label>
          <Input id="height" v-model="settings!.height" type="number" />
        </div>
        <div>
          <Label for="offset_x">Смещение по X</Label>
          <Input id="offset_x" v-model="settings!.offset_x" type="number" />
        </div>
        <div>
          <Label for="offset_y">Смещение по Y</Label>
          <Input id="offset_y" v-model="settings!.offset_y" type="number" />
        </div>
        <div>
          <Label for="pixel_format">Формат картинки</Label>
          <Input id="pixel_format" v-model="settings!.pixel_format" type="text" />
        </div>
        <div>
          <Label for="fps">FPS</Label>
          <Input id="fps" v-model="settings!.fps" type="number" />
        </div>
        <div>
          <Label for="exposure">Экспозиция</Label>
          <Input id="exposure" v-model="settings!.exposure" type="number" />
        </div>
        <div>
          <Label for="exposure_mode">Режим экспозиции</Label>
          <Input id="exposure_mode" v-model="settings!.exposure_mode" type="text" />
        </div>
        <div>
          <Label for="gain">Яркость</Label>
          <Input id="gain" v-model="settings!.gain" type="number" />
        </div>
        <div>
          <Label for="gev_scpd">Gev SCPD</Label>
          <Input id="gev_scpd" v-model="settings!.gev_scpd" type="text" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="handleCancel">Отмена</Button>
        <Button @click="handleSave">Сохранить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
