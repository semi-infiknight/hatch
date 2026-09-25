import { Suspense } from "react"
import { LaunchForm } from "@/components/launch/launch-form"

export default function LaunchPage() {
  return (
    <Suspense fallback={null}>
      <LaunchForm />
    </Suspense>
  )
}
