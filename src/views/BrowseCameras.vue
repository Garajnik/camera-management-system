<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { h } from 'vue'
import DataTable from '../components/BrowseCameras/data-table.vue'
import CameraActions from '../components/BrowseCameras/CameraActions.vue'
import EditCameraSettings from '../components/EditCameraSettings.vue'
import type { Row } from '@tanstack/table-core'
import { fetchAvailableCameras, fetchCameraSettings, saveCameraSettings } from '../services/cameraService.ts'
import type { Camera, CameraSettings } from '../services/types'

const cameras = ref<Camera[]>([])
const statuses = ref<Record<string, 'активная' | 'включена'>>({})
const cameraSettingsByIp = reactive<Record<string, CameraSettings>>({})
const isModalOpen = ref(false)
const currentCamera = ref<Camera | null>(null)
const editingSettings = ref<CameraSettings | null>(null)

onMounted(async () => {
  try {
    const fetchedCameras = await fetchAvailableCameras()
    cameras.value = fetchedCameras
    fetchedCameras.forEach(camera => {
      statuses.value[camera.serial_number] = 'активная'
      cameraSettingsByIp[camera.ip_address] = {
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
  } catch (error) {
    console.error('Ошибка при получении камер', error)
  }
})

const openEditModal = async (camera: Camera) => {
  currentCamera.value = camera
  try {
    const settings = await fetchCameraSettings(camera.ip_address)
    editingSettings.value = reactive({
      width: settings.width ?? cameraSettingsByIp[camera.ip_address].width,
      height: settings.height ?? cameraSettingsByIp[camera.ip_address].height,
      offset_x: settings.offset_x ?? cameraSettingsByIp[camera.ip_address].offset_x,
      offset_y: settings.offset_y ?? cameraSettingsByIp[camera.ip_address].offset_y,
      pixel_format: settings.pixel_format ?? cameraSettingsByIp[camera.ip_address].pixel_format,
      fps: settings.fps ?? cameraSettingsByIp[camera.ip_address].fps,
      exposure: settings.exposure ?? cameraSettingsByIp[camera.ip_address].exposure,
      exposure_mode: settings.exposure_mode ?? cameraSettingsByIp[camera.ip_address].exposure_mode,
      gain: settings.gain ?? cameraSettingsByIp[camera.ip_address].gain,
      gev_scpd: settings.gev_scpd ?? cameraSettingsByIp[camera.ip_address].gev_scpd
    })
    isModalOpen.value = true
  } catch (error) {
    console.error('Ошибка при получении:', error)
    editingSettings.value = reactive({ ...cameraSettingsByIp[camera.ip_address] })
    isModalOpen.value = true
  }
}

const saveSettings = async () => {
  if (currentCamera.value && editingSettings.value) {
    const ip = currentCamera.value.ip_address
    try {
      const settingsToSave = {
        width: editingSettings.value.width,
        height: editingSettings.value.height,
        offset_x: editingSettings.value.offset_x,
        offset_y: editingSettings.value.offset_y,
        pixel_format: editingSettings.value.pixel_format,
        fps: editingSettings.value.fps,
        exposure: editingSettings.value.exposure,
        exposure_mode: editingSettings.value.exposure_mode,
        gain: editingSettings.value.gain,
        gev_scpd: editingSettings.value.gev_scpd
      }
      await saveCameraSettings(ip, settingsToSave)
      Object.assign(cameraSettingsByIp[ip], editingSettings.value)
    } catch (error) {
      console.error('Неудалось сохранить настройки камеры:', error)
    }
  }
  isModalOpen.value = false
}

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
        const current = statuses.value[camera.serial_number] || 'активная'
        statuses.value[camera.serial_number] = current === 'активная' ? 'включена' : 'активная'
      }
      return h(CameraActions, {
        camera,
        onEdit: () => openEditModal(camera),
        onDelete: () => console.log('Удалить', camera),
        onPreview: () => console.log('Просмотр', camera),
        onToggleStatus: toggleStatus
      })
    }
  }
]
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
