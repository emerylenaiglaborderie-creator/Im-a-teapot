<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { HttpError } from '../data/httpErrors'
import { categoryColors } from '../data/httpErrors'

const props = defineProps<{ errors: HttpError[] }>()
const emit = defineEmits<{ select: [error: HttpError] }>()

const activeIndex = ref(0)
const animating   = ref(false)

watch(() => props.errors, () => {
  activeIndex.value = 0
  animating.value = true
  setTimeout(() => { animating.value = false }, 500)
})

function goTo(index: number) {
  const total = props.errors.length
  activeIndex.value = ((index % total) + total) % total
}
function prev() { goTo(activeIndex.value - 1) }
function next() { goTo(activeIndex.value + 1) }

const visibleCards = computed(() => {
  const total = props.errors.length
  if (total === 0) return []
  return [-2, -1, 0, 1, 2].map(offset => {
    const i = ((activeIndex.value + offset) % total + total) % total
    return { error: props.errors[i], index: i, offset }
  })
})

const dots = computed(() => {
  const total = props.errors.length
  if (total <= 9) return Array.from({ length: total }, (_, i) => i)
  const start = Math.max(0, Math.min(activeIndex.value - 4, total - 9))
  return Array.from({ length: 9 }, (_, i) => start + i)
})

function cardStyle(offset: number) {
  const abs = Math.abs(offset)
  if (offset === 0 && animating.value) return { zIndex: 10, opacity: 1 }

  const scale      = abs === 0 ? 1    : abs === 1 ? 0.84  : 0.7
  const translateX = abs === 0 ? 0    : offset * 185
  const translateY = abs === 0 ? 0    : abs === 1 ? 18    : 34
  const opacity    = abs === 0 ? 1    : abs === 1 ? 0.82  : 0.55
  const zIndex     = 10 - abs * 3

  return {
    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
    zIndex, opacity,
  }
}

function cardColor(error: HttpError) {
  return categoryColors[error.category] ?? '#E05C60'
}

function cardGlow(color: string) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, 0.5)`
}

function onKeydown(e: KeyboardEvent) {
  if (!props.errors.length) return
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'ArrowRight') next()
}
</script>

<template>
  <section class="carousel-section" @keydown="onKeydown" tabindex="0">

    <div class="carousel-row">
      <!-- Prev -->
      <button class="nav-btn" @click="prev" aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <!-- Cards -->
      <div class="cards-track">
        <div
          v-for="{ error, index, offset } in visibleCards"
          :key="error.code"
          class="card"
          :class="{ active: offset === 0, animating: offset === 0 && animating }"
          :style="{
            ...cardStyle(offset),
            '--card-color': cardColor(error),
            '--card-glow':  cardGlow(cardColor(error))
          }"
          @click="offset === 0 ? emit('select', error) : goTo(index)"
        >
          <span class="cat-tag">{{ error.category }}</span>
          <span class="card-code">{{ error.code }}</span>
          <span class="card-name">{{ error.name }}</span>
          <span v-if="offset === 0" class="explore-hint">tap to explore →</span>
        </div>
      </div>

      <!-- Next -->
      <button class="nav-btn" @click="next" aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>

    <!-- Dot indicators -->
    <div class="dots" role="tablist">
      <button
        v-for="i in dots"
        :key="i"
        class="dot"
        :class="{ active: i === activeIndex }"
        @click="goTo(i)"
        :aria-label="`Go to error ${errors[i]?.code}`"
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
  0%   { transform: translateX(0) translateY(0) scale(0.7); opacity: 0; }
  65%  { transform: translateX(0) translateY(0) scale(1.04); opacity: 1; }
  100% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
}

@keyframes cardGlowPulse {
  0%, 100% { box-shadow: 0 20px 50px rgba(0,0,0,0.18), 0 0 30px var(--card-glow); }
  50%       { box-shadow: 0 24px 65px rgba(0,0,0,0.22), 0 0 55px var(--card-glow); }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Section ── */
.carousel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 32px 0 56px;
  outline: none;
  animation: fadeSlideUp 0.6s 0.15s ease-out both;
}

/* ── Row (arrows + track) ── */
.carousel-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: center;
}

/* ── Nav buttons ── */
.nav-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid rgba(224, 92, 96, 0.22);
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #a06060;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.18s;

  & svg { width: 20px; height: 20px; }

  &:hover {
    background: rgba(255, 255, 255, 0.75);
    border-color: var(--coral);
    color: var(--coral);
    transform: scale(1.1);
  }

  &:active { transform: scale(0.94); }
}

/* ── Track ── */
.cards-track {
  position: relative;
  height: 250px;
  flex: 1;
  max-width: 720px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Card ── */
.card {
  position: absolute;
  width: 240px;
  height: 190px;
  border-radius: 24px;
  background: var(--card-color, #E05C60);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.3s ease,
              box-shadow 0.4s ease;
  user-select: none;
}

/* Dot pattern + gradient highlight */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1px),
    linear-gradient(145deg, rgba(255,255,255,0.22) 0%, transparent 55%);
  background-size: 18px 18px, 100% 100%;
  pointer-events: none;
  z-index: 0;
}

/* Shimmer on active */
.card.active::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -80%;
  width: 55%;
  height: 200%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent);
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

/* ── Card content ── */
.cat-tag {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.35);
  padding: 3px 10px;
  border-radius: 99px;
  text-transform: uppercase;
  position: relative;
  z-index: 2;
}

.card-code {
  font-family: var(--mono);
  font-size: 54px;
  font-weight: 700;
  color: white;
  line-height: 1;
  text-shadow: 0 2px 20px rgba(0,0,0,0.2);
  position: relative;
  z-index: 2;
}

.card-name {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.explore-hint {
  font-family: var(--mono);
  font-size: 10px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
  margin-top: 4px;
}

/* ── Dots ── */
.dots {
  display: flex;
  gap: 7px;
  align-items: center;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 99px;
  border: none;
  background: rgba(224, 92, 96, 0.28);
  cursor: pointer;
  padding: 0;
  transition: width 0.25s ease, background 0.25s ease, transform 0.2s ease;

  &.active {
    width: 22px;
    background: var(--coral);
  }

  &:hover:not(.active) {
    background: rgba(224, 92, 96, 0.55);
    transform: scale(1.3);
  }
}
</style>
