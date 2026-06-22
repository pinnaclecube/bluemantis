import { Clock } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="px-5 py-4">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">History</h1>
      <p className="mt-0.5 text-xs text-muted-foreground">Past tasks and accepted suggestions</p>

      <div className="mt-4 flex h-[360px] flex-col items-center justify-center gap-3 rounded-md border bg-card text-muted-foreground">
        <Clock className="h-9 w-9 opacity-20" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Nothing here yet</p>
          <p className="mt-0.5 text-xs">Completed tasks and the suggestions you accepted will appear here.</p>
        </div>
      </div>
    </div>
  );
}
