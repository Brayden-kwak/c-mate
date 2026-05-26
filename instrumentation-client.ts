// React 19 dev-mode bug: performance.measure() throws when startTime is
// negative due to fiber timing sentinel values (-1.1) not being fully guarded
// in all code paths. Only occurs in development; no-ops in production.
if (
  process.env.NODE_ENV !== "production" &&
  typeof performance !== "undefined" &&
  typeof performance.measure === "function"
) {
  const original = performance.measure.bind(performance);
  // @ts-expect-error overriding built-in to patch React 19 timing bug
  performance.measure = (...args: Parameters<typeof performance.measure>) => {
    try {
      return original(...args);
    } catch (e) {
      if (e instanceof TypeError && e.message.includes("negative time stamp")) {
        return;
      }
      throw e;
    }
  };
}
