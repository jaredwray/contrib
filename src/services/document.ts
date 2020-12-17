export function getTypedElementById<T extends HTMLElement>(id: string) {
    return document.getElementById(id) as T
}   
