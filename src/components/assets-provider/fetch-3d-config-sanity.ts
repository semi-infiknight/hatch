// ---------------------------------------------------------------------------
// Raw Sanity types returned by GROQ
// ---------------------------------------------------------------------------

interface SanitySpec {
  specId?: string
  title?: string
  value?: string
}

interface SanityInspectableContent {
  inspectableId?: string
  title?: string
  specs?: SanitySpec[]
  description?: unknown
}

interface SanityCameraConfig {
  posX?: number
  posY?: number
  posZ?: number
  tarX?: number
  tarY?: number
  tarZ?: number
  fov?: number
  targetScrollY?: number
  offsetMultiplier?: number
}

interface SanityPostprocessing {
  contrast?: number
  brightness?: number
  exposure?: number
  gamma?: number
  vignetteRadius?: number
  vignetteSpread?: number
  bloomStrength?: number
  bloomRadius?: number
  bloomThreshold?: number
}

interface SanitySceneTab {
  tabName?: string
  tabRoute?: string
  tabHoverName?: string
  tabClickableName?: string
  plusShapeScale?: number
}

interface SanitySceneConfig {
  sceneName?: string
  cameraConfig?: SanityCameraConfig
  postprocessing?: SanityPostprocessing
  tabs?: SanitySceneTab[]
}

interface SanityPhysicsParam {
  title?: string
  value?: number
}

interface SanityPhysicsConfig {
  physicsParams?: SanityPhysicsParam[]
}

export interface SanityThreeDConfigResult {
  // Sub-queries return null when the singleton doesn't exist; consumers must coalesce.
  inspectables: SanityInspectableContent[] | null
  scenes: SanitySceneConfig[] | null
  physics: SanityPhysicsConfig | null
}

// ---------------------------------------------------------------------------
// GROQ — single round-trip fetch for all three types
// ---------------------------------------------------------------------------

const threeDConfigQuery = /* groq */ `{
  "inspectables": *[_type == "inspectablesConfig"][0].inspectables[] {
    inspectableId,
    title,
    specs[] {
      specId,
      title,
      value
    },
    description
  },
  "scenes": *[_type == "scenesConfig"][0].scenes[] {
    sceneName,
    cameraConfig {
      posX, posY, posZ,
      tarX, tarY, tarZ,
      fov,
      targetScrollY,
      offsetMultiplier
    },
    postprocessing {
      contrast,
      brightness,
      exposure,
      gamma,
      vignetteRadius,
      vignetteSpread,
      bloomStrength,
      bloomRadius,
      bloomThreshold
    },
    tabs[] {
      tabName,
      tabRoute,
      tabHoverName,
      tabClickableName,
      plusShapeScale
    }
  },
  "physics": *[_type == "physicsConfig"][0] {
    physicsParams[] {
      title,
      value
    }
  }
}`

const HOME_SCENES: SanityThreeDConfigResult["scenes"] = [
  {
    sceneName: "home",
    cameraConfig: {
      fov: 64.65,
      offsetMultiplier: 0.25,
      posX: 6.26,
      posY: 1.16,
      posZ: -7.57,
      tarX: 5.93,
      tarY: 1.29,
      tarZ: -8.51,
      targetScrollY: -0.1
    },
    postprocessing: {
      bloomRadius: 5,
      bloomStrength: 0.15,
      bloomThreshold: 10,
      brightness: 0.31,
      contrast: 1,
      exposure: 0.54,
      gamma: 0.73,
      vignetteRadius: 0.8,
      vignetteSpread: 0.75
    },
    tabs: []
  }
]

export async function fetchThreeDConfig(): Promise<SanityThreeDConfigResult> {
  return {
    inspectables: [],
    scenes: HOME_SCENES,
    physics: { physicsParams: [] }
  }
}
