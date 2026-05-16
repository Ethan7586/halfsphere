"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Wifi, WifiOff, AlertTriangle, Server } from "lucide-react";

interface NodeHealth {
  id: string;
  name: string;
  port: number;
  protocol: string;
  region: string | null;
  is_active: boolean;
  health: {
    latency_ms: number | null;
    status: string;
    checked_at: string;
  } | null;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "online") return <Wifi className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === "slow") return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  return <WifiOff className="w-3.5 h-3.5 text-red-400" />;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    online: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    slow: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    offline: "bg-red-400/10 text-red-400 border-red-400/20",
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${map[status] || map.offline}`}>
      {status.toUpperCase()}
    </span>
  );
}

export function BaseCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["network-health"],
    queryFn: async () => {
      const res = await fetch("/api/network/health");
      if (!res.ok) throw new Error("ΦÄ╖σÅûσñ▒Φ┤Ñ");
      return res.json() as Promise<{ data: NodeHealth[] }>;
    },
    refetchInterval: 30000,
  });

  const nodes = data?.data ?? [];
  const onlineCount = nodes.filter((n) => n.health?.status === "online").length;
  const slowCount = nodes.filter((n) => n.health?.status === "slow").length;
  const offlineCount = nodes.filter((n) => n.health?.status === "offline").length;
  const hasNodes = nodes.length > 0;

  return (
    <div className="relative bg-[#0a0e17] border border-[#1a2a3a] rounded-lg p-5 overflow-hidden group">
      {/* Corner marks */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#2a4a6a]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#2a4a6a]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#2a4a6a]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#2a4a6a]" />

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-[#1a3a5a] border border-[#2a5a8a]">
          <Server className="w-4 h-4 text-[#4a9eff]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-wider">BASE STATUS</h3>
          <p className="text-[10px] text-slate-500 font-mono">σƒ║σ£░Φèéτé╣τ¢æµÄº</p>
        </div>
        <Activity className="w-4 h-4 text-emerald-400 ml-auto animate-pulse" />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-600 text-xs font-mono">LOADING...</div>
      ) : !hasNodes ? (
        <div className="text-center py-6">
          <Server className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-mono">NO NODES CONFIGURED</p>
          <p className="text-[10px] text-slate-600 mt-1">
            Settings ΓåÆ σƒ║σ£░ µ╖╗σèáΦèéτé╣
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-emerald-400/5 border border-emerald-400/10 rounded px-3 py-2 text-center">
              <div className="text-lg font-bold text-emerald-400 font-mono">{onlineCount}</div>
              <div className="text-[10px] text-slate-500">ONLINE</div>
            </div>
            <div className="flex-1 bg-amber-400/5 border border-amber-400/10 rounded px-3 py-2 text-center">
              <div className="text-lg font-bold text-amber-400 font-mono">{slowCount}</div>
              <div className="text-[10px] text-slate-500">SLOW</div>
            </div>
            <div className="flex-1 bg-red-400/5 border border-red-400/10 rounded px-3 py-2 text-center">
              <div className="text-lg font-bold text-red-400 font-mono">{offlineCount}</div>
              <div className="text-[10px] text-slate-500">OFFLINE</div>
            </div>
          </div>

          {/* Node list */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center gap-3 px-3 py-2 bg-[#0d1420] border border-[#1a2a3a] rounded hover:border-[#2a4a6a] transition-colors"
              >
                <StatusIcon status={node.health?.status || "offline"} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-300 truncate">{node.name}</div>
                  <div className="text-[10px] text-slate-600 font-mono">
                    {node.protocol} ΓÇó {node.region || "ΓÇö"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">
                    {node.health?.latency_ms == null
                      ? "ΓÇö"
                      : `${node.health.latency_ms}ms`}
                  </div>
                  <StatusBadge status={node.health?.status || "offline"} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
