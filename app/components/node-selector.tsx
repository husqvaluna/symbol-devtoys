import React from "react";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";

export interface NodeSelectorProps {
  className?: string;
  size?: "sm" | "default";
  layout?: "horizontal" | "vertical";
}

export function NodeSelector({ className, size = "default", layout = "horizontal" }: NodeSelectorProps) {
  const { selectedNetwork, selectedNodeUrl, availableNodes, isLoading, setNetwork, setNodeUrl } = useNetworkSelection();

  const selectSize = size === "sm" ? "sm" : "default";

  const containerClasses = cn("flex gap-2", layout === "vertical" ? "flex-col" : "flex-row items-end", className);

  const selectClasses = cn(size === "sm" ? "h-8 text-xs" : "h-10", layout === "horizontal" ? "min-w-[120px]" : "w-full");

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="space-y-2">
          <div className={cn("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", selectClasses)} />
        </div>
        <div className="space-y-2">
          <div className={cn("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", selectClasses)} />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="space-y-2">
        <Select value={selectedNetwork} onValueChange={setNetwork}>
          <SelectTrigger id="network-select" className={selectClasses} size={selectSize}>
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TESTNET">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>TestNet</span>
              </div>
            </SelectItem>
            <SelectItem value="MAINNET">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>MainNet</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Node Selection */}
      <div className="space-y-2">
        <Select value={selectedNodeUrl || ""} onValueChange={setNodeUrl} disabled={availableNodes.length === 0}>
          <SelectTrigger id="node-select" className={selectClasses} size={selectSize}>
            <SelectValue placeholder="Select a node" />
          </SelectTrigger>
          <SelectContent>
            {availableNodes.map((nodeUrl, index) => (
              <SelectItem key={nodeUrl} value={nodeUrl}>
                <div className="flex items-center gap-2">
                  <span className="truncate">{nodeUrl.replace(/^https?:\/\//, "").replace(/:\d+$/, "")}</span>
                </div>
              </SelectItem>
            ))}
            {availableNodes.length === 0 && (
              <SelectItem value="" disabled>
                No nodes available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
