<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DefaultCameraConfig } from '../services/types.ts'
import { fetchDefaultConfig, saveDefaultConfig } from '../services/cameraService'

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

onMounted(async () => {
  try {
    const config = await fetchDefaultConfig()
    Object.assign(defaultConfig, config)
    initialConfig.value = { ...config }
  } catch (error) {
    console.error('Failed to fetch default config:', error)
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
})

const saveConfig = async () => {
  try {
    await saveDefaultConfig(defaultConfig)
    initialConfig.value = { ...defaultConfig }
    console.log('Default config saved successfully')
  } catch (error) {
    console.error('Error saving default config:', error)
  }
}

const resetConfig = () => {
  if (initialConfig.value) {
    Object.assign(defaultConfig, initialConfig.value)
  }
}
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
