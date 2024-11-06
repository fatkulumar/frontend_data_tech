import type { UseFetchOptions } from 'nuxt/app'

export function useApiFetch<T> (path: string | (() => string), options: UseFetchOptions<T> = {}) {
    
    const config = useRuntimeConfig();
    
    let headers: any = {
        accept: "application/json",
        referer: `${config.public.apiReferer}`,
    }

    const XSRFTOKEN = useCookie('XSRF-TOKEN');

    if(XSRFTOKEN.value) {
        headers['X-XSRF-TOKEN'] = XSRFTOKEN.value as string;    
    }

    if(process.server) {
        headers = {
            ...headers,
            ...useRequestHeaders(['referer','cookie'])
        }
    }

    return useFetch(`${config.public.apiBase}${path}`, {
        credentials: "include",
        watch: false,
        ...options,
        headers: {
            ...headers,
            ...options?.headers
        }
    })
}