import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer: Renderer2;
  private colorScheme!: string | null;
  private colorSchemePrefix = 'color-scheme-';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Called when the root component is created to load light or dark theme of the app.
   * Checks if any prefers-color-scheme is stored in localStorage.
   * If no prefers-color-scheme is stored in localStorage, tries to detect OS default prefers-color-scheme.
   * If none is found, the default is light.
   */
    load() {
      this.getColorScheme();
      this.renderer.addClass(document.body, this.colorSchemePrefix + this.colorScheme);
    }

    /**
     * Removes the old color-scheme class and adds the new/current color-scheme class.
     * @param scheme - Light or dark value string
     */
    update(scheme: string) {
      this.setColorScheme(scheme);
      this.renderer.removeClass(document.body, this.colorSchemePrefix + (this.colorScheme === 'dark' ? 'light' : 'dark'));
      this.renderer.addClass(document.body, this.colorSchemePrefix + scheme);
    }

    /**
     * Returns current theme/scheme.
     * @returns Current theme
     */
    currentActive(): string | null{
      return this.colorScheme;
    }

    private getColorScheme() {
      if (localStorage.getItem('prefers-color')) {
        this.colorScheme = localStorage.getItem('prefers-color');
      } else {
        this.detectPrefersColorScheme();
      }
    }

    private setColorScheme(scheme: string) {
      this.colorScheme = scheme;
      localStorage.setItem('prefers-color', scheme);
    }

    private detectPrefersColorScheme() {
      if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
        this.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        this.colorScheme = 'light';
      }
    }
}
