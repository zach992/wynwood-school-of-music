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

class WriteBlockedStorage extends MemoryStorage {
  writesBlocked = false;

  override setItem(key: string, value: string): void {
    if (this.writesBlocked) throw new Error("storage write blocked");
    super.setItem(key, value);
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

test("does not treat a same-site URL as an acquisition referrer", () => {
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/contact",
    "https://www.wynwoodschoolofmusic.com/private-lessons"
  );

  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(
    attribution.landingPage,
    "https://www.wynwoodschoolofmusic.com/contact"
  );
  assert.equal(attribution.referrer, undefined);
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

test("keeps the organic session as a fallback after paid attribution expires", () => {
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  localStorage.setItem(
    "wsm_lead_attribution_v1",
    JSON.stringify({
      gclid: "still-valid-click",
      landingPage: "https://www.wynwoodschoolofmusic.com/paid-landing",
      capturedAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1_000).toISOString(),
    })
  );
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/private-lessons",
    "https://www.google.com/",
    localStorage,
    sessionStorage
  );
  captureLeadAttributionFromUrl();

  assert.equal(getLeadAttribution().gclid, "still-valid-click");

  localStorage.setItem(
    "wsm_lead_attribution_v1",
    JSON.stringify({
      gclid: "expired-click",
      landingPage: "https://www.wynwoodschoolofmusic.com/paid-landing",
      capturedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1_000).toISOString(),
    })
  );
  const attribution = getLeadAttribution();
  assert.equal(attribution.gclid, undefined);
  assert.equal(
    attribution.landingPage,
    "https://www.wynwoodschoolofmusic.com/private-lessons"
  );
  assert.equal(attribution.referrer, "https://www.google.com/");
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

test("organic attribution survives for the full restored browser session", () => {
  const sessionStorage = new MemoryStorage();
  sessionStorage.setItem(
    "wsm_lead_session_attribution_v1",
    JSON.stringify({
      landingPage: "https://www.wynwoodschoolofmusic.com/our-story",
      referrer: "https://www.google.com/",
      capturedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1_000).toISOString(),
    })
  );
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/contact",
    "https://www.wynwoodschoolofmusic.com/our-story",
    new MemoryStorage(),
    sessionStorage
  );

  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(
    attribution.landingPage,
    "https://www.wynwoodschoolofmusic.com/our-story"
  );
  assert.equal(attribution.referrer, "https://www.google.com/");
});

test("tagged session fallback still expires after 90 days", () => {
  const sessionStorage = new MemoryStorage();
  sessionStorage.setItem(
    "wsm_lead_session_attribution_v1",
    JSON.stringify({
      gclid: "expired-session-click",
      landingPage: "https://www.wynwoodschoolofmusic.com/paid-landing",
      capturedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1_000).toISOString(),
    })
  );
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/contact",
    "https://www.google.com/",
    new MemoryStorage(),
    sessionStorage
  );

  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(attribution.gclid, undefined);
  assert.equal(
    attribution.landingPage,
    "https://www.wynwoodschoolofmusic.com/contact"
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

test("selects the newest complete tagged visit instead of merging two tabs", () => {
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  localStorage.setItem(
    "wsm_lead_attribution_v1",
    JSON.stringify({
      utmSource: "new-campaign",
      landingPage: "https://www.wynwoodschoolofmusic.com/new-landing",
      capturedAt: "2026-09-15T15:00:00.000Z",
    })
  );
  sessionStorage.setItem(
    "wsm_lead_session_attribution_v1",
    JSON.stringify({
      gclid: "old-click-that-must-not-leak",
      landingPage: "https://www.wynwoodschoolofmusic.com/old-landing",
      capturedAt: "2026-09-15T14:00:00.000Z",
    })
  );
  installBrowser(
    "https://www.wynwoodschoolofmusic.com/contact",
    "",
    localStorage,
    sessionStorage
  );

  const attribution = getLeadAttribution();
  assert.equal(attribution.utmSource, "new-campaign");
  assert.equal(attribution.gclid, undefined);
  assert.equal(
    attribution.landingPage,
    "https://www.wynwoodschoolofmusic.com/new-landing"
  );
});

test("uses the newer session record when replacing old persistence fails", () => {
  const localStorage = new WriteBlockedStorage();
  localStorage.setItem(
    "wsm_lead_attribution_v1",
    JSON.stringify({
      gclid: "old-click-that-must-not-leak",
      landingPage: "https://www.wynwoodschoolofmusic.com/old-landing",
      capturedAt: "2026-09-14T00:00:00.000Z",
    })
  );
  localStorage.writesBlocked = true;
  const sessionStorage = new MemoryStorage();
  const taggedUrl =
    "https://www.wynwoodschoolofmusic.com/trial-music-lesson?utm_source=new-campaign&utm_medium=email";
  installBrowser(taggedUrl, "", localStorage, sessionStorage);

  captureLeadAttributionFromUrl();

  const attribution = getLeadAttribution();
  assert.equal(attribution.utmSource, "new-campaign");
  assert.equal(attribution.utmMedium, "email");
  assert.equal(attribution.gclid, undefined);
  assert.equal(attribution.landingPage, taggedUrl);
});

test("capture remains a no-op during server rendering", () => {
  assert.doesNotThrow(() => captureLeadAttributionFromUrl());
  assert.deepEqual(getLeadAttribution(), {});
});
