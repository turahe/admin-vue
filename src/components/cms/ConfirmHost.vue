<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useConfirmStore } from '@/stores/feedback'

const confirm = useConfirmStore()
const open = computed({
  get: () => confirm.request !== null,
  set: (value: boolean) => {
    if (!value) confirm.answer(false)
  },
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent v-if="confirm.request" class="max-w-md p-6">
      <DialogHeader>
        <DialogTitle>{{ confirm.request.title }}</DialogTitle>
        <DialogDescription>{{ confirm.request.message }}</DialogDescription>
      </DialogHeader>
      <DialogFooter class="mt-6 flex justify-end gap-2">
        <Button variant="outline" @click="confirm.answer(false)">Cancel</Button>
        <Button variant="destructive" @click="confirm.answer(true)">
          {{ confirm.request.confirmLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
