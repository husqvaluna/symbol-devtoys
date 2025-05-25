import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/keypair", "routes/keypair.tsx"),
  route("/account", "routes/account.tsx"),
  route("/monitor", "routes/monitor.tsx"),
  route("/namespace", "routes/namespace.tsx"),
  route("/mosaic", "routes/mosaic.tsx"),
  route("/block", "routes/block.tsx"),
  route("/transaction", "routes/transaction.tsx"),
  route("/node", "routes/node.tsx"),
  route("/network", "routes/network.tsx"),
  route("/payload", "routes/payload.tsx"),
  route("/fee", "routes/fee.tsx"),
  route("/converter", "routes/converter.tsx"),
  route("/settings", "routes/settings.tsx"),
] satisfies RouteConfig;
