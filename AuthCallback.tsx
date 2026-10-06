// Single source of truth lives in src/AuthCallback.tsx (loading state +
// cancelled flag). This root wrapper delegates to it so both import paths
// (`./AuthCallback` and `./src/AuthCallback`) share one implementation.
export { default } from "./src/AuthCallback";
