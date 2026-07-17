import type { SnapshotTemplate, SnapshotTemplateId } from "./types.js";

const DOCS_DIFF = "/modules/diff";

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export const LAB_TEMPLATES: readonly SnapshotTemplate[] = [
  {
    id: "user-profile",
    label: "User Profile",
    description: "Profile fields with nested address and roles array.",
    docsPath: DOCS_DIFF,
    before: {
      id: "u-1",
      name: "Alex Rivera",
      email: "alex@example.com",
      active: true,
      address: { city: "Manila", zip: "1000" },
      roles: ["viewer", "editor"],
    },
    after: {
      id: "u-1",
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
      active: true,
      address: { city: "Cebu", zip: "6000" },
      roles: ["editor", "admin"],
      plan: "pro",
    },
  },
  {
    id: "product",
    label: "Product",
    description: "Catalog product with price and tags.",
    docsPath: DOCS_DIFF,
    before: {
      sku: "SKU-100",
      title: "Notebook",
      price: 12.5,
      tags: ["office", "paper"],
      stock: 40,
    },
    after: {
      sku: "SKU-100",
      title: "Notebook Pro",
      price: 14.0,
      tags: ["office", "premium"],
      stock: 28,
      featured: true,
    },
  },
  {
    id: "employee",
    label: "Employee",
    description: "HR record with department and permissions.",
    docsPath: DOCS_DIFF,
    before: {
      employeeId: "E-42",
      name: "Jordan Lee",
      department: "Engineering",
      permissions: [{ id: "p1", name: "read" }],
    },
    after: {
      employeeId: "E-42",
      name: "Jordan Lee",
      department: "Platform",
      permissions: [
        { id: "p1", name: "read" },
        { id: "p2", name: "write" },
      ],
      title: "Staff Engineer",
    },
  },
  {
    id: "invoice",
    label: "Invoice",
    description: "Invoice with line items — good for identity matching.",
    docsPath: DOCS_DIFF,
    before: {
      invoiceId: "INV-9",
      customer: "Acme",
      items: [
        { id: "line-1", desc: "Seat", qty: 2, price: 10 },
        { id: "line-2", desc: "Addon", qty: 1, price: 5 },
      ],
      total: 25,
    },
    after: {
      invoiceId: "INV-9",
      customer: "Acme Co",
      items: [
        { id: "line-2", desc: "Addon", qty: 2, price: 5 },
        { id: "line-1", desc: "Seat", qty: 2, price: 12 },
        { id: "line-3", desc: "Support", qty: 1, price: 20 },
      ],
      total: 54,
    },
  },
  {
    id: "shopping-cart",
    label: "Shopping Cart",
    description: "Cart with reordered items for move detection.",
    docsPath: DOCS_DIFF,
    before: {
      cartId: "c-1",
      items: [
        { id: "a", name: "Mug", qty: 1 },
        { id: "b", name: "Tee", qty: 2 },
        { id: "c", name: "Sticker", qty: 5 },
      ],
    },
    after: {
      cartId: "c-1",
      items: [
        { id: "c", name: "Sticker", qty: 5 },
        { id: "a", name: "Mug", qty: 2 },
        { id: "b", name: "Tee", qty: 2 },
      ],
    },
  },
  {
    id: "blog-post",
    label: "Blog Post",
    description: "CMS document with metadata and tags.",
    docsPath: DOCS_DIFF,
    before: {
      slug: "hello-world",
      title: "Hello",
      published: false,
      tags: ["draft"],
      meta: { author: "jay", views: 0 },
    },
    after: {
      slug: "hello-world",
      title: "Hello World",
      published: true,
      tags: ["shipping", "guide"],
      meta: { author: "jay", views: 120 },
    },
  },
  {
    id: "settings",
    label: "Settings",
    description: "App settings with nested feature flags.",
    docsPath: DOCS_DIFF,
    before: {
      theme: "system",
      notifications: { email: true, push: false },
      features: { beta: false, labs: true },
    },
    after: {
      theme: "dark",
      notifications: { email: true, push: true },
      features: { beta: true, labs: true, experimental: true },
    },
  },
  {
    id: "api-response",
    label: "API Response",
    description: "Typical REST payload before/after.",
    docsPath: DOCS_DIFF,
    before: {
      ok: true,
      data: { id: 1, status: "pending" },
      errors: [],
    },
    after: {
      ok: true,
      data: { id: 1, status: "complete", result: { score: 0.98 } },
      errors: [],
      meta: { tookMs: 42 },
    },
  },
  {
    id: "configuration",
    label: "Configuration",
    description: "Service config with ignore-path candidates.",
    docsPath: DOCS_DIFF,
    before: {
      service: "api",
      env: "staging",
      secrets: { token: "old" },
      retries: 3,
    },
    after: {
      service: "api",
      env: "production",
      secrets: { token: "new" },
      retries: 5,
      region: "ap-southeast-1",
    },
  },
  {
    id: "deep-nested",
    label: "Deep Nested Object",
    description: "Deep tree for maxDepth experiments.",
    docsPath: DOCS_DIFF,
    before: {
      a: { b: { c: { d: { e: { value: 1, label: "leaf" } } } } },
    },
    after: {
      a: { b: { c: { d: { e: { value: 2, label: "leaf", flag: true } } } } },
    },
  },
  {
    id: "large-dataset",
    label: "Large Dataset",
    description: "100 records — scale with experiments for more.",
    docsPath: "/modules/performance",
    before: {
      records: Array.from({ length: 100 }, (_, i) => ({
        id: `r-${String(i)}`,
        value: i,
        label: `Item ${String(i)}`,
      })),
    },
    after: {
      records: Array.from({ length: 100 }, (_, i) => ({
        id: `r-${String(i)}`,
        value: i % 7 === 0 ? i + 1 : i,
        label: `Item ${String(i)}`,
        ...(i % 11 === 0 ? { flagged: true } : {}),
      })),
    },
  },
];

export function getLabTemplate(id: SnapshotTemplateId): SnapshotTemplate {
  const found = LAB_TEMPLATES.find((entry) => entry.id === id);
  if (!found) {
    throw new Error(`Unknown lab template: ${id}`);
  }
  return found;
}

export function templateToJson(template: SnapshotTemplate): {
  readonly snapshotA: string;
  readonly snapshotB: string;
  readonly baseJson: string;
} {
  return {
    snapshotA: pretty(template.before),
    snapshotB: pretty(template.after),
    baseJson: pretty(template.base ?? template.before),
  };
}

/** Generate N comparable records for stress / benchmark experiments. */
export function generateDatasetPair(count: number): { before: unknown; after: unknown } {
  const before = {
    records: Array.from({ length: count }, (_, i) => ({
      id: `r-${String(i)}`,
      value: i,
      nest: { a: i, b: { c: i % 3 } },
    })),
  };
  const after = {
    records: Array.from({ length: count }, (_, i) => ({
      id: `r-${String(i)}`,
      value: i % 5 === 0 ? i + 1 : i,
      nest: { a: i, b: { c: (i + 1) % 3 } },
      ...(i % 13 === 0 ? { extra: true } : {}),
    })),
  };
  return { before, after };
}

export function generateArrayReorderPair(): { before: unknown; after: unknown } {
  const items = [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Beta" },
    { id: "c", name: "Gamma" },
    { id: "d", name: "Delta" },
  ];
  return {
    before: { items },
    after: { items: [items[2], items[0], items[3], items[1]] },
  };
}

export function prettyJson(value: unknown): string {
  return pretty(value);
}
