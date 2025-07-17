import type { Camera, CameraSettings, DefaultCameraConfig } from './types.ts'

export async function fetchDefaultConfig(): Promise<DefaultCameraConfig> {
  const response = await fetch('https://h-grabber-api.research.dmdevelopment.ru/default_camera_settings')
  if (!response.ok) {
    throw new Error('Failed to fetch default config')
  }
  const data = await response.json()
  return {
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
}

export async function saveDefaultConfig(config: DefaultCameraConfig): Promise<void> {
  const configToSave = {
    width: config.width ?? null,
    height: config.height ?? null,
    offset_x: config.offset_x ?? null,
    offset_y: config.offset_y ?? null,
    pixel_format: config.pixel_format ?? null,
    fps: config.fps ?? null,
    exposure: config.exposure ?? null,
    exposure_mode: config.exposure_mode ?? null,
    gain: config.gain ?? null,
    gev_scpd: config.gev_scpd ?? null
  }
  const response = await fetch('https://h-grabber-api.research.dmdevelopment.ru/default_camera_settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configToSave)
  })
  if (!response.ok) {
    throw new Error('Failed to save default config')
  }
}

export async function fetchAvailableCameras(): Promise<Camera[]> {
  const response = await fetch('https://h-grabber-api.research.dmdevelopment.ru/available_gige_cameras')
  if (!response.ok) {
    throw new Error('Failed to fetch cameras')
  }
  const data = await response.json()
  return data
}

export async function fetchCameraSettings(ipAddress: string): Promise<CameraSettings> {
  const response = await fetch(`https://h-grabber-api.research.dmdevelopment.ru/camera-settings/${ipAddress}`)
  if (!response.ok) {
    throw new Error('Failed to fetch camera settings')
  }
  const data = await response.json()
  return data.settings
}

export async function saveCameraSettings(ipAddress: string, settings: CameraSettings): Promise<void> {
  const response = await fetch(`https://h-grabber-api.research.dmdevelopment.ru/camera-settings/${ipAddress}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  })
  if (!response.ok) {
    throw new Error('Failed to save camera settings')
  }
}

export async function fetchConfig() {
  const res = await fetch('https://h-grabber-api.research.dmdevelopment.ru/config')
  if (!res.ok) {
    throw new Error('Ошибка сети')
  }
  return await res.json()
}

export async function saveConfig(data: any) {
  const res = await fetch('https://h-grabber-api.research.dmdevelopment.ru/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    throw new Error(`Ошибка сервера: ${res.status}`)
  }
  return true
}
