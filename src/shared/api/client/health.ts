import createClient from 'openapi-fetch'
import type { paths, components } from '@/shared/api/schemas/openapi'

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
})

export type HealthResponse = components['schemas']['HealthResponse']

export const healthApi = {
  async check(): Promise<HealthResponse> {
    const { data, error } = await client.GET('/health')
    
    if (error) {
      throw new Error(`Health check failed: ${error}`)
    }
    
    return data
  },
}