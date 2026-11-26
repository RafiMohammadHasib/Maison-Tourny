import { NextResponse } from "next/server";
import {
  getUnifiedSpaces,
  getInventoryMetrics,
  SpaceInventoryRecord,
  saveCustomSpaceOverride,
  removeCustomSpace
} from "@/lib/inventorySync";
import { getLeads } from "@/lib/leads";
import {
  isOvhBridgeConfigured,
  fetchOvhSpaces,
  updateOvhSpace,
  addOvhSpace,
  deleteOvhSpace
} from "@/lib/ovhBridge";

// In-memory / file cache for space state overrides
let customSpacesCache: SpaceInventoryRecord[] | null = null;

export async function GET() {
  try {
    // 1. Try fetching from OVH MySQL Database
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await fetchOvhSpaces();
        if (ovhRes.success && Array.isArray(ovhRes.spaces) && ovhRes.spaces.length > 0) {
          return NextResponse.json({
            success: true,
            source: "ovh_mysql",
            spaces: ovhRes.spaces,
            metrics: ovhRes.metrics || getInventoryMetrics(getLeads()),
            timestamp: new Date().toISOString()
          });
        }
      } catch (ovhErr) {
        console.warn("OVH spaces unreachable, using local fallback:", ovhErr);
      }
    }

    // 2. Fallback to local computation
    const leads = getLeads();
    const spaces = getUnifiedSpaces(leads);
    customSpacesCache = spaces;
    const metrics = getInventoryMetrics(leads);

    return NextResponse.json({
      success: true,
      source: "local_cache",
      spaces,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error fetching spaces inventory:", err);
    return NextResponse.json(
      { success: false, message: "Erreur lors du chargement des espaces" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    // Persist to disk
    saveCustomSpaceOverride(id, body);

    // Refresh local cache with updated overrides
    const leads = getLeads();
    customSpacesCache = getUnifiedSpaces(leads);
    const updatedSpace = customSpacesCache.find((s) => s.id === id) || null;

    // Sync to OVH MySQL Database if configured
    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await updateOvhSpace(id, body);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not sync space to OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Espace mis à jour avec succès.",
      space: updatedSpace,
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    console.error("Error updating space:", err);
    return NextResponse.json({ success: false, message: "Erreur mise à jour espace" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ success: false, message: "ID et nom requis" }, { status: 400 });
    }

    // Persist to disk
    saveCustomSpaceOverride(body.id, body);

    // Refresh cache
    const leads = getLeads();
    customSpacesCache = getUnifiedSpaces(leads);
    const createdSpace = customSpacesCache.find((s) => s.id === body.id) || body;

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await addOvhSpace(body);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not add space to OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Espace créé",
      space: createdSpace,
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Erreur création espace" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "ID requis" }, { status: 400 });
    }

    // Mark deleted on disk
    removeCustomSpace(id);

    // Refresh cache
    const leads = getLeads();
    customSpacesCache = getUnifiedSpaces(leads);

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await deleteOvhSpace(id);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not delete space in OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Espace supprimé",
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Erreur suppression espace" }, { status: 500 });
  }
}
