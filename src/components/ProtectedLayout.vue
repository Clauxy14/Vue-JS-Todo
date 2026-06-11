<script setup lang="ts">
import { RouterView } from 'vue-router'
import ProtectedRoute from './ProtectedRoute.vue'
import WebSocketProvider from './WebSocketProvider.vue'
</script>

<template>
  <ProtectedRoute>
    <WebSocketProvider>
      <RouterView />
    </WebSocketProvider>
  </ProtectedRoute>
</template>
