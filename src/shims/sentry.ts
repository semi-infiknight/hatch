export function captureException(..._args: unknown[]) {}
export function captureMessage(..._args: unknown[]) {}
export function captureReactException(..._args: unknown[]) {}
export function addBreadcrumb(..._args: unknown[]) {}

const Sentry = {
  captureException,
  captureMessage,
  captureReactException,
  addBreadcrumb,
}

export default Sentry
