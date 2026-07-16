import { Directive, ElementRef, inject, Input, type OnInit } from "@angular/core";

import type { FieldPath } from "@jayoncode/form-intelligent";

@Directive({
  selector: "[fiField]",
  standalone: true,
})
export class FormIntelligentFieldDirective implements OnInit {
  @Input({ alias: "fiField", required: true })
  public fieldPath!: FieldPath;

  private readonly element = inject(ElementRef<HTMLElement>);

  public ngOnInit(): void {
    this.element.nativeElement.setAttribute("name", this.fieldPath);
  }
}
