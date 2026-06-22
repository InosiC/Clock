import { describe, it, expect } from 'vitest'
// Vite's `?raw` suffix imports a file's contents as a string at build time,
// so these checks stay bundler-native (no Node `fs`/`__dirname` needed) and
// fail fast if the deployment files are removed or moved.
import webConfig from '../../public/web.config?raw'
import viteConfig from '../../vite.config.ts?raw'

describe('IIS deployment configuration', () => {
  it('web.config declares audio MIME types for .mp3 and .ogg', () => {
    expect(webConfig).toContain('fileExtension=".mp3"')
    expect(webConfig).toContain('mimeType="audio/mpeg"')
    expect(webConfig).toContain('fileExtension=".ogg"')
    expect(webConfig).toContain('mimeType="audio/ogg"')
  })

  it('web.config rewrites unmatched routes to index.html for SPA fallback', () => {
    expect(webConfig).toContain('<rewrite>')
    expect(webConfig).toContain('type="Rewrite"')
    expect(webConfig).toContain('url="index.html"')
    // Real files/directories must be served directly, not rewritten.
    expect(webConfig).toContain('matchType="IsFile" negate="true"')
    expect(webConfig).toContain('matchType="IsDirectory" negate="true"')
  })

  it('vite config builds to dist/ and honors a configurable base path', () => {
    expect(viteConfig).toContain("outDir: 'dist'")
    expect(viteConfig).toContain('VITE_BASE')
  })
})
