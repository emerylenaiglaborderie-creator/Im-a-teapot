<script setup lang="ts">
import { ref, computed } from 'vue'
import { httpErrors, categoryColors } from '../data/httpErrors'
import type { HttpError } from '../data/httpErrors'

const TOTAL = 8

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildOptions(correct: HttpError): HttpError[] {
  const others = httpErrors.filter(e => e.code !== correct.code)
  return shuffle([correct, ...shuffle(others).slice(0, 3)])
}

interface Question {
  error: HttpError
  options: HttpError[]
}

const questions = ref<Question[]>([])
const current   = ref(0)
const score     = ref(0)
const selected  = ref<number | null>(null)
const done      = ref(false)

function initQuiz() {
  questions.value = shuffle(httpErrors).slice(0, TOTAL).map(e => ({
    error: e,
    options: buildOptions(e),
  }))
  current.value  = 0
  score.value    = 0
  selected.value = null
  done.value     = false
}

initQuiz()

const q          = computed(() => questions.value[current.value])
const isCorrect  = computed(() => selected.value === q.value?.error.code)
const progress   = computed(() => ((current.value + (selected.value !== null ? 1 : 0)) / TOTAL) * 100)

const finalMsg = computed(() => {
  const pct = score.value / TOTAL
  if (pct === 1)    return "Perfect score! You're an HTTP master."
  if (pct >= 0.75)  return 'Great job — you know your status codes!'
  if (pct >= 0.5)   return 'Not bad. Keep browsing to learn more.'
  return 'Better luck next time. Explore the errors and come back!'
})

function pick(code: number) {
  if (selected.value !== null) return
  selected.value = code
  if (code === q.value.error.code) score.value++
}

function next() {
  if (current.value < TOTAL - 1) {
    current.value++
    selected.value = null
  } else {
    done.value = true
  }
}

function optionClass(code: number) {
  if (selected.value === null) return 'opt-idle'
  if (code === q.value.error.code) return 'opt-correct'
  if (code === selected.value)     return 'opt-wrong'
  return 'opt-dimmed'
}
</script>

<template>
  <section class="quiz-section">

    <div class="quiz-header">
      <span class="eyebrow">Quiz</span>
      <h2 class="quiz-title">What HTTP error am I?</h2>
      <p class="quiz-lead">Read the clue and guess the right status code.</p>
    </div>

    <div class="quiz-card">

      <!-- Progress bar -->
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progress + '%' }" />
      </div>

      <!-- Question / End -->
      <Transition name="slide" mode="out-in">

        <!-- End screen -->
        <div v-if="done" key="end" class="end-screen">
          <div class="final-score">
            {{ score }}<span class="final-total">/{{ TOTAL }}</span>
          </div>
          <p class="final-msg">{{ finalMsg }}</p>
          <button class="action-btn retry-btn" @click="initQuiz">Play again</button>
        </div>

        <!-- Question -->
        <div v-else :key="current" class="question">

          <div class="question-meta">
            <span class="q-counter">{{ current + 1 }} <span class="q-total">/ {{ TOTAL }}</span></span>
            <span class="q-score">{{ score }} pts</span>
          </div>

          <blockquote class="clue">"{{ q.error.description }}"</blockquote>

          <!-- Hint: category revealed after wrong answer -->
          <Transition name="fade">
            <div
              v-if="selected !== null && !isCorrect"
              class="hint-reveal"
              :style="{ '--c': categoryColors[q.error.category] }"
            >
              It was a <strong>{{ q.error.category }}</strong> ;
              <strong>{{ q.error.code }} {{ q.error.name }}</strong>
            </div>
          </Transition>

          <!-- Options -->
          <div class="options">
            <button
              v-for="opt in q.options"
              :key="opt.code"
              class="option-btn"
              :class="optionClass(opt.code)"
              :style="{ '--c': categoryColors[opt.category] }"
              :disabled="selected !== null"
              @click="pick(opt.code)"
            >
              <span class="opt-code">{{ opt.code }}</span>
              <span class="opt-name">{{ opt.name }}</span>
              <svg v-if="selected !== null && opt.code === q.error.code" class="opt-icon correct-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else-if="selected === opt.code && !isCorrect" class="opt-icon wrong-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>

          <!-- Next -->
          <Transition name="fade">
            <button v-if="selected !== null" class="action-btn next-btn" @click="next">
              {{ current < TOTAL - 1 ? 'Next question →' : 'See my score' }}
            </button>
          </Transition>

        </div>
      </Transition>
    </div>

  </section>
