// Measure real frame intervals, independently of the simulation's capped dt.
// Compilation and returning from another tab are not sustained GPU pressure.
export function createFrameQuality() {
  let start, last, elapsed = 0, frames = 0, slowWindows = 0;
  function reset() { start = last = undefined; elapsed = frames = slowWindows = 0; }
  function observe(now, visible = true) {
    if (!visible || !Number.isFinite(now)) { reset(); return null; }
    if (last === undefined || now <= last || now - last > 1000) {
      reset(); start = last = now; return null;
    }
    const interval = now - last; last = now;
    if (now - start < 3000) return null;
    elapsed += interval; frames++;
    if (elapsed < 2000) return null;
    const meanMs = elapsed / frames;
    slowWindows = meanMs > 30 ? slowWindows + 1 : 0;
    const result = {meanMs, frames, reduce: slowWindows >= 2};
    elapsed = frames = 0;
    if (result.reduce) slowWindows = 0;
    return result;
  }
  return {observe, reset};
}
