# Google Ads offline conversion feed

This feed runs daily and sends eligible Airtable leads to Google Ads through the
Data Manager API. The two Google Ads actions remain **Secondary** until the feed
has been validated and has enough stable volume to be useful for bidding.

## Airtable rules

- `Qualified – Not Enrolled` uploads `Qualified Lead` once.
- `Enrolled` uploads both `Qualified Lead` and `Enrolled Student` once.
- `Unqualified` is not uploaded.
- A `Lead ID` is required, so records created before the attribution deployment
  are not accidentally backfilled.
- The two `Uploaded At` fields are the idempotency guard. Google also receives a
  stage-specific transaction ID derived from the Lead ID.
- A failed upload writes a timestamped explanation to `Google Ads Upload Error`.

## Required deployment variables

```text
AIRTABLE_TOKEN
AIRTABLE_BASE_ID
CRON_SECRET
GOOGLE_DATA_MANAGER_PROJECT_ID
GOOGLE_DATA_MANAGER_CLIENT_ID
GOOGLE_DATA_MANAGER_CLIENT_SECRET
GOOGLE_DATA_MANAGER_REFRESH_TOKEN
GOOGLE_ADS_CUSTOMER_ID
GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID
GOOGLE_ADS_ENROLLED_STUDENT_ACTION_ID
GOOGLE_OFFLINE_CONVERSIONS_ENABLED
GOOGLE_OFFLINE_CONVERSIONS_LIVE_ENABLED
```

If the form routes use `AIRTABLE_CONTACT_TABLE` or `AIRTABLE_TRIAL_TABLE`
overrides, the conversion feed automatically reads those same table names.

Current Google Ads IDs:

```text
GOOGLE_ADS_CUSTOMER_ID=2525579805
GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID=7768102454
GOOGLE_ADS_ENROLLED_STUDENT_ACTION_ID=7768102457
GOOGLE_OFFLINE_CONVERSIONS_ENABLED=false
GOOGLE_OFFLINE_CONVERSIONS_LIVE_ENABLED=false
```

Never commit the OAuth client secret, refresh token, Airtable token, or cron
secret. Configure them on the Railway web service.

## Railway schedule

Railway cron jobs must run in a separate service that exits after each run; the
website service itself must remain a persistent web service. After this code is
deployed, create a second Railway service from this repository with:

```text
Start command: npm run sync-google-offline-conversions
Cron schedule: 0 12 * * *
GOOGLE_OFFLINE_CONVERSIONS_ENDPOINT=https://www.wynwoodschoolofmusic.com/api/cron/google-ads-offline-conversions
CRON_SECRET=<the same value configured on the web service>
```

Do not schedule the preview environment. The endpoint safely returns a disabled
response until its data-sharing and live-ingestion flags are enabled.

## Compliance follow-up before live uploads

Do not enable live uploads until this is reviewed. The current privacy policy
says email addresses and phone numbers are never shared with third parties, but
the feed would send SHA-256 hashed versions of those identifiers to Google for
advertising measurement. That language needs to be reconciled by an appropriate
privacy/legal reviewer. Also decide whether a consent banner or per-lead consent
record is required for any visitors in jurisdictions covered by Google's EU
User Consent Policy.

The API intentionally omits `adUserData` and `adPersonalization` consent values
because the site does not currently capture evidence for either choice. Do not
change them to `CONSENT_GRANTED` globally without a supportable consent record.

## Safe rollout

1. Enable the Data Manager API in the dedicated Google Cloud project.
2. Authorize the OAuth client with the `datamanager` scope and add the variables.
3. Resolve the privacy/consent follow-up above.
4. Set `GOOGLE_OFFLINE_CONVERSIONS_ENABLED=true`. This allows real customer
   identifiers to be transmitted for validation, but does not enable live
   conversion ingestion.
5. Run the endpoint with `?validateOnly=true`; confirm a zero-failure response.
6. Set `GOOGLE_OFFLINE_CONVERSIONS_LIVE_ENABLED=true` to allow the daily cron
   to ingest newly classified leads.
7. Compare Airtable upload timestamps, Data Manager diagnostics, Google Ads
   counts, and PostHog Lead IDs before considering either action for bidding.
