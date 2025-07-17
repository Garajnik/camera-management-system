<script setup lang="ts">
import { Calendar, Home, Inbox } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "Просмотр",    url: "/",      icon: Home },
  { title: "Редактирование", url: "/edit", icon: Inbox },
  { title: "JSON Config",  url: "/config", icon: Calendar },
]
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Приложение</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="item in items"
              :key="item.title"
            >
              <SidebarMenuButton asChild>
                <router-link :to="item.url" class="flex items-center">
                  <component :is="item.icon" class="mr-2" />
                  <span>{{ item.title }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
