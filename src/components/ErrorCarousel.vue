<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { HttpError } from '../data/httpErrors'
import { categoryColors } from '../data/httpErrors'

const props = defineProps<{ errors: HttpError[] }>()
const emit = defineEmits<{ select: [error: HttpError] }>()

const activeIndex = ref(0)
const sliderValue = ref(0)
const animating = ref(false)

// Reset + trigger pop animation when filtered list changes (search)
watch(() => props.errors, () => {
  activeIndex.value = 0
  sliderValue.value = 0
  animating.value = true
  setTimeout(() => { animating.value = false }, 500)
})

watch(sliderValue, (val) => {
  activeIndex.value = val
})

function goTo(index: number) {
  activeIndex.value = index
  sliderValue.value = index
}

const visibleCards = computed(() => {
  const total = props.errors.length
  if (total === 0) return []
  const result = []
  for (let offset = -2; offset <= 2; offset++) {
    const i = ((activeIndex.value + offset) % total + total) % total
    result.push({ error: props.errors[i], index: i, offset })
  }
  return result
})

function cardStyle(offset: number) {
  const abs = Math.abs(offset)

  // Let CSS animation handle transform while popping in
  if (offset === 0 && animating.value) {
    return { zIndex: 10, opacity: 1 }
  }

  const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.68
  const translateX = offset * 190
  const translateY = abs === 0 ? 0 : abs === 1 ? 30 : 55
  const zIndex = 10 - abs * 3
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.6

  return {
    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
    zIndex,
    opacity,
  }
}

function cardColor(error: HttpError) {
  return categoryColors[error.category] ?? '#E05C60'
}

function cardGlow(color: string) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, 0.45)`
}

// Keyboard navigation (wraps)
function onKeydown(e: KeyboardEvent) {
  const total = props.errors.length
  if (!total) return
  if (e.key === 'ArrowLeft') goTo((activeIndex.value - 1 + total) % total)
  if (e.key === 'ArrowRight') goTo((activeIndex.value + 1) % total)
}
</script>

<template>
  <section class="carousel-section" @keydown="onKeydown" tabindex="0">
    <div class="cards-track">
      <div
        v-for="{ error, index, offset } in visibleCards"
        :key="error.code"
        class="card"
        :class="{ active: offset === 0, animating: offset === 0 && animating }"
        :style="{
          ...cardStyle(offset),
          '--card-color': cardColor(error),
          '--card-glow': cardGlow(cardColor(error))
        }"
        @click="offset === 0 ? emit('select', error) : goTo(index)"
      >
        <span class="card-code">ERROR {{ error.code }}</span>
        <span class="card-name">{{ error.name.toUpperCase() }}</span>
      </div>
    </div>

    <div class="slider-wrap">
      <input
        type="range"
        class="slider"
        :min="0"
        :max="errors.length - 1"
        v-model.number="sliderValue"
      />
    </div>
  </section>
</template>

<style scoped>
@keyframes shimmer {
  0%   { left: -80%; }
  100% { left: 120%; }
}

@keyframes cardPop {
  0%   { transform: translateX(0) translateY(0) scale(0.65); opacity: 0; }
  65%  { transform: translateX(0) translateY(0) scale(1.06); opacity: 1; }
  100% { transform: translateX(0) translateY(0) scale(1);    opacity: 1; }
}

@keyframes cardGlowPulse {
  0%, 100% { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18), 0 0 30px var(--card-glow); }
  50%       { box-shadow: 0 24px 72px rgba(0, 0, 0, 0.22), 0 0 55px var(--card-glow); }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.carousel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  padding: 24px 0 48px;
  outline: none;
  animation: fadeSlideUp 0.6s 0.15s ease-out both;
}

.cards-track {
  position: relative;
  height: 260px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 26px;
  background: var(--card-color, #E05C60);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.3s ease,
              box-shadow 0.4s ease;
  user-select: none;
}

/* Gradient highlight overlay */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}

/* Shimmer sweep on active card */
.card.active::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -80%;
  width: 55%;
  height: 200%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.28),
    transparent
  );
  transform: skewX(-18deg);
  animation: shimmer 4s linear infinite;
  pointer-events: none;
  z-index: 1;
}

.card.active {
  cursor: default;
  animation: cardGlowPulse 3s ease-in-out infinite;
}

.card.active.animating {
  animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
             cardGlowPulse 3s 0.5s ease-in-out infinite;
}

.card-code,
.card-name {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: white;
  text-align: center;
  line-height: 1.2;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}

.card-code {
  font-size: 22px;
  letter-spacing: 1px;
}

.card-name {
  font-size: 18px;
  letter-spacing: 0.5px;
  padding: 0 16px;
}

/* Slider */
.slider-wrap {
  width: 60%;
  max-width: 500px;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(224, 92, 96, 0.3);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #E05C60;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 0 0 4px rgba(224, 92, 96, 0.18);

    &:hover {
      transform: scale(1.3);
      box-shadow: 0 0 0 6px rgba(224, 92, 96, 0.25);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #E05C60;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 0 4px rgba(224, 92, 96, 0.18);
  }
}
</style>
