<script setup lang="ts">
import { defineProps } from 'vue'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-vue-next'

interface Props {
  onEdit: () => void
  onDelete: () => void
  onPreview: () => void
  onToggleStatus: () => void
}

const props = defineProps<Props>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Открыть окно</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="props.onEdit">Редактировать</DropdownMenuItem>
      <DropdownMenuItem @click="props.onDelete">Удалить</DropdownMenuItem>
      <DropdownMenuItem @click="props.onPreview">Просмотр</DropdownMenuItem>
      <DropdownMenuItem @click="props.onToggleStatus">Изменить статус</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
