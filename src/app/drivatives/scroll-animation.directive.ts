import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnimation]'
})
export class ScrollAnimationDirective  implements AfterViewInit {
  @Input() animationClass: string = 'animate-fadeInUp'; // Default animation

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'opacity-0');
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
          observer.unobserve(this.el.nativeElement); // Stop observing after first trigger
        }
      },
      { threshold: 0.2 } // Trigger when 20% of element is visible
    );

    observer.observe(this.el.nativeElement);
  }

}