</template>

<style scoped>
@keyframes popIn {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

@keyframes correctPop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.03); }
  100% { transform: scale(1); }
}

/* ── Section ── */
.quiz-section {
  padding: 80px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

.quiz-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--coral);
  opacity: 0.75;
}

.quiz-title {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 700;
  color: #5a3535;
  margin: 0;
}

.quiz-lead {
  font-size: 15px;
  color: #7a5050;
  margin: 0;
}

/* ── Card ── */
.quiz-card {
  width: 100%;
  max-width: 620px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 28px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 40px rgba(224, 92, 96, 0.1), 0 1px 0 rgba(255,255,255,0.6) inset;
  overflow: hidden;
}

/* ── Progress ── */
.progress-track {
  height: 4px;
  background: rgba(224, 92, 96, 0.15);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #E05C60, #c0404a);
  border-radius: 0 2px 2px 0;
  transition: width 0.4s ease;
}

/* ── Question ── */
.question {
  padding: 28px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.q-counter {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  color: #5a3535;
}

.q-total {
  color: #b09090;
  font-weight: 400;
}

.q-score {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  color: white;
  background: var(--coral);
  padding: 3px 12px;
  border-radius: 99px;
}

.clue {
  font-size: 15px;
  line-height: 1.75;
  color: #5a3535;
  margin: 0;
  padding: 20px 22px;
  background: rgba(255, 255, 255, 0.45);
  border-left: 3px solid rgba(224, 92, 96, 0.4);
  border-radius: 0 12px 12px 0;
  font-style: italic;
}

/* ── Hint ── */
.hint-reveal {
  font-size: 13px;
  color: #7a5050;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  border-left: 3px solid var(--c, #E05C60);
}

.hint-reveal strong { color: #5a3535; }

/* ── Options ── */
.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border: 1.5px solid rgba(224, 92, 96, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  text-align: left;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease, opacity 0.2s ease;
  font-family: inherit;
}

.option-btn:not(:disabled).opt-idle:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.85);
  border-color: var(--c);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.option-btn:disabled { cursor: default; }

.opt-code {
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
  color: var(--c);
  min-width: 38px;
  flex-shrink: 0;
}

.opt-name {
  font-size: 14px;
  color: #5a3535;
  flex: 1;
}

.opt-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.correct-icon { color: #fff; }
.wrong-icon   { color: #fff; }

/* Answer states */
.opt-correct {
  background: #6DB87A !important;
  border-color: #6DB87A !important;
  animation: correctPop 0.4s ease;
}

.opt-correct .opt-code,
.opt-correct .opt-name { color: white; }

.opt-wrong {
  background: #E05C60 !important;
  border-color: #E05C60 !important;
  animation: shake 0.4s ease;
}

.opt-wrong .opt-code,
.opt-wrong .opt-name { color: white; }

.opt-dimmed {
  opacity: 0.4;
}

/* ── Action buttons ── */
.action-btn {
  align-self: flex-end;
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
}

.next-btn {
  background: #5a3535;
  color: white;
}

.retry-btn {
  background: var(--coral);
  color: white;
}

/* ── End screen ── */
.end-screen {
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.final-score {
  font-family: var(--mono);
  font-size: 72px;
  font-weight: 700;
  color: var(--coral);
  line-height: 1;
  text-shadow: 0 0 40px rgba(224, 92, 96, 0.3);
}

.final-total {
  font-size: 36px;
  color: #c09090;
}

.final-msg {
  font-size: 16px;
  color: #7a5050;
  text-align: center;
  margin: 0;
  max-width: 340px;
  line-height: 1.6;
}

/* ── Transitions ── */
.slide-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-enter-from   { opacity: 0; transform: translateX(32px); }
.slide-leave-to     { opacity: 0; transform: translateX(-32px); }

.fade-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(8px); }
.fade-leave-to     { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 500px) {
  .question { padding: 20px; }
  .quiz-title { font-size: 22px; }
}
</style>
