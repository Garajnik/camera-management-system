export interface Camera {
  ip_address: string
  serial_number: string
  model_name: string
}

export interface CameraSettings {
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

export interface DefaultCameraConfig {
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
