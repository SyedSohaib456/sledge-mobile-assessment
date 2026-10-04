import {
  useCaptureStore,
  Capture,
  SyncStatus,
  MAX_RETRIES,
} from "../store/captureStore";

type Notifier = {
  success: (title: string, opts?: { description?: string }) => void;
  error: (title: string, opts?: { description?: string }) => void;
  warning: (title: string, opts?: { description?: string }) => void;
};

async function syncCapture(): Promise<{ ok: true }> {
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 600),
  );

  if (Math.random() < 0.15) {
    throw new Error("Server unreachable. Will retry.");
  }

  return { ok: true };
}

export async function syncPendingCaptures(notify?: Notifier): Promise<void> {
  const { captures, updateSyncStatus, incrementRetry } =
    useCaptureStore.getState();

  const pending = captures.filter(
    (c) =>
      (c.syncStatus === "pending" || c.syncStatus === "error") &&
      c.retryCount < MAX_RETRIES,
  );

  if (pending.length === 0) return;

  let successCount = 0;
  let failCount = 0;

  for (const capture of pending) {
    updateSyncStatus(capture.id, "syncing");
    try {
      await syncCapture();
      updateSyncStatus(capture.id, "synced");
      successCount++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      incrementRetry(capture.id);
      // Re-read fresh state to get updated retryCount
      const fresh = useCaptureStore
        .getState()
        .captures.find((c) => c.id === capture.id);
      const exhausted = fresh ? fresh.retryCount >= MAX_RETRIES : false;
      updateSyncStatus(
        capture.id,
        "error",
        exhausted ? `Max retries reached (${MAX_RETRIES})` : message,
      );
      failCount++;
    }
  }

  if (!notify) return;

  if (successCount > 0 && failCount === 0) {
    notify.success(
      `${successCount} capture${successCount > 1 ? "s" : ""} synced`,
      {
        description: "All records uploaded successfully",
      },
    );
  } else if (successCount > 0 && failCount > 0) {
    notify.warning(`${successCount} synced, ${failCount} failed`, {
      description: "Will retry automatically",
    });
  } else if (failCount > 0) {
    notify.error(`${failCount} failed to sync`, {
      description: "Will retry automatically",
    });
  }
}
