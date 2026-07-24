// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import {
  getLastUploadProgress,
  uploadTransport,
  UploadTransportError,
  xhrMultipartUpload,
} from "../../src/upload/index.js";

function mockXhr(options: {
  status?: number;
  responseText?: string;
  progress?: Array<{ loaded: number; total: number }>;
  abortOnSend?: boolean;
}): void {
  const status = options.status ?? 200;
  const responseText = options.responseText ?? '{"ok":true}';
  const progress = options.progress ?? [{ loaded: 50, total: 100 }];

  class FakeXHR {
    static readonly UNSENT = 0;
    static readonly OPENED = 1;
    static readonly HEADERS_RECEIVED = 2;
    static readonly LOADING = 3;
    static readonly DONE = 4;

    upload = {
      onprogress: null as ((event: ProgressEvent) => void) | null,
    };
    status = 0;
    responseText = "";
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onabort: (() => void) | null = null;

    open(): void {}
    setRequestHeader(): void {}
    abort(): void {
      this.onabort?.();
    }
    send(): void {
      if (options.abortOnSend) {
        queueMicrotask(() => this.onabort?.());
        return;
      }
      queueMicrotask(() => {
        for (const step of progress) {
          this.upload.onprogress?.({
            lengthComputable: true,
            loaded: step.loaded,
            total: step.total,
          } as ProgressEvent);
        }
        this.status = status;
        this.responseText = responseText;
        this.onload?.();
      });
    }
  }

  vi.stubGlobal("XMLHttpRequest", FakeXHR);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("xhrMultipartUpload", () => {
  it("reports progress and resolves on 2xx", async () => {
    mockXhr({
      progress: [
        { loaded: 25, total: 100 },
        { loaded: 100, total: 100 },
      ],
    });
    const onProgress = vi.fn();

    const result = await xhrMultipartUpload({
      url: "/api/upload",
      formData: new FormData(),
      onProgress,
    });

    expect(result.status).toBe(200);
    expect(result.response).toEqual({ ok: true });
    expect(onProgress).toHaveBeenCalledWith({ loaded: 25, total: 100, percent: 25 });
    expect(onProgress).toHaveBeenCalledWith({ loaded: 100, total: 100, percent: 100 });
  });

  it("rejects with UploadTransportError on non-2xx", async () => {
    mockXhr({ status: 500, responseText: "nope" });

    await expect(
      xhrMultipartUpload({ url: "/api/upload", formData: new FormData() }),
    ).rejects.toBeInstanceOf(UploadTransportError);
  });

  it("aborts when signal aborts", async () => {
    mockXhr({});
    const controller = new AbortController();
    const promise = xhrMultipartUpload({
      url: "/api/upload",
      formData: new FormData(),
      signal: controller.signal,
    });
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("uploadTransport plugin", () => {
  it("uploads multipart when files are present and passes meta.upload to onSubmit", async () => {
    mockXhr({ responseText: '{"id":"1"}' });
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const onProgress = vi.fn();
    const onComplete = vi.fn();
    const onSubmit = vi.fn();
    const progressEvents: unknown[] = [];

    const form = createForm({
      initialValues: { note: "hi", avatar: [file] },
      plugins: [
        uploadTransport({
          url: "/api/upload",
          onProgress,
          onComplete,
        }),
      ],
      onSubmit,
    });
    form.on("upload:progress", (payload) => {
      progressEvents.push(payload);
    });

    await expect(form.submit()).resolves.toBe(true);

    expect(onProgress).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ status: 200, response: { id: "1" } }),
    );
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ note: "hi" }),
      expect.objectContaining({
        upload: expect.objectContaining({ status: 200, response: { id: "1" } }),
      }),
    );
    expect(progressEvents.length).toBeGreaterThan(0);
    expect(getLastUploadProgress(form)?.percent).toBe(50);
    form.destroy();
  });

  it("uses onSubmit only when whenFilesOnly and no files", async () => {
    const transport = vi.fn();
    const onSubmit = vi.fn();

    const form = createForm({
      initialValues: { note: "hi", avatar: [] as File[] },
      plugins: [uploadTransport({ url: "/api/upload", transport })],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(true);
    expect(transport).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    form.destroy();
  });

  it("supports custom transport without url", async () => {
    const file = new File(["x"], "x.bin");
    const onSubmit = vi.fn();

    const form = createForm({
      initialValues: { file: [file] },
      plugins: [
        uploadTransport({
          transport: async (formData, ctx) => {
            expect(formData).toBeInstanceOf(FormData);
            ctx.onProgress({ loaded: 1, total: 1, percent: 100 });
            return { status: 201, responseText: "", response: { created: true } };
          },
        }),
      ],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(true);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        upload: expect.objectContaining({ status: 201 }),
      }),
    );
    form.destroy();
  });

  it("cancels in-flight upload via form.cancelSubmit()", async () => {
    let resolveSent!: () => void;
    const sent = new Promise<void>((resolve) => {
      resolveSent = resolve;
    });

    class SlowXHR {
      upload = { onprogress: null as ((event: ProgressEvent) => void) | null };
      status = 0;
      responseText = "";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onabort: (() => void) | null = null;
      open(): void {}
      setRequestHeader(): void {}
      abort(): void {
        this.onabort?.();
      }
      send(): void {
        resolveSent();
      }
    }
    vi.stubGlobal("XMLHttpRequest", SlowXHR);

    const file = new File(["x"], "x.bin");
    const onError = vi.fn();
    const form = createForm({
      initialValues: { file: [file] },
      plugins: [uploadTransport({ url: "/api/upload", onError })],
    });

    const submitPromise = form.submit();
    await sent;
    form.cancelSubmit();

    await expect(submitPromise).resolves.toBe(false);
    expect(onError).toHaveBeenCalled();
    form.destroy();
  });

  it("ignores successful onload after cancelSubmit (abort race)", async () => {
    let sent = false;
    let triggerLateOnload: (() => void) | null = null;

    class RaceXHR {
      upload = { onprogress: null as ((event: ProgressEvent) => void) | null };
      status = 0;
      responseText = "";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onabort: (() => void) | null = null;
      open(): void {}
      setRequestHeader(): void {}
      abort(): void {
        // Simulate late onload winning the race before abort settles.
        this.status = 200;
        this.responseText = '{"ok":true}';
        this.onload?.();
        this.onabort?.();
      }
      send(): void {
        sent = true;
        triggerLateOnload = () => {
          this.status = 200;
          this.responseText = '{"ok":true}';
          this.onload?.();
        };
      }
    }
    vi.stubGlobal("XMLHttpRequest", RaceXHR);

    const file = new File(["x"], "x.bin");
    const onComplete = vi.fn();
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { file: [file] },
      plugins: [uploadTransport({ url: "/api/upload", onComplete })],
      onSubmit,
    });

    const submitPromise = form.submit();
    await vi.waitFor(() => {
      expect(sent).toBe(true);
    });
    // Keep triggerLateOnload referenced so the mock shape stays intentional.
    void triggerLateOnload;
    form.cancelSubmit();

    await expect(submitPromise).resolves.toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    form.destroy();
  });

  it("throws when configured without url/transport/buildRequest", () => {
    expect(() => uploadTransport({} as never)).toThrow(/url/);
  });
});
