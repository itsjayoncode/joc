import { Directive, ElementRef, inject, Input, type OnDestroy, type OnInit } from "@angular/core";

import type { FieldPath } from "@jayoncode/form-intelligence";

import { injectForm } from "./provide-form.js";

/**
 * Binds an input to the form engine and keeps projection attrs in sync
 * (`name`, `aria-invalid`, `data-fi-status`, optional aria ids).
 */
@Directive({
  selector: "[fiField]",
  standalone: true,
})
export class FormIntelligentFieldDirective implements OnInit, OnDestroy {
  @Input({ alias: "fiField", required: true })
  public fieldPath!: FieldPath;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly form = injectForm();
  private unsubscribe: (() => void) | undefined;

  public ngOnInit(): void {
    this.syncAttributes();
    this.unsubscribe = this.form.instance.subscribe(() => {
      this.syncAttributes();
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe?.();
  }

  private syncAttributes(): void {
    const props = this.form.field(this.fieldPath);
    const el = this.element.nativeElement;

    el.setAttribute("name", props.name);

    if (props["aria-invalid"] === true) {
      el.setAttribute("aria-invalid", "true");
    } else {
      el.removeAttribute("aria-invalid");
    }

    const status = props["data-fi-status"];
    if (status !== undefined) {
      el.setAttribute("data-fi-status", status);
    } else {
      el.removeAttribute("data-fi-status");
    }

    const required = props["aria-required"];
    if (required === true) {
      el.setAttribute("aria-required", "true");
    } else if (required === false) {
      el.setAttribute("aria-required", "false");
    } else {
      el.removeAttribute("aria-required");
    }

    const describedBy = props["aria-describedby"];
    if (describedBy !== undefined && describedBy.length > 0) {
      el.setAttribute("aria-describedby", describedBy);
    } else {
      el.removeAttribute("aria-describedby");
    }
  }
}
