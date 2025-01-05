'use server'

import { LoginCredentials } from '@/types'
import { cookies } from 'next/headers'

type HttpMethods = 'POST' | 'PATCH' | 'DELETE'

export type ApiResponse<T> = {
  data: T | undefined
  error: Error | undefined
  status: Response['status']
}

/**
 * Make a POST request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP request method
 * @param body The object or array to pass as the request body
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  method?: HttpMethods,
  body?: T,
  auth?: boolean
): Promise<ApiResponse<T>>

/**
 * Make a request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param options The options to pass to `fetch()`
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
  auth?: boolean
): Promise<ApiResponse<T>>

/**
 * Make a POST request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP request method
 * @param body The object or array to pass as the request body
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  body?: LoginCredentials,
  auth?: boolean
): Promise<ApiResponse<T>>


/**
 * Make a POST request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP request method
 * @param body The object or array to pass as the request body
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  body?: {
    token: string
  },
  auth?: boolean
): Promise<ApiResponse<T>>


/**
 * Make a POST request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP request method
 * @param body The object or array to pass as the request body
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  body?: T,
  auth?: boolean
): Promise<ApiResponse<T>>


export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  authOrBody?: boolean | T,
  auth?: boolean
): Promise<ApiResponse<T>> {
  const options = await buildFetchOptions<T>(
    optionsOrMethod,
    authOrBody,
    auth
  )

  const fnReturn: {
    data: T | undefined,
    error: Error | undefined,
    status: number
  } = {
    data: undefined,
    error: undefined,
    status: 0
  }

  try {
    const baseUrl = process.env.API_GATEWAY_URL
    const res = await fetch(
      `${baseUrl}/${endpoint}`,
      options
    )

    if (res.status >= 500) {
      throw new Error('Something went wrong')
    }
  
    const json = await res.json()
  
    if (res.status >= 400) {
      throw new Error(json.message)
    }
    
    fnReturn.data = json
  } catch (error) {
    fnReturn.error = error instanceof Error ? error :
      new Error('Something went wrong')
  }

  return fnReturn
}


export async function buildFetchOptions<T>(
  optionsOrMethod: RequestInit | HttpMethods | undefined,
  authOrBody: boolean | T | undefined,
  auth: boolean | undefined
) {
  const cookie = (await cookies()).get('session')?.value
  let options: RequestInit = {}

  if (typeof optionsOrMethod === 'string') {
    options.method = optionsOrMethod
    options.body = JSON.stringify(authOrBody)
  } else if (optionsOrMethod) {
    options = optionsOrMethod
  }

  if (authOrBody === true || auth) {
    /**
     * The Authorization header should always 
     * override any existing header.
     */
    options.headers = {
      ...options.headers,
      'Cookie': `session=${cookie}`
    }
  }

  if (/^(post|patch)$/i.test(options.method || '')) {
    /**
     * The Content-Type header should always be 
     * overridable of any existing header.
     */
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  return options
}