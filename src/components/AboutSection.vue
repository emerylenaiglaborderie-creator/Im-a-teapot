<template>
  <section class="about">

    <div class="about-header">
      <span class="about-eyebrow">About</span>
      <h2 class="about-title">What is an HTTP status code?</h2>
      <p class="about-lead">
        Every time your browser talks to a server, the server replies with an
        <strong>HTTP status code</strong> — a three-digit number that summarises the outcome
        of the request.
      </p>
    </div>

    <div class="cards-grid">
      <div class="info-card" v-for="cat in categories" :key="cat.range" :style="{ '--c': cat.color }">
        <span class="cat-badge">{{ cat.range }}</span>
        <h3 class="cat-name">{{ cat.label }}</h3>
        <p class="cat-desc">{{ cat.desc }}</p>
      </div>
    </div>

    <div class="teapot-block">
      <div class="teapot-code">418</div>
      <div class="teapot-text">
        <h3>I'm a Teapot</h3>
        <p>
          Defined in RFC 2324 as an April Fools' joke in 1998, this code means a server refuses
          to brew coffee because it is — and will always be — a teapot. It has since become
          a symbol of web culture and a universal easter egg among developers.
        </p>
      </div>
    </div>

    <div class="about-footer">
      <p>
        This project covers <strong>{{ errorCount }} HTTP status codes</strong>, each with a description,
        its origin, and tips on how to fix it.
      </p>
    </div>

  </section>
</template>

<script setup lang="ts">
import { httpErrors } from '../data/httpErrors'

const errorCount = httpErrors.length

const categories = [
  {
    range: '1xx',
    label: 'Informational',
    color: '#6B9FD4',
    desc: 'The request was received and processing is continuing. These are interim responses and do not terminate the transaction.',
  },
  {
    range: '2xx',
    label: 'Success',
    color: '#6DB87A',
    desc: 'The request was successfully received, understood, and accepted by the server.',
  },
  {
    range: '3xx',
    label: 'Redirection',
    color: '#E8A85F',
    desc: 'The client must take additional action to complete the request, usually following a redirect.',
  },
  {
    range: '4xx',
    label: 'Client Error',
    color: '#E05C60',
    desc: 'The request contains bad syntax or cannot be fulfilled. The fault lies with the client.',
  },
  {
    range: '5xx',
    label: 'Server Error',
    color: '#9B59B6',
    desc: 'The server failed to fulfil a valid request. The fault lies with the server.',
  },
]
</script>

<style scoped>
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.about {
  padding: 80px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

/* ── Header ── */
.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.about-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--coral);
  opacity: 0.75;
}

.about-title {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 700;
  color: #5a3535;
  margin: 0;
  line-height: 1.2;
}

.about-lead {
  font-size: 16px;
  line-height: 1.75;
  color: #7a5050;
  max-width: 560px;
  margin: 0;
}

.about-lead strong {
  color: #5a3535;
}

/* ── Category grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.info-card {
  border-radius: 20px;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 0 0 2px var(--c);
  }
}

.cat-badge {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: white;
  background: var(--c);
  padding: 4px 12px;
  border-radius: 99px;
  align-self: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.cat-name {
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 700;
  color: #5a3535;
  margin: 0;
}

.cat-desc {
  font-size: 13px;
  line-height: 1.65;
  color: #7a5050;
  margin: 0;
}

/* ── 418 block ── */
.teapot-block {
  display: flex;
  align-items: center;
  gap: 32px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 36px 40px;
  box-shadow: 0 4px 20px rgba(224, 92, 96, 0.08);
}

.teapot-code {
  font-family: var(--mono);
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
  color: var(--coral);
  text-shadow: 0 0 40px rgba(224, 92, 96, 0.35);
  flex-shrink: 0;
}

.teapot-text h3 {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 700;
  color: #5a3535;
  margin: 0 0 10px;
}

.teapot-text p {
  font-size: 14px;
  line-height: 1.75;
  color: #7a5050;
  margin: 0;
}

/* ── Footer ── */
.about-footer {
  text-align: center;
  font-family: var(--mono);
  font-size: 13px;
  color: #b09090;
  border-top: 1px solid rgba(224, 92, 96, 0.15);
  padding-top: 32px;
}

.about-footer strong {
  color: var(--coral);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .teapot-block {
    flex-direction: column;
    text-align: center;
    padding: 28px 24px;
  }

  .about-title {
    font-size: 22px;
  }
}
</style>
