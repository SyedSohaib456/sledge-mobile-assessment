import { Capture, SyncStatus } from '../store/captureStore';

// Simulates a network API call with realistic latency and failure rate
export async function syncCapture(capture: Capture): Promise<{ ok: true }> {
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

  // 25% failure rate to demo error state
  if (Math.random() < 0.25) {
    throw new Error('Server unreachable. Will retry.');
  }

  return { ok: true };
}

export async function syncPendingCaptures(
  captures: Capture[],
  updateFn: (id: string, status: SyncStatus, error?: string) => void,
): Promise<void> {
  const pending = captures.filter(c => c.syncStatus === 'pending' || c.syncStatus === 'error');

  for (const capture of pending) {
    updateFn(capture.id, 'syncing');
    try {
      await syncCapture(capture);
      updateFn(capture.id, 'synced');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      updateFn(capture.id, 'error', message);
    }
  }
}
