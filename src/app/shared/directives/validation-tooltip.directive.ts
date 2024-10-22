import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  Optional,
  Self,
  Input,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[appValidationTooltip]',
})
export class ValidationTooltipDirective implements OnInit, OnDestroy {
  @Input() invalidClassName: string = 'is-invalid';
  @Input() validClassName: string = 'is-valid';
  @Input() errorDivClassName: string = 'invalid-feedback';

  destroyRef = inject(DestroyRef);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Self() @Optional() private controlNameDirective: FormControlName
  ) {}

  ngOnInit(): void {
    if (this.controlNameDirective) {
      this.el.nativeElement.addEventListener('blur', () => this.updateTooltip());
      this.controlNameDirective.control?.statusChanges
        ?.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.updateTooltip());
    }
  }

  private updateTooltip(): void {
    const control = this.controlNameDirective.control;
    const controlName = this.controlNameDirective.name;
    const parentElement = this.el.nativeElement.parentElement;

    // Remove existing error messages
    const existingMessage = parentElement.querySelector(`.${this.errorDivClassName}`);
    if (existingMessage) {
      this.renderer.removeChild(parentElement, existingMessage);
      this.el.nativeElement.classList.remove(this.invalidClassName);
    }

    if (control && control.invalid) {
      this.el.nativeElement.classList.add(this.invalidClassName);

      // Create the error message when validation fails
      const errorMessage = this.renderer.createText(`Please provide a valid ${controlName}`);
      const errorElement = this.renderer.createElement('div');

      this.renderer.addClass(errorElement, this.errorDivClassName);
      this.renderer.setStyle(errorElement, 'font-size', '10px');
      this.renderer.setStyle(errorElement, 'position', 'absolute');
      this.renderer.appendChild(errorElement, errorMessage);
      this.renderer.appendChild(parentElement, errorElement);
    } else {
      this.el.nativeElement.classList.add(this.validClassName);
    }
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('blur', () => this.updateTooltip());
  }
}
