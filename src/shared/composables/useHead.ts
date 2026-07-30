import { watch } from 'vue'
import type { Ref } from 'vue'

interface HeadOptions {
  title?: string
  description?: string
  ogImage?: string
}

export function useHead(options: Ref<HeadOptions> | HeadOptions) {
  const apply = (opts: HeadOptions) => {
    // Título
    document.title = opts.title
      ? `${opts.title} | Jineteando Zapala`
      : 'Jineteando Zapala – Productos regionales y de campo'

    // Meta descripción
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', opts.description || 'Catálogo de productos regionales, indumentaria, marroquinería y más desde Zapala, Neuquén.')

    // Open Graph básico
    const setMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    setMeta('og:title', opts.title || 'Jineteando Zapala')
    setMeta('og:description', opts.description || 'Productos regionales y de campo desde Zapala, Neuquén.')
    if (opts.ogImage) setMeta('og:image', opts.ogImage)
    setMeta('og:type', 'website')
    setMeta('og:url', window.location.href)
  }

  if ('value' in options) {
    // Ref<HeadOptions>
    watch(options, (val) => apply(val), { immediate: true })
  } else {
    // objeto plano
    apply(options)
  }
}