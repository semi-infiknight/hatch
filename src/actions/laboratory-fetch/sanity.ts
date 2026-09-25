export interface LabProject {
  title: string
  url: string
  description: string | null
  cover: null
}

export async function fetchLabProjects(): Promise<LabProject[]> {
  return []
}
