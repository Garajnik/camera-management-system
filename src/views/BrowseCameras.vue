<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { h } from 'vue'
import DataTable from '../components/BrowseCameras/data-table.vue'
import CameraActions from '../components/BrowseCameras/CameraActions.vue'
import EditCameraSettings from '../components/EditCameraSettings.vue'
import type { Row } from '@tanstack/table-core'

interface Camera {
  ip_address: string
  serial_number: string
  model_name: string
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

const cameras = ref<Camera[]>([
  { ip_address: "192.168.50.249", serial_number: "02K09721737", model_name: "MV-CH089-10GC" },
  { ip_address: "192.168.50.253", serial_number: "02K09721736", model_name: "MV-CH089-10GC" }
])

const statuses = ref<Record<string, 'активная' | 'включена'>>({})

const cameraSettingsByIp = reactive<Record<string, CameraSettings>>({
  "192.168.50.253": {
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
  },
  "192.168.50.249": {
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
  }
})

const isModalOpen = ref(false)
const currentCamera = ref<Camera | null>(null)
const editingSettings = ref<CameraSettings | null>(null)

onMounted(() => {
  cameras.value.forEach(camera => {
    statuses.value[camera.serial_number] = 'активная'
  })
})

const columns = [
  {
    id: 'rowNumber',
    header: '№.',
    cell: (info: any) => {
      const index = info.table.getRowModel().rows.indexOf(info.row) + 1
      return h('div', index.toString())
    }
  },
  {
    accessorKey: 'ip_address',
    header: 'IP Адрес'
  },
  {
    accessorKey: 'serial_number',
    header: 'Серийный номер'
  },
  {
    accessorKey: 'model_name',
    header: 'Имя модели'
  },
  {
    id: 'status',
    header: 'Статус',
    cell: (info: any) => {
      const serial = info.row.original.serial_number
      return h('div', statuses.value[serial] || 'активная')
    }
  },
  {
    id: 'actions',
    header: 'Действия',
    cell: ({ row }: { row: Row<Camera> }) => {
      const camera = row.original
      const toggleStatus = () => {
        const current  = statuses.value[camera.serial_number] || 'активная'
        statuses.value[camera.serial_number] = current === 'активная' ? 'включена' : 'активная'
      }
      const openEditModal = async () => {
        currentCamera.value = camera
        try {
          const response = await fetch(`/api/camera-settings/${camera.ip_address}`)
          const data = await response.json()
          const settings: CameraSettings = {
            width: data.settings?.width ?? cameraSettingsByIp[camera.ip_address].width,
            height: data.settings?.height ?? cameraSettingsByIp[camera.ip_address].height,
            offset_x: data.settings?.offset_x ?? cameraSettingsByIp[camera.ip_address].offset_x,
            offset_y: data.settings?.offset_y ?? cameraSettingsByIp[camera.ip_address].offset_y,
            pixel_format: data.settings?.pixel_format ?? cameraSettingsByIp[camera.ip_address].pixel_format,
            fps: data.settings?.fps ?? cameraSettingsByIp[camera.ip_address].fps,
            exposure: data.settings?.exposure ?? cameraSettingsByIp[camera.ip_address].exposure,
            exposure_mode: data.settings?.exposure_mode ?? cameraSettingsByIp[camera.ip_address].exposure_mode,
            gain: data.settings?.gain ?? cameraSettingsByIp[camera.ip_address].gain,
            gev_scpd: data.settings?.gev_scpd ?? cameraSettingsByIp[camera.ip_address].gev_scpd
          }
          editingSettings.value = reactive(settings)
          isModalOpen.value = true
        } catch (error) {
          console.error('Ошибка при получении:', error)
          editingSettings.value = reactive({ ...cameraSettingsByIp[camera.ip_address] })
          isModalOpen.value = true
        }
      }
      return h(CameraActions, {
        camera,
        onEdit: openEditModal,
        onDelete: () => console.log('Удалить', camera),
        onPreview: () => console.log('Просмотр', camera),
        onToggleStatus: toggleStatus
      })
    }
  }
]

const saveSettings = async () => {
  if (currentCamera.value && editingSettings.value) {
    const ip = currentCamera.value.ip_address
    try {
      const settingsToSave = {
        width: editingSettings.value.width ?? null,
        height: editingSettings.value.height ?? null,
        offset_x: editingSettings.value.offset_x ?? null,
        offset_y: editingSettings.value.offset_y ?? null,
        pixel_format: editingSettings.value.pixel_format ?? null,
        fps: editingSettings.value.fps ?? null,
        exposure: editingSettings.value.exposure ?? null,
        exposure_mode: editingSettings.value.exposure_mode ?? null,
        gain: editingSettings.value.gain ?? null,
        gev_scpd: editingSettings.value.gev_scpd ?? null
      }
      await fetch(`/api/camera-settings/${ip}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToSave)
      })
      Object.assign(cameraSettingsByIp[ip], editingSettings.value)
    } catch (error) {
      console.error('Неудалось сохранить настройки камеры:', error)
    }
  }
  isModalOpen.value = false
}
</script>

<template>
  <div class="container mx-auto max-w-4xl mt-8">
    <DataTable :columns="columns" :data="cameras" />
  </div>
  <EditCameraSettings
    :open="isModalOpen"
    :camera="currentCamera"
    :settings="editingSettings"
    @update:open="isModalOpen = $event"
    @save="saveSettings"
  />
</template>
