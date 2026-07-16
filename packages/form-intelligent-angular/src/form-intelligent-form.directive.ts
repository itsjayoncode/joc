import { Directive, ElementRef, inject, type AfterViewInit, type OnDestroy } from "@angular/core";

import { injectForm } from "./provide-form.js";

@Directive({
  selector: "form[fiForm]",
  standalone: true,
  host: {
    novalidate: "",
  },
})
export class FormIntelligentFormDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLFormElement>);
  private readonly form = injectForm();

  public ngAfterViewInit(): void {
    this.form.instance.ref(this.element.nativeElement);
  }

  public ngOnDestroy(): void {
    this.form.instance.ref(null);
  }
}
