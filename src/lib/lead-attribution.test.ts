import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  captureLeadAttributionFromUrl,
  getLeadAttribution,
} from "./lead-attribution.ts";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class BlockedStorage extends MemoryStorage {
  override getItem(): string | null {
    throw new Error("storage blocked");
  }

  override removeItem(): void {
    throw new Error("storage blocked");
  }

  override setItem(): void {
    throw new Error("storage blocked");
  }
}

function installBrowser(
  url: string,
  referrer: string,
  localStorage: Storage = new MemoryStorage(),
  sessionStorage: Storage = new MemoryStorage()
): void {
  const parsed = new URL(url);
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage,
      sessionStorage,
      location: { href: parsed.href, search: parsed.search },
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { referrer },
  });
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
  Reflect.deleteProperty(globalThis, "document");
});

test("captures the first landing page and external referrer without campaign tags", () => {
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/",
    "https://www.google.com/"
  );

  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution("posthog-person");
  assert.equal(attribution.landingPage, "https://www.wynwoodschoolofmusic.com/");
  assert.equal(attribution.referrer, "https://www.google.com/");
  assert.ok(Number.isFinite(Date.parse(attribution.capturedAt || "")));
  assert.equal(attribution.posthogDistinctId, "posthog-person");
});

test("internal navigation does not overwrite the first untagged landing page", () => {
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/",
    "https://www.bing.com/",
    localStorage,
    sessionStorage
  );
  captureLeadAttributionFromUrl();

  installBrowser(
    "https://www.wynwoodschoolofmusic.com/contact",
    "https://www.wynwoodschoolofmusic.com/",
    localStorage,
    sessionStorage
  );
  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(attribution.landingPage, "https://www.wynwoodschoolofmusic.com/");
  assert.equal(attribution.referrer, "https://www.bing.com/");
});

test("a newly tagged visit replaces untagged session attribution", () => {
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/",
    "https://www.google.com/",
    localStorage,
    sessionStorage
  );
  captureLeadAttributionFromUrl();

  const taggedUrl =
    "https://www.wynwoodschoolofmusic.com/trial-music-lesson?utm_source=google&utm_medium=cpc&utm_campaign=lessons&gclid=test-click";
  installBrowser(taggedUrl, "", localStorage, sessionStorage);
  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(attribution.landingPage, taggedUrl);
  assert.equal(attribution.utmSource, "google");
  assert.equal(attribution.utmMedium, "cpc");
  assert.equal(attribution.utmCampaign, "lessons");
  assert.equal(attribution.gclid, "test-click");
});

test("a later direct visit does not erase attribution from a recent paid click", () => {
  const localStorage = new MemoryStorage();
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/?utm_source=google&utm_medium=cpc&gclid=paid-click",
    "",
    localStorage,
    new MemoryStorage()
  );
  captureLeadAttributionFromUrl();

  installBrowser(
    "https://www.wynwoodschoolofmusic.com/contact",
    "",
    localStorage,
    new MemoryStorage()
  );
  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(attribution.gclid, "paid-click");
  assert.equal(
    attribution.landingPage,
    "https://www.wynwoodschoolofmusic.com/?utm_source=google&utm_medium=cpc&gclid=paid-click"
  );
});

test("expired paid attribution yields to the current organic session", () => {
  const localStorage = new MemoryStorage();
  localStorage.setItem(
    "wsm_lead_attribution_v1",
    JSON.stringify({
      gclid: "expired-click",
      capturedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1_000).toISOString(),
    })
  );
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/private-lessons",
    "https://www.google.com/",
    localStorage,
    new MemoryStorage()
  );

  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(attribution.gclid, undefined);
  assert.equal(
    attribution.landingPage,
    "https://www.wynwoodschoolofmusic.com/private-lessons"
  );
  assert.equal(attribution.referrer, "https://www.google.com/");
});

test("tagged attribution falls back to session storage when persistence is blocked", () => {
  const taggedUrl =
    "https://www.wynwoodschoolofmusic.com/trial-music-lesson?utm_source=google&utm_medium=cpc&gclid=session-click";
  installBrowser(taggedUrl, "", new BlockedStorage(), new MemoryStorage());

  assert.doesNotThrow(() => captureLeadAttributionFromUrl());
  const attribution = getLeadAttribution();
  assert.equal(attribution.gclid, "session-click");
  assert.equal(attribution.landingPage, taggedUrl);
});

test("capture remains a no-op during server rendering", () => {
  assert.doesNotThrow(() => captureLeadAttributionFromUrl());
  assert.deepEqual(getLeadAttribution(), {});
});
