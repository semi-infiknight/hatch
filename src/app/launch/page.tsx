import { redirect } from "next/navigation"

export default function LaunchPage() {
  redirect("/terminal?stock=TTWO&sku=VICE")
}
