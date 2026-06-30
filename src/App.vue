<script setup lang="ts">
import { ref, computed } from 'vue'
import HeroSection from './components/HeroSection.vue'
import ErrorCarousel from './components/ErrorCarousel.vue'
import ErrorModal from './components/ErrorModal.vue'
import AboutSection from './components/AboutSection.vue'
import { httpErrors } from './data/httpErrors'
import type { HttpError } from './data/httpErrors'

const search = ref('')
const selectedError = ref<HttpError | null>(null)

const filteredErrors = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return httpErrors
  return httpErrors.filter(
    (e) =>
      String(e.code).includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div id="app">
    <HeroSection v-model="search" />
    <ErrorCarousel :errors="filteredErrors" @select="selectedError = $event" />
    <ErrorModal :error="selectedError" @close="selectedError = null" />
    <AboutSection />
  </div>
</template>
