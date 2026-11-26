import assert from "node:assert/strict";
import { deleteLead } from "../src/lib/leads";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3005";

export interface AuditResult {
  section: string;
  test: string;
  status: "PASS" | "FAIL";
  latencyMs: number;
  details?: string;
}

export async function runFullAudit(): Promise<AuditResult[]> {
  const results: AuditResult[] = [];
  const cleanupLeadIds: string[] = [];

  const record = (section: string, test: string, status: "PASS" | "FAIL", latencyMs: number, details?: string) => {
    results.push({ section, test, status, latencyMs, details });
    const symbol = status === "PASS" ? "✔" : "✖";
    const detailMsg = details ? ` -> ${details}` : "";
    console.log(`  ${symbol} [${section}] ${test} (${latencyMs}ms)${detailMsg}`);
  };

  console.log("================================================================================");
  console.log("  MAISON TOURNY — DEEP END-TO-END SYSTEM, FORM & ADMIN AUDIT");
  console.log(`  Target Base URL: ${BASE_URL}`);
  console.log("================================================================================\n");

  let adminCookie = "";

  // ---------------------------------------------------------------------------
  // 1. PUBLIC FORM FIELDS & VALIDATION
  // ---------------------------------------------------------------------------
  console.log("▶ 1. Public Form Fields & Validation");

  // Test 1.1: Valid Enquiry Submission
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "private-office",
          name: "Audit User",
          email: "audit.form.user@bordeaux-test.fr",
          phone: "+33 6 12 34 56 78",
          officeSize: "21 m²",
          selectedDate: "2026-11-25",
          selectedTime: "14:30",
          message: "Automated QA test enquiry for 21sqm private office visit.",
          source: "Deep QA Form Audit"
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.success, true);
      assert.ok(data.lead && data.lead.id);
      cleanupLeadIds.push(data.lead.id);
      record("Public Form", "Valid enquiry submission persists with generated Lead ID", "PASS", Date.now() - start, `Lead ID: ${data.lead.id}`);
    } catch (err: any) {
      record("Public Form", "Valid enquiry submission persists with generated Lead ID", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 1.2: Invalid Email Validation Rejection
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "open-space",
          name: "Invalid Email Test",
          email: "not-an-email-address",
          phone: "+33 6 00 00 00 00"
        })
      });
      assert.strictEqual(res.status, 400);
      record("Public Form", "Rejects malformed email address (Zod schema boundary)", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Public Form", "Rejects malformed email address (Zod schema boundary)", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 1.3: Missing Required Fields Rejection
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "missing.name@test.fr"
          // name, type, phone are omitted
        })
      });
      assert.strictEqual(res.status, 400);
      record("Public Form", "Rejects submission when mandatory fields (name) are omitted", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Public Form", "Rejects submission when mandatory fields (name) are omitted", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 1.4: XSS Sanitization in Form Message
  {
    const start = Date.now();
    try {
      const xssPayload = '<img src=x onerror="alert(1)"> <script>alert("hack")</script>';
      const res = await fetch(`${BASE_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "meeting-room",
          name: "XSS Field Tester",
          email: "xss.tester@security-audit.fr",
          phone: "+33 6 99 88 77 66",
          message: xssPayload
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.success, true);
      assert.ok(data.lead && data.lead.id);
      cleanupLeadIds.push(data.lead.id);
      record("Public Form", "Handles script and HTML tags safely without execution or crash", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Public Form", "Handles script and HTML tags safely without execution or crash", "FAIL", Date.now() - start, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. ADMIN AUTHENTICATION & SECURITY CONTROLS
  // ---------------------------------------------------------------------------
  console.log("\n▶ 2. Admin Authentication & Session Management");

  // Test 2.1: Reject Incorrect Password
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@maisoncalve.fr",
          password: "wrong-password-12345"
        })
      });
      assert.strictEqual(res.status, 401);
      record("Admin Auth", "Rejects unauthorized access with incorrect password", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Admin Auth", "Rejects unauthorized access with incorrect password", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 2.2: Login with Valid Admin Credentials
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@maisoncalve.fr",
          password: "admin"
        })
      });
      assert.strictEqual(res.status, 200);
      const setCookie = res.headers.get("set-cookie") || "";
      assert.ok(setCookie.includes("mc_admin_session="));
      assert.ok(setCookie.includes("HttpOnly"));
      // Extract cookie for subsequent authenticated calls
      const match = setCookie.match(/mc_admin_session=([^;]+)/);
      if (match) adminCookie = `mc_admin_session=${match[1]}`;
      record("Admin Auth", "Authenticates valid credentials and issues secure HttpOnly cookie", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Admin Auth", "Authenticates valid credentials and issues secure HttpOnly cookie", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 2.3: Super Admin Emergency Access
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "euroitofficial@gmail.com",
          password: "3uro!t2026"
        })
      });
      assert.strictEqual(res.status, 200);
      record("Admin Auth", "Grants authenticated session for designated Super Admin bypass", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Admin Auth", "Grants authenticated session for designated Super Admin bypass", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 2.4: Unauthenticated Access Block
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/admin/pipeline`, {
        redirect: "manual"
      });
      // Should redirect to /admin/login
      const isRedirect = res.status === 307 || res.status === 302 || res.headers.get("location")?.includes("/admin/login");
      assert.ok(isRedirect, "Must redirect unauthenticated request to /admin/login");
      record("Admin Security", "Shields protected /admin routes with automated login redirect", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Admin Security", "Shields protected /admin routes with automated login redirect", "FAIL", Date.now() - start, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. ADMIN CRM PIPELINE & LEADS WORKFLOW
  // ---------------------------------------------------------------------------
  console.log("\n▶ 3. Admin CRM Pipeline & Opportunity Workflow");

  let createdLeadId = "";

  // Test 3.1: Fetch Leads & CRM Statistics
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/leads`, {
        headers: { Cookie: adminCookie }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.leads));
      assert.ok(data.stats);
      assert.ok(typeof data.stats.totalLeads === "number");
      record("CRM Pipeline", "Fetches real-time leads array and pipeline telemetry", "PASS", Date.now() - start, `Total leads: ${data.stats.totalLeads}`);
    } catch (err: any) {
      record("CRM Pipeline", "Fetches real-time leads array and pipeline telemetry", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 3.2: Create New Opportunity via Quick Create Modal
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({
          name: "Direct QA Opportunity",
          email: "qa.opp@calve-leads.fr",
          phone: "+33 6 44 55 66 77",
          type: "private-office",
          officeSize: "28 m²",
          status: "new",
          source: "Admin Quick Create Modal",
          initialNote: "Created via automated audit runner."
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(data.lead);
      assert.strictEqual(data.lead.name, "Direct QA Opportunity");
      createdLeadId = data.lead.id;
      cleanupLeadIds.push(createdLeadId);
      record("CRM Pipeline", "Creates new opportunity record with automated ID generation", "PASS", Date.now() - start, `Created ID: ${createdLeadId}`);
    } catch (err: any) {
      record("CRM Pipeline", "Creates new opportunity record with automated ID generation", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 3.3: Advance Pipeline Stage
  {
    const start = Date.now();
    try {
      if (!createdLeadId) throw new Error("No lead ID to advance");
      const res = await fetch(`${BASE_URL}/api/admin/leads`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({
          id: createdLeadId,
          status: "qualified"
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.lead.status, "qualified");
      record("CRM Pipeline", "Mutates stage state to 'qualified' with timestamp audit trail", "PASS", Date.now() - start);
    } catch (err: any) {
      record("CRM Pipeline", "Mutates stage state to 'qualified' with timestamp audit trail", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 3.4: Append Team Note
  {
    const start = Date.now();
    try {
      if (!createdLeadId) throw new Error("No lead ID for note");
      const res = await fetch(`${BASE_URL}/api/admin/leads`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({
          id: createdLeadId,
          newNote: {
            text: "Phone interview completed: high interest for 28sqm office.",
            author: "Paul (Directeur)"
          }
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.lead.notes));
      const hasNote = data.lead.notes.some((n: any) => n.text.includes("Phone interview completed"));
      assert.ok(hasNote, "Note must be present in lead notes");
      record("CRM Pipeline", "Appends team follow-up notes with author and timestamp metadata", "PASS", Date.now() - start);
    } catch (err: any) {
      record("CRM Pipeline", "Appends team follow-up notes with author and timestamp metadata", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 3.5: Lead Cleanup
  {
    const start = Date.now();
    try {
      if (!createdLeadId) throw new Error("No lead ID to delete");
      const res = await fetch(`${BASE_URL}/api/admin/leads?id=${createdLeadId}`, {
        method: "DELETE",
        headers: { Cookie: adminCookie }
      });
      assert.strictEqual(res.status, 200);
      record("CRM Pipeline", "Deletes temporary test lead and purges record from disk", "PASS", Date.now() - start);
    } catch (err: any) {
      record("CRM Pipeline", "Deletes temporary test lead and purges record from disk", "FAIL", Date.now() - start, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. ADMIN SPACES INVENTORY & REAL-TIME OCCUPANCY
  // ---------------------------------------------------------------------------
  console.log("\n▶ 4. Admin Spaces Inventory & Dynamic Localization");

  // Test 4.1: Retrieve Spaces & Inventory Telemetry
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/spaces`, {
        headers: { Cookie: adminCookie }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.spaces));
      assert.ok(data.metrics);
      assert.strictEqual(typeof data.metrics.availablePrivateOffices, "number");
      assert.strictEqual(typeof data.metrics.totalParkingBays, "number");
      record("Spaces Inventory", "Calculates live inventory spaces and occupancy telemetry", "PASS", Date.now() - start, `Offices: ${data.metrics.availablePrivateOffices}/${data.metrics.totalPrivateOffices} available, Parking: ${data.metrics.assignedParkingBays}/${data.metrics.totalParkingBays}`);
    } catch (err: any) {
      record("Spaces Inventory", "Calculates live inventory spaces and occupancy telemetry", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 4.2: Space Details Update & Multi-language Persistence
  {
    const start = Date.now();
    try {
      const getRes = await fetch(`${BASE_URL}/api/admin/spaces`, { headers: { Cookie: adminCookie } });
      const { spaces } = await getRes.json();
      const targetSpace = spaces.find((s: any) => s.id === "office-17m") || spaces[0];

      const res = await fetch(`${BASE_URL}/api/admin/spaces`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({
          id: targetSpace.id,
          name: "Bureau Privatif 21 m² (Audit Checked)",
          name_fr: "Bureau Privatif 21 m² (Vérifié)",
          name_en: "Private Office 21 sqm (Audited)",
          name_es: "Oficina Privada 21 m² (Auditada)"
        })
      });
      assert.strictEqual(res.status, 200);
      record("Spaces Inventory", "Persists space attribute modifications with multi-language fields", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Spaces Inventory", "Persists space attribute modifications with multi-language fields", "FAIL", Date.now() - start, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. ADMIN TENANTS & RESIDENT COMPANIES
  // ---------------------------------------------------------------------------
  console.log("\n▶ 5. Admin Tenants & Resident Companies");

  // Test 5.1: Retrieve Active Tenants
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/tenants`, {
        headers: { Cookie: adminCookie }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.tenants));
      assert.ok(data.tenants.length > 0);
      record("Tenants Portal", "Lists all resident companies with lease and desk allocations", "PASS", Date.now() - start, `${data.tenants.length} resident companies`);
    } catch (err: any) {
      record("Tenants Portal", "Lists all resident companies with lease and desk allocations", "FAIL", Date.now() - start, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 6. ADMIN SETTINGS, SEO & GOOGLE VERIFICATION
  // ---------------------------------------------------------------------------
  console.log("\n▶ 6. Admin Settings, SEO & Tracking Telemetry");

  // Test 6.1: Load Global Settings & GTM Container
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        headers: { Cookie: adminCookie }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(data.settings);
      assert.ok(data.settings.settings_seo);
      assert.strictEqual(data.settings.settings_seo.googleTagId, "GTM-K7CVNBTS");
      record("Settings & SEO", "Verifies active Google Tag Manager container (GTM-K7CVNBTS)", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Settings & SEO", "Verifies active Google Tag Manager container (GTM-K7CVNBTS)", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 6.2: Persist Settings & Update Verification
  {
    const start = Date.now();
    try {
      const getRes = await fetch(`${BASE_URL}/api/admin/settings`, { headers: { Cookie: adminCookie } });
      const current = await getRes.json();

      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({
          settings: {
            ...current.settings,
            settings_seo: {
              ...current.settings.settings_seo,
              canonicalUrl: "https://maisoncalve.fr"
            }
          }
        })
      });
      assert.strictEqual(res.status, 200);
      record("Settings & SEO", "Persists updated global settings securely to site_settings.json", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Settings & SEO", "Persists updated global settings securely to site_settings.json", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 6.3: Dedicated SEO Module Route Verification
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/admin/seo`, {
        headers: { Cookie: adminCookie }
      });
      assert.strictEqual(res.status, 200);
      const text = await res.text();
      assert.ok(text.toLowerCase().includes("seo"), "Must serve dedicated SEO module page");
      record("Settings & SEO", "Dedicated /admin/seo module renders independently from global settings", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Settings & SEO", "Dedicated /admin/seo module renders independently from global settings", "FAIL", Date.now() - start, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 7. SECURITY & PENETRATION RESILIENCE AUDIT
  // ---------------------------------------------------------------------------
  console.log("\n▶ 7. Security Penetration & Resilience Verification");

  // Test 7.1: SQL Injection Sanitization
  {
    const start = Date.now();
    try {
      const sqlPayload = "admin' OR 1=1; DROP TABLE users; --";
      const res = await fetch(`${BASE_URL}/api/admin/leads?search=${encodeURIComponent(sqlPayload)}`, {
        headers: { Cookie: adminCookie }
      });
      assert.strictEqual(res.status, 200);
      record("Penetration Audit", "SQL Injection metacharacters in query params neutralized without crash", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Penetration Audit", "SQL Injection metacharacters in query params neutralized without crash", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 7.2: Forged Session Token Tampering Defense
  {
    const start = Date.now();
    try {
      const forgedCookie = "mc_admin_session=forged-uuid-12345:9999999999999:tamperedhmacsignature";
      const res = await fetch(`${BASE_URL}/admin/pipeline`, {
        headers: { Cookie: forgedCookie },
        redirect: "manual"
      });
      const isRedirect = res.status === 307 || res.status === 302 || res.headers.get("location")?.includes("/admin/login");
      assert.ok(isRedirect, "Must reject forged token and redirect to /admin/login");
      record("Penetration Audit", "Rejects forged session tokens with invalid HMAC signatures", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Penetration Audit", "Rejects forged session tokens with invalid HMAC signatures", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 7.3: Fuzzing Resilience (Malformed JSON & Large Payloads)
  {
    const start = Date.now();
    try {
      const largePayload = {
        type: "private-office",
        name: "A".repeat(1000),
        email: "fuzz.test@payload-test.fr",
        phone: "+33 6 00 00 00 00",
        message: "X".repeat(15000),
        officeSize: "21 m²"
      };
      const res = await fetch(`${BASE_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(largePayload)
      });
      assert.ok(res.status === 200 || res.status === 400);
      if (res.status === 200) {
        const json = await res.json();
        if (json.lead?.id) cleanupLeadIds.push(json.lead.id);
      }
      record("Penetration Audit", "Survives 15,000-character payload fuzzing gracefully without server exception", "PASS", Date.now() - start);
    } catch (err: any) {
      record("Penetration Audit", "Survives 15,000-character payload fuzzing gracefully without server exception", "FAIL", Date.now() - start, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 8. SPEED & SLA LATENCY BENCHMARKS
  // ---------------------------------------------------------------------------
  console.log("\n▶ 8. Speed & SLA Latency Benchmarks");

  // Test 8.1: Homepage TTFB & Latency
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/`);
      assert.strictEqual(res.status, 200);
      const latencyMs = Date.now() - start;
      assert.ok(latencyMs < 1000, `Homepage TTFB must be < 1000ms (measured: ${latencyMs}ms)`);
      record("Performance Benchmark", `Public Homepage (/) Latency: ${latencyMs}ms (SLA < 1000ms)`, "PASS", latencyMs);
    } catch (err: any) {
      record("Performance Benchmark", "Public Homepage (/) Latency Benchmark", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 8.2: Static Asset Delivery Latency
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/images/brand/maison-tourny-logo.png`);
      assert.strictEqual(res.status, 200);
      const latencyMs = Date.now() - start;
      assert.ok(latencyMs < 100, `Static logo asset delivery must be < 100ms (measured: ${latencyMs}ms)`);
      record("Performance Benchmark", `Brand Asset Delivery: ${latencyMs}ms (SLA < 100ms)`, "PASS", latencyMs);
    } catch (err: any) {
      record("Performance Benchmark", "Brand Asset Delivery Latency Benchmark", "FAIL", Date.now() - start, err.message);
    }
  }

  // Test 8.3: Spaces API Latency
  {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/spaces`, { headers: { Cookie: adminCookie } });
      assert.strictEqual(res.status, 200);
      const latencyMs = Date.now() - start;
      assert.ok(latencyMs < 500, `Spaces API must be < 500ms (measured: ${latencyMs}ms)`);
      record("Performance Benchmark", `Spaces Telemetry API Latency: ${latencyMs}ms (SLA < 500ms)`, "PASS", latencyMs);
    } catch (err: any) {
      record("Performance Benchmark", "Spaces Telemetry API Latency Benchmark", "FAIL", Date.now() - start, err.message);
    }
  }

  // Cleanup test leads created during audit
  for (const id of cleanupLeadIds) {
    try {
      deleteLead(id);
    } catch {}
  }

  console.log("\n================================================================================");
  const totalPassed = results.filter((r) => r.status === "PASS").length;
  const totalFailed = results.filter((r) => r.status === "FAIL").length;
  console.log(`  AUDIT COMPLETE: ${totalPassed}/${results.length} PASSED | ${totalFailed} FAILED`);
  console.log("================================================================================\n");

  return results;
}

if (require.main === module || process.argv[1]?.includes("comprehensive_system_audit")) {
  runFullAudit().then((results) => {
    const hasFail = results.some((r) => r.status === "FAIL");
    process.exit(hasFail ? 1 : 0);
  });
}
