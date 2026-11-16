import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ToastItem {
  id: number
  message: string
  tone: 'success' | 'error'
}

export const useToastStore = defineStore('toast', () => {
  const items = ref<ToastItem[]>([])
  let nextId = 1

  function push(message: string, tone: ToastItem['tone'] = 'success') {
    const id = nextId
    nextId += 1
    items.value = [...items.value, { id, message, tone }]
    window.setTimeout(() => {
      items.value = items.value.filter((item) => item.id !== id)
    }, 3600)
  }

  function dismiss(id: number) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  return { items, push, dismiss }
})

interface ConfirmRequest {
  title: string
  message: string
  confirmLabel: string
  resolve: (value: boolean) => void
}

export const useConfirmStore = defineStore('confirm', () => {
  const request = ref<ConfirmRequest | null>(null)

  function ask(title: string, message: string, confirmLabel = 'Delete'): Promise<boolean> {
    return new Promise((resolve) => {
      request.value = { title, message, confirmLabel, resolve }
    })
  }

  function answer(value: boolean) {
    request.value?.resolve(value)
    request.value = null
  }

  return { request, ask, answer }
})
