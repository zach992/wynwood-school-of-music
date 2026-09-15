import assert from "node:assert/strict";
import test from "node:test";

import {
  airtableLeadSourceFields,
  DEFAULT_LEADS_TABLE,
  leadTableName,
} from "./lead-table.ts";

test("uses one default Airtable table for every lead form", () => {
  assert.equal(leadTableName(undefined), DEFAULT_LEADS_TABLE);
  assert.equal(DEFAULT_LEADS_TABLE, "Leads");
});

test("supports a deployment-specific unified table name", () => {
  assert.equal(leadTableName(" WSM Leads "), "WSM Leads");
});

test("stores the form used separately from the original landing page", () => {
  assert.deepEqual(airtableLeadSourceFields("contact"), {
    "Form Source": "Contact Us Form",
  });
  assert.deepEqual(airtableLeadSourceFields("trial"), {
    "Form Source": "Trial Lesson Form",
  });
});
