import { watch } from 'vue'
import type { Ref } from 'vue'

interface HeadOptions {
  title?: string
  description?: string
  ogImage?: string
  canonical?: string
}

export function useHead(options: Ref<HeadOptions> | HeadOptions) {
  const apply = (opts: HeadOptions) => {
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

    // Open Graph
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
    setMeta('og:image', opts.ogImage || `${window.location.origin}/og-image.jpg`)
    setMeta('og:type', 'website')
    setMeta('og:url', window.location.href)

    // Twitter Cards
    let twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (!twitterCard) {
      twitterCard = document.createElement('meta')
      twitterCard.setAttribute('name', 'twitter:card')
      document.head.appendChild(twitterCard)
    }
    twitterCard.setAttribute('content', 'summary_large_image')

    let twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta')
      twitterTitle.setAttribute('name', 'twitter:title')
      document.head.appendChild(twitterTitle)
    }
    twitterTitle.setAttribute('content', opts.title || 'Jineteando Zapala')

    let twitterDesc = document.querySelector('meta[name="twitter:description"]')
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta')
      twitterDesc.setAttribute('name', 'twitter:description')
      document.head.appendChild(twitterDesc)
    }
    twitterDesc.setAttribute('content', opts.description || 'Productos regionales y de campo desde Zapala, Neuquén.')

    let twitterImage = document.querySelector('meta[name="twitter:image"]')
    if (!twitterImage) {
      twitterImage = document.createElement('meta')
      twitterImage.setAttribute('name', 'twitter:image')
      document.head.appendChild(twitterImage)
    }
    twitterImage.setAttribute('content', opts.ogImage || `${window.location.origin}/og-image.jpg`)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', opts.canonical || window.location.href)
  }

  if ('value' in options) {
    watch(options, (val) => apply(val), { immediate: true })
  } else {
    apply(options)
  }
}