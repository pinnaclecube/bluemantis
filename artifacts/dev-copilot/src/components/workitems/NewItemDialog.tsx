import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  createWorkItem,
  ApiError,
  type CreatableItemType,
  type WorkItem,
  type Project,
} from "@/services/api";

const ITEM_TYPES: { value: CreatableItemType; label: string }[] = [
  { value: "epic", label: "Epic" },
  { value: "story", label: "Story" },
  { value: "task", label: "Task" },
  { value: "bug", label: "Bug" },
];

export function NewItemDialog({
  project,
  parents,
  open,
  onOpenChange,
  onCreated,
  defaultParentId,
  defaultType = "task",
}: {
  project: Project;
  parents: WorkItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (item: WorkItem) => void;
  defaultParentId?: number;
  defaultType?: CreatableItemType;
}) {
  const { toast } = useToast();
  const [itemType, setItemType] = useState<CreatableItemType>(defaultType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [parentId, setParentId] = useState<string>(defaultParentId ? String(defaultParentId) : "none");
  const [pushToPlm, setPushToPlm] = useState(false);
  const [busy, setBusy] = useState(false);

  const providerLabel = project.plmProvider === "jira" ? "Jira" : "Azure DevOps";
  // Epics/stories make sensible parents.
  const parentOptions = parents.filter((p) => p.itemType === "epic" || p.itemType === "story");

  const reset = () => {
    setItemType(defaultType);
    setTitle("");
    setDescription("");
    setAcceptance("");
    setParentId(defaultParentId ? String(defaultParentId) : "none");
    setPushToPlm(false);
    setBusy(false);
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const submit = async () => {
    if (!title.trim()) {
      toast({ title: "Give the item a title", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const item = await createWorkItem(project.id, {
        itemType,
        title: title.trim(),
        description: description.trim() || undefined,
        acceptanceCriteria: acceptance.trim() || undefined,
        parentId: parentId !== "none" ? Number(parentId) : undefined,
        pushToPlm,
      });
      toast({
        title: "Work item created",
        description: pushToPlm ? `Pushed to ${providerLabel} as ${item.externalId}.` : "Saved locally.",
      });
      onCreated(item);
      close();
    } catch (err) {
      setBusy(false);
      toast({
        title: "Could not create the item",
        description: err instanceof ApiError ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New work item</DialogTitle>
          <DialogDescription>Add an item to {project.name}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={itemType} onValueChange={(v) => setItemType(v as CreatableItemType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Parent (optional)</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {parentOptions.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.title.length > 40 ? `${p.title.slice(0, 40)}…` : p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wi-title">Title</Label>
            <Input
              id="wi-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, action-oriented summary"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wi-desc">Description</Label>
            <Textarea
              id="wi-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wi-ac">Acceptance criteria</Label>
            <Textarea
              id="wi-ac"
              value={acceptance}
              onChange={(e) => setAcceptance(e.target.value)}
              rows={3}
              placeholder="One per line"
            />
          </div>

          <div className="flex items-start gap-3 rounded-md border border-border p-3">
            <Checkbox id="wi-push" checked={pushToPlm} onCheckedChange={(v) => setPushToPlm(v === true)} />
            <div className="space-y-1">
              <Label htmlFor="wi-push" className="cursor-pointer">
                Also create in {providerLabel}
              </Label>
              <p className="text-xs text-muted-foreground">
                Creates the item in {providerLabel} and links it here. Leave off to keep it local until you're ready.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
