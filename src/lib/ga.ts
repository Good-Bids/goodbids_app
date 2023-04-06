
export const pageview = (url: string): void => {
    (window as any).gtag('config', 'G-CXJ4181QHF', {
        page_path: url,
    })
}

export const event = ({ action, params }: { action: string, params: any }): void => {
    (window as any).gtag('event', action, params)
}