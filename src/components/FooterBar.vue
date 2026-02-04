<script setup>
import { containerMaxW } from '@/config.js'
import BaseLevel from '@/components/BaseLevel.vue'
import JustboilLogo from '@/components/JustboilLogo.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-6 py-2" :class="containerMaxW">
    <BaseLevel>
      <div class="flex flex-col items-center justify-center gap-6 lg:flex-row lg:justify-start">
        <b>&copy;{{ year }}, <a href="#" target="_blank">Ramanantsoa Anja Nomena</a></b>
        <slot />
      </div>
      
    </BaseLevel>
  </footer>
</template>
