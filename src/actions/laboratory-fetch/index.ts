"use server"

export interface LabProject {
  title: string
  url: string
  description: string | null
  cover: { url: string } | null
}

export const fetchLaboratory = async (): Promise<
  {
    title: string
    url: string
    description: string | null
    cover: { url: string } | null
  }[]
> => []
