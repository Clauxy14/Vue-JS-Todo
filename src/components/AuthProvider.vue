<script setup lang="ts">
import { provideAuth } from '../composables/useAuthContext'

provideAuth()
</script>

<template>
  <slot />
</template>
