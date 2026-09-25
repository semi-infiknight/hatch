"use client"

import { AssetsProvider } from "@/components/assets-provider"
import type { AssetsResult } from "@/components/assets-provider/fetch-assets"
import { InspectableProvider } from "@/components/inspectables/context"
import { CanvasLayer } from "@/components/layout/canvas-layer"
import { SetCanvasMode } from "@/components/layout/set-canvas-mode"
import { NavigationHandler } from "@/components/navigation-handler"

export function StudioScene({ assets }: { assets: AssetsResult }) {
  return (
    <AssetsProvider assets={assets}>
      <InspectableProvider>
        <SetCanvasMode enabled />
        <NavigationHandler />
        <CanvasLayer />
      </InspectableProvider>
    </AssetsProvider>
  )
}
