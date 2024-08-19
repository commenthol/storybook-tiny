<script setup>
import { ref, computed } from 'vue/dist/vue.esm-bundler.js'

const getLocHash = () => decodeURIComponent(window.location.hash.slice(1))

const cssUnit = (unit) => {
  const n = Number(unit)
  return isNaN(n) ? unit : `${n}px`
}

const props = defineProps({
  header: {
    type: String,
    default: 'Storybook Tiny'
  },
  href: {
    type: String,
    default: '/stories/index.html'
  },
  width: {
    type: [String, Number],
    default: 130
  },
  stories: {
    type: Array,
    default: () => []
  }
})

const width = cssUnit(props.width)
const stories = props.stories

const locHash = ref(getLocHash())
window.addEventListener('hashchange', () => {
  locHash.value = getLocHash()
})

let component = undefined
const titles = computed(() =>
  stories
    .map((story, i) => {
      switch (typeof story) {
        case 'object': {
          if ('component' in story) {
            const title = story.title ?? story.component?.__name
            if (!title) return
            const active = locHash.value === title
            if (active) {
              component = story.component
            }
            return {
              i,
              title,
              active,
              href: `#${title}`
            }
          }
        }
        case 'string': {
          return {
            i,
            html: story
          }
        }
      }
    })
    .filter(Boolean)
)
</script>

<template>
  <main :class="$style.storybook">
    <aside :style="{ flexBasis: width }">
      <h4>
        <a :href="props.href">
          {{ props.header }}
        </a>
      </h4>
      <div
        v-for="title in titles"
        :key="title.i"
      >
        <span
          v-if="title.html"
          v-html="title.html"
        />
        <a
          v-else
          :href="title.href"
          :class="[title.active ? $style.active : '']"
        >{{ title.title }}</a>
      </div>
    </aside>
    <section class="stories">
      <p
        v-if="!component"
        :class="$style.storybookSectionP"
      >
        The tiny storybook for
        <a
          href="https://vuejs.org/guide/"
          target="_blanc"
          rel="norel noreferrer"
        >
          Vue.js
        </a>
      </p>
      <component
        :is="component"
        v-else
      />
    </section>
  </main>
</template>

<style module>
@import './Storybook.module.css';
</style>
