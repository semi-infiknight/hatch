import { Geist } from "next/font/google"
import { fetchAssets } from "@/components/assets-provider/fetch-assets"
import { HomeLanding } from "@/components/studio/home"
import { StudioScene } from "@/components/studio/scene"
import "./studio-landing.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--bs-font",
})

export default async function Home() {
  const assets = await fetchAssets()

  return (
    <div className={`${geist.variable} bs flex-1`}>
      <StudioScene assets={assets} />
      <HomeLanding />
    </div>
  )
}

/*
Previous Hatch landing, kept in src/components/landing/:
Hero, Launched, Mechanism, Pairs, Flywheel, Features, ClosingCta.
*/
