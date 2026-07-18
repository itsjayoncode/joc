import type { SandboxTemplate, SandboxTemplateId } from "./types.js";

export const SANDBOX_TEMPLATES: readonly SandboxTemplate[] = [
  {
    id: "login",
    label: "Login",
    description: "Email + password with required checks.",
    docsPath: "/packages/form-intelligence/modules/getting-started",
    initialValues: { email: "", password: "" },
    fieldOrder: ["email", "password"],
    fieldMeta: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
  },
  {
    id: "register",
    label: "Register",
    description: "Username, email, password, confirm password.",
    docsPath: "/packages/form-intelligence/modules/validation",
    initialValues: { username: "", email: "", password: "", confirmPassword: "" },
    fieldOrder: ["username", "email", "password", "confirmPassword"],
    fieldMeta: {
      username: { label: "Username", type: "text" },
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      confirmPassword: { label: "Confirm password", type: "password" },
    },
  },
  {
    id: "contact",
    label: "Contact",
    description: "Name, email, message.",
    docsPath: "/packages/form-intelligence/modules/submission",
    initialValues: { name: "", email: "", message: "" },
    fieldOrder: ["name", "email", "message"],
    fieldMeta: {
      name: { label: "Name", type: "text" },
      email: { label: "Email", type: "email" },
      message: { label: "Message", type: "textarea" },
    },
  },
  {
    id: "checkout",
    label: "Checkout",
    description: "Qty × price with optional computed total.",
    docsPath: "/packages/form-intelligence/modules/calculations",
    initialValues: { email: "", qty: 1, price: 29.99, total: 29.99 },
    fieldOrder: ["email", "qty", "price", "total"],
    fieldMeta: {
      email: { label: "Email", type: "email" },
      qty: { label: "Quantity", type: "number" },
      price: { label: "Unit price", type: "number" },
      total: { label: "Total", type: "number" },
    },
  },
  {
    id: "survey",
    label: "Survey",
    description: "Rating + optional feedback.",
    docsPath: "/packages/form-intelligence/modules/rules",
    initialValues: { rating: "3", feedback: "", nps: "" },
    fieldOrder: ["rating", "nps", "feedback"],
    fieldMeta: {
      rating: {
        label: "Rating",
        type: "select",
        options: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
        ],
      },
      nps: {
        label: "Would recommend?",
        type: "select",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      feedback: { label: "Feedback", type: "textarea" },
    },
  },
  {
    id: "employee",
    label: "Employee",
    description: "Business vs personal with conditional company.",
    docsPath: "/packages/form-intelligence/modules/workflow",
    initialValues: { customerType: "Personal", companyName: "", email: "", role: "engineer" },
    fieldOrder: ["customerType", "companyName", "email", "role"],
    fieldMeta: {
      customerType: {
        label: "Customer type",
        type: "select",
        options: [
          { label: "Personal", value: "Personal" },
          { label: "Business", value: "Business" },
        ],
      },
      companyName: { label: "Company name", type: "text" },
      email: { label: "Work email", type: "email" },
      role: { label: "Role", type: "text" },
    },
  },
  {
    id: "invoice",
    label: "Invoice",
    description: "Line items with tax calculation.",
    docsPath: "/packages/form-intelligence/modules/calculations",
    initialValues: { client: "", subtotal: 100, taxRate: 0.12, tax: 12, total: 112 },
    fieldOrder: ["client", "subtotal", "taxRate", "tax", "total"],
    fieldMeta: {
      client: { label: "Client", type: "text" },
      subtotal: { label: "Subtotal", type: "number" },
      taxRate: { label: "Tax rate", type: "number" },
      tax: { label: "Tax", type: "number" },
      total: { label: "Total", type: "number" },
    },
  },
  {
    id: "booking",
    label: "Booking",
    description: "Multi-step style fields (dates + guests).",
    docsPath: "/packages/form-intelligence/modules/workflow",
    initialValues: { checkIn: "", checkOut: "", guests: 2, notes: "" },
    fieldOrder: ["checkIn", "checkOut", "guests", "notes"],
    fieldMeta: {
      checkIn: { label: "Check-in", type: "text" },
      checkOut: { label: "Check-out", type: "text" },
      guests: { label: "Guests", type: "number" },
      notes: { label: "Notes", type: "textarea" },
    },
  },
] as const;

export function getSandboxTemplate(id: SandboxTemplateId): SandboxTemplate {
  const template = SANDBOX_TEMPLATES.find((entry) => entry.id === id);
  if (!template) {
    const fallback = SANDBOX_TEMPLATES[0];
    if (!fallback) {
      throw new Error("SANDBOX_TEMPLATES is empty");
    }
    return fallback;
  }
  return template;
}
