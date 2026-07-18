// @vitest-environment jsdom

import "zone.js";

import { Component } from "@angular/core";
import { getTestBed } from "@angular/core/testing";
import { TestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { when } from "@jayoncode/form-intelligence/rules";
import {
  FormIntelligentFieldDirective,
  FormIntelligentFormDirective,
  injectForm,
  provideFormIntelligent,
} from "@jayoncode/form-intelligence-angular";

function createRegisterHost(onSubmit: (values: { email: string; password: string }) => void) {
  @Component({
    standalone: true,
    imports: [FormIntelligentFormDirective, FormIntelligentFieldDirective],
    providers: [
      provideFormIntelligent({
        schema: {
          email: "email",
          password: "password",
        },
        onSubmit,
      }),
    ],
    template: `
      <form fiForm>
        <input fiField="email" aria-label="Email" />
        <input fiField="password" type="password" aria-label="Password" />
        <button type="submit">Register</button>
      </form>
    `,
  })
  class RegisterHostComponent {
    readonly form = injectForm();
  }

  return RegisterHostComponent;
}

describe("Angular adapter", () => {
  beforeAll(() => {
    getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  afterEach(() => {
    document.body.innerHTML = "";
    TestBed.resetTestingModule();
  });

  it("enhances native markup without manual handlers", async () => {
    const onSubmit = vi.fn();
    const Host = createRegisterHost(onSubmit);
    const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector("form") as HTMLFormElement;
    expect(form.getAttribute("data-form-intelligent")).toBeTruthy();

    const email = fixture.nativeElement.querySelector("[aria-label='Email']") as HTMLInputElement;
    const password = fixture.nativeElement.querySelector(
      "[aria-label='Password']",
    ) as HTMLInputElement;

    email.value = "user@example.com";
    email.dispatchEvent(new Event("input", { bubbles: true }));
    password.value = "secret123";
    password.dispatchEvent(new Event("input", { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(email.getAttribute("name")).toBe("email");
    await vi.waitFor(() => {
      expect(fixture.componentInstance.form.instance.getValues()).toEqual({
        email: "user@example.com",
        password: "secret123",
      });
    });

    const button = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          email: "user@example.com",
          password: "secret123",
        },
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    fixture.destroy();
  });

  it("exposes form.state() for errors without manual subscribe", async () => {
    const Host = createRegisterHost(vi.fn());
    const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();

    const form = fixture.componentInstance.form;
    const hostForm = fixture.nativeElement.querySelector("form") as HTMLFormElement;
    hostForm.requestSubmit();

    await vi.waitFor(() => {
      expect(form.state().errors.email).toContain("required");
    });

    fixture.destroy();
  });

  it("disables submit when formUi.submitDisabled is true", async () => {
    @Component({
      standalone: true,
      imports: [FormIntelligentFormDirective, FormIntelligentFieldDirective],
      providers: [
        provideFormIntelligent({
          initialValues: { loanAmount: 600_000 },
          rules: [when("loanAmount").greaterThan(500_000).disableSubmit()],
        }),
      ],
      template: `
        <form fiForm>
          <input fiField="loanAmount" aria-label="Amount" />
          <button type="submit" [disabled]="form.submitButton().disabled">Submit</button>
        </form>
      `,
    })
    class LoanHostComponent {
      readonly form = injectForm();
    }

    const fixture = TestBed.configureTestingModule({
      imports: [LoanHostComponent],
    }).createComponent(LoanHostComponent);
    fixture.detectChanges();

    await vi.waitFor(() => {
      const button = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    fixture.destroy();
  });
});
