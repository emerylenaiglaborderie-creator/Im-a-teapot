<script setup lang="ts">
import { watch } from 'vue'
import type { HttpError } from '../data/httpErrors'
import { categoryColors } from '../data/httpErrors'

const props = defineProps<{ error: HttpError | null }>()
const emit = defineEmits<{ close: [] }>()

watch(() => props.error, (val) => {
  if (val) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="error"
        class="backdrop"
        @click="onBackdropClick"
        @keydown="onKeydown"
        tabindex="-1"
      >
        <div
          class="modal"
          role="dialog"
          :style="{ '--modal-color': categoryColors[error.category] }"
        >
          <button class="close-btn" @click="emit('close')" aria-label="Fermer">✕</button>

          <!-- Header -->
          <div class="modal-header">
            <span class="badge">{{ error.category }}</span>
            <h2 class="code">{{ error.code }}</h2>
            <h3 class="name">{{ error.name }}</h3>
          </div>

          <!-- Sections -->
          <div class="modal-body">
            <section class="info-section">
              <div>
                <h4>Description</h4>
                <p>{{ error.description }}</p>
              </div>
            </section>

            <div class="divider" />

            <section class="info-section">
              <div>
                <h4>How to correct it</h4>
                <p>{{ error.fix }}</p>
              </div>
            </section>

            <div class="divider" />

            <section class="info-section">
              <div>
                <h4>Origine</h4>
                <p>{{ error.origin }}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(80, 20, 25, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal {
  background: rgba(255, 252, 252, 0.97);
  border-radius: 28px;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  border-top: 5px solid var(--modal-color, #E05C60);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(224, 92, 96, 0.08);
  border: 1px solid rgba(224, 92, 96, 0.15);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 14px;
  color: #b07070;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, transform 0.3s ease;

  &:hover {
    background: rgba(224, 92, 96, 0.16);
    color: #E05C60;
    transform: scale(1.1) rotate(90deg);
  }
}

.modal-header {
  padding: 32px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-bottom: 1px solid #f0e8e8;
}

.badge {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: white;
  background: var(--modal-color, #E05C60);
  padding: 4px 12px;
  border-radius: 99px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.code {
  font-family: 'Courier New', monospace;
  font-size: 52px;
  font-weight: 700;
  color: var(--modal-color, #E05C60);
  margin: 10px 0 0;
  line-height: 1;
  text-shadow: 0 0 40px var(--modal-color, #E05C60);
  opacity: 1;
}

.name {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #5a3535;
  margin: 6px 0 0;
}

.modal-body {
  padding: 8px 32px 32px;
}

.info-section {
  display: flex;
  gap: 16px;
  padding: 20px 0;
  align-items: flex-start;
}

h4 {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--modal-color, #E05C60);
  margin: 0 0 8px;
  opacity: 0.85;
}

p {
  font-size: 15px;
  line-height: 1.7;
  color: #5a3535;
  margin: 0;
}

.divider {
  height: 1px;
  background: #f0e8e8;
}

/* Transitions */
.modal-enter-active {
  transition: opacity 0.3s ease;
}
.modal-leave-active {
  transition: opacity 0.22s ease;
}
.modal-enter-active .modal {
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.modal-leave-active .modal {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal {
  transform: scale(0.88) translateY(48px);
  opacity: 0;
}
.modal-leave-to .modal {
  transform: scale(0.96) translateY(-12px);
  opacity: 0;
}
</style>
