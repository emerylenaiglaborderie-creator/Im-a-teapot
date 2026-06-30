<script setup lang="ts">
import logoUrl from '../assets/logo.png'
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <section class="hero">
    <div class="hero-box">
      <div class="logo-wrap">
        <img class="teapot-logo" :src="logoUrl" alt="I'm a Teapot logo" />
      </div>

      <div class="hero-title">
        <span class="title-main">HTTP Status Codes</span>
        <span class="title-sub">explore &amp; learn</span>
      </div>

      <div class="search-wrap">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="search an error..."
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="scroll-hint" aria-hidden="true">
      <span class="scroll-label">scroll</span>
      <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-12px) rotate(2deg); }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4; }
  50%       { transform: translateX(-50%) translateY(8px); opacity: 0.8; }
}

.hero {
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: fadeSlideUp 0.6s ease-out both;
}

.hero-box {
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 28px;
  padding: 48px 48px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow:
    0 8px 40px rgba(224, 92, 96, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.65) inset;
}

.logo-wrap {
  display: flex;
  justify-content: center;
}

.teapot-logo {
  width: 160px;
  height: auto;
  filter: drop-shadow(0 10px 28px rgba(224, 92, 96, 0.5));
  animation: float 4.5s ease-in-out infinite;
  transform-origin: center bottom;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.title-main {
  font-family: var(--mono);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #E05C60 0%, #c0404a 50%, #a03040 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-sub {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 4px;
  color: #c09090;
  text-transform: uppercase;
}

.search-wrap {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #c09090;
  pointer-events: none;
  transition: color 0.25s;
}

.search-wrap:focus-within .search-icon {
  color: var(--coral);
}

.search-input {
  width: 100%;
  padding: 13px 20px 13px 42px;
  border: 1.5px solid rgba(224, 92, 96, 0.2);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.65);
  font-family: var(--mono);
  font-size: 15px;
  color: #5a3535;
  outline: none;
  box-sizing: border-box;
  transition: background 0.25s, box-shadow 0.25s, border-color 0.25s;

  &::placeholder {
    color: #c09090;
  }

  &:focus {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(224, 92, 96, 0.45);
    box-shadow: 0 0 0 4px rgba(224, 92, 96, 0.12);
  }
}

.scroll-hint {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  animation: scrollBounce 2.2s ease-in-out infinite;
  pointer-events: none;
}

.scroll-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(160, 80, 80, 0.5);
}

.scroll-arrow {
  width: 20px;
  height: 20px;
  color: rgba(160, 80, 80, 0.5);
}
</style>
