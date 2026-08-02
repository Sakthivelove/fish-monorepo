// Metro config for a monorepo layout (this app lives at
// apps/mobile, with shared packages like @fish/contracts as
// npm workspace siblings under packages/).
// Docs: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole monorepo, not just this app, so changes to
//    @fish/contracts (or any other workspace package) trigger a
//    Metro rebuild.
config.watchFolders = [workspaceRoot];

// 2. Resolve node_modules from both this app and the workspace
//    root, in that order.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Force Metro to resolve (sub)dependencies only from the
//    nodeModulesPaths above, matching npm workspaces' hoisting.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
