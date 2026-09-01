import { Router, Request, Response } from "express";
import { store } from "../store/dataStore";

export const platformsRouter = Router();

/**
 * GET /api/v1/platforms
 * List all supported social platforms with aggregated metrics.
 */
platformsRouter.get("/", (_req: Request, res: Response) => {
  try {
    const platforms = store.getPlatformsIntelligence();
    res.json({
      success: true,
      data: platforms,
      timestamp: new Date().toISOString(),
      provenance: "observed_and_simulated",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/v1/platforms/compare
 * Cross-platform metrics comparison, sentiment comparison, and propagation events.
 */
platformsRouter.get("/compare", (_req: Request, res: Response) => {
  try {
    const comparison = store.getCrossPlatformComparison();
    res.json({
      success: true,
      data: comparison,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/v1/platforms/:id
 * Deep dive metrics for a single social platform.
 */
platformsRouter.get("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const platforms = store.getPlatformsIntelligence();
    const platform = platforms.find((p) => p.id === id);

    if (!platform) {
      return res.status(404).json({ success: false, error: `Platform ${id} not found` });
    }

    res.json({
      success: true,
      data: platform,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * POST /api/v1/platforms/:id/sync
 * Trigger a synchronization job for a social platform connector.
 */
platformsRouter.post("/:id/sync", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const platforms = store.getPlatformsIntelligence();
    const platform = platforms.find((p) => p.id === id);

    if (!platform) {
      return res.status(404).json({ success: false, error: `Platform ${id} not found` });
    }

    platform.lastSyncAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Synchronization triggered for ${platform.name}`,
      data: platform,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
