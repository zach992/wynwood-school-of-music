const endpoint = process.env.GOOGLE_OFFLINE_CONVERSIONS_ENDPOINT?.trim();
const cronSecret = process.env.CRON_SECRET?.trim();

if (!endpoint || !cronSecret) {
  console.error(
    "GOOGLE_OFFLINE_CONVERSIONS_ENDPOINT and CRON_SECRET are required"
  );
  process.exit(1);
}

let url;
try {
  url = new URL(endpoint);
} catch {
  console.error("GOOGLE_OFFLINE_CONVERSIONS_ENDPOINT must be a valid URL");
  process.exit(1);
}

try {
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${cronSecret}` },
  });
  const body = await response.text();
  let result;

  try {
    result = JSON.parse(body);
  } catch {
    result = { message: body.slice(0, 500) };
  }

  if (!response.ok || result?.ok === false) {
    console.error("Google Ads offline conversion sync failed", {
      status: response.status,
      result,
    });
    process.exit(1);
  }

  console.log("Google Ads offline conversion sync completed", result);
} catch (error) {
  console.error(
    "Google Ads offline conversion sync request failed",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
}
