<template>
  <div>
    <JsonEditorVue
      v-model="jsonData"
      mode="tree"
      :debounce="300"
      style="height: 600px; border: 1px solid #ccc;"
    />
    <Button class="mt-4" :disabled="saving" @click="save" variant="default">
      {{ saving ? 'Сохраняю…' : 'Сохранить на сервер' }}
    </Button>
    <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
    <div v-if="success" class="text-green-600 mt-2">✔ Успешно сохранено!</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import JsonEditorVue from 'json-editor-vue'
import { Button } from '@/components/ui/button'
import { fetchConfig, saveConfig } from '../services/cameraService.ts'

const jsonData = ref(null)
const saving = ref(false)
const error = ref('')
const success = ref(false)

const mockJSON = {
  cameras: {
    Camera253: {
      ip_address: '192.168.50.253',
      settings: { width: null, height: null, offset_x: null, offset_y: null, pixel_format: null, fps: null, exposure: null, exposure_mode: null, gain: null, gev_scpd: null }
    },
    Camera249: {
      ip_address: '192.168.50.249',
      settings: { width: null, height: null, offset_x: null, offset_y: null, pixel_format: null, fps: null, exposure: null, exposure_mode: null, gain: null, gev_scpd: null }
    }
  },
  default_camera_settings: {
    width: 4096, height: 2160, offset_x: 0, offset_y: 0,
    pixel_format: 'BayerRG8', fps: null, exposure: 10000,
    exposure_mode: 0, gain: 10, gev_scpd: 6000
  },
  frame_quality: 90,
  frame_rate: 1,
  frame_max_timeout_count: 1000,
  broadcast_address: '192.168.51.255',
  queue_size: 10000,
  queue_max_mb: 1024
}

onMounted(async () => {
  try {
    jsonData.value = await fetchConfig()
  } catch {
    jsonData.value = JSON.parse(JSON.stringify(mockJSON))
  }
})

async function save() {
  saving.value = true
  error.value = ''
  success.value = false
  try {
    await saveConfig(jsonData.value)
    success.value = true
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
    setTimeout(() => (success.value = false), 2000)
  }
}
</script>

<style scoped>
</style>
