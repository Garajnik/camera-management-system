<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DefaultCameraConfig {
  width: number | undefined
  height: number | undefined
  offset_x: number | undefined
  offset_y: number | undefined
  pixel_format: string | undefined
  fps: number | undefined
  exposure: number | undefined
  exposure_mode: number | undefined
  gain: number | undefined
  gev_scpd: number | undefined
}

const defaultConfig = reactive<DefaultCameraConfig>({
  width: undefined,
  height: undefined,
  offset_x: undefined,
  offset_y: undefined,
  pixel_format: undefined,
  fps: undefined,
  exposure: undefined,
  exposure_mode: undefined,
  gain: undefined,
  gev_scpd: undefined
})

const initialConfig = ref<DefaultCameraConfig | null>(null)

const fetchDefaultConfig = async () => {
  try {
    const response = await fetch('/api/default-camera-config')
    const data = await response.json()
    const settings: DefaultCameraConfig = {
      width: data.width ?? undefined,
      height: data.height ?? undefined,
      offset_x: data.offset_x ?? undefined,
      offset_y: data.offset_y ?? undefined,
      pixel_format: data.pixel_format ?? undefined,
      fps: data.fps ?? undefined,
      exposure: data.exposure ?? undefined,
      exposure_mode: data.exposure_mode ?? undefined,
      gain: data.gain ?? undefined,
      gev_scpd: data.gev_scpd ?? undefined
    }
    Object.assign(defaultConfig, settings)
    initialConfig.value = { ...settings }
  } catch (error) {
    console.error('Failed to fetch default config:', error)
    // Запасной вариант
    const fallbackConfig: DefaultCameraConfig = {
      width: 4096,
      height: 2160,
      offset_x: 0,
      offset_y: 0,
      pixel_format: "BayerRG8",
      fps: undefined,
      exposure: 10000,
      exposure_mode: 0,
      gain: 10,
      gev_scpd: 6000
    }
    Object.assign(defaultConfig, fallbackConfig)
    initialConfig.value = { ...fallbackConfig }
  }
}

const saveConfig = async () => {
  try {
    const configToSave = {
      width: defaultConfig.width ?? null,
      height: defaultConfig.height ?? null,
      offset_x: defaultConfig.offset_x ?? null,
      offset_y: defaultConfig.offset_y ?? null,
      pixel_format: defaultConfig.pixel_format ?? null,
      fps: defaultConfig.fps ?? null,
      exposure: defaultConfig.exposure ?? null,
      exposure_mode: defaultConfig.exposure_mode ?? null,
      gain: defaultConfig.gain ?? null,
      gev_scpd: defaultConfig.gev_scpd ?? null
    }
    const response = await fetch('/api/default-camera-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configToSave)
    })
    if (response.ok) {
      initialConfig.value = { ...defaultConfig }
      console.log('Default config saved successfully')
    } else {
      console.error('Failed to save default config:', response.statusText)
    }
  } catch (error) {
    console.error('Error saving default config:', error)
  }
}

const resetConfig = () => {
  if (initialConfig.value) {
    Object.assign(defaultConfig, initialConfig.value)
  }
}

onMounted(() => {
  fetchDefaultConfig()
})
</script>

<template>
  <div class="container mx-auto max-w-md p-6">
    <h2 class="text-2xl font-bold mb-6">Edit Default Camera Config</h2>
    <div class="flex flex-col gap-4">
      <div>
        <Label for="width">Ширина</Label>
        <Input id="width" v-model="defaultConfig.width" type="number" />
      </div>
      <div>
        <Label for="height">Высота</Label>
        <Input id="height" v-model="defaultConfig.height" type="number" />
      </div>
      <div>
        <Label for="offset_x">Смещение по X</Label>
        <Input id="offset_x" v-model="defaultConfig.offset_x" type="number" />
      </div>
      <div>
        <Label for="offset_y">Смещение по Y</Label>
        <Input id="offset_y" v-model="defaultConfig.offset_y" type="number" />
      </div>
      <div>
        <Label for="pixel_format">Формат картинки</Label>
        <Input id="pixel_format" v-model="defaultConfig.pixel_format" type="text" />
      </div>
      <div>
        <Label for="fps">FPS</Label>
        <Input id="fps" v-model="defaultConfig.fps" type="number" />
      </div>
      <div>
        <Label for="exposure">Экспозиция</Label>
        <Input id="exposure" v-model="defaultConfig.exposure" type="number" />
      </div>
      <div>
        <Label for="exposure_mode">Режим экспозиции</Label>
        <Input id="exposure_mode" v-model="defaultConfig.exposure_mode" type="number" />
      </div>
      <div>
        <Label for="gain">Яркость</Label>
        <Input id="gain" v-model="defaultConfig.gain" type="number" />
      </div>
      <div>
        <Label for="gev_scpd">Gev SCPD</Label>
        <Input id="gev_scpd" v-model="defaultConfig.gev_scpd" type="number" />
      </div>
      <div class="flex gap-4">
        <Button @click="saveConfig">Сохранить</Button>
        <Button variant="outline" @click="resetConfig">Сбросить</Button>
      </div>
    </div>
  </div>
</template>
