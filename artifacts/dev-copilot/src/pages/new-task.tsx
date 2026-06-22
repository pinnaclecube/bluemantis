import { useCreateTask, useListRepositories, getListTasksQueryKey } from "@workspace/api-client-react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckSquare } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  acceptanceCriteria: z.string().nullable().optional(),
  status: z.enum(["open", "in-progress", "review", "done", "blocked"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  type: z.enum(["feature", "bug", "chore", "story"]),
  source: z.string().min(1, "Source is required"),
  externalId: z.string().nullable().optional(),
  linkedCommit: z.string().nullable().optional(),
  repositoryId: z.coerce.number().nullable().optional().or(z.literal("none")).transform(val => val === "none" || val === 0 ? null : val)
});

export default function NewTask() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const initialRepoId = searchParams.get("repositoryId");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: repos } = useListRepositories();
  const createTask = useCreateTask();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      acceptanceCriteria: "",
      status: "open",
      priority: "medium",
      type: "feature",
      source: "manual",
      externalId: "",
      linkedCommit: "",
      repositoryId: initialRepoId ? parseInt(initialRepoId) : null
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTask.mutate({ data: values }, {
      onSuccess: (newTask) => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        toast({ title: "Task created successfully" });
        setLocation(`/tasks/${newTask.id}`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 px-5 py-4 animate-in fade-in duration-500 pb-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/tasks")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Create Task</h1>
          <p className="text-muted-foreground mt-1 text-xs">Add a new task manually or link an external issue</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-mono text-muted-foreground flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" /> Task Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground">Title</FormLabel>
                    <FormControl><Input {...field} className="font-mono text-base bg-muted/30 h-12" placeholder="Brief summary of the task..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/20 border rounded-lg">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs text-muted-foreground">Source System</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono bg-background"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="jira">Jira</SelectItem>
                          <SelectItem value="azure-devops">Azure DevOps</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="externalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs text-muted-foreground">External ID (Optional)</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} className="font-mono bg-background" placeholder="e.g. PROJ-123 or #456" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs text-muted-foreground">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono text-xs bg-muted/30"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs text-muted-foreground">Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono text-xs bg-muted/30"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs text-muted-foreground">Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-mono text-xs bg-muted/30"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="chore">Chore</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repositoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs text-muted-foreground">Repository</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(val === "none" ? null : parseInt(val))} 
                        defaultValue={field.value?.toString() || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="font-mono text-xs bg-muted/30"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {repos?.map(r => (
                            <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="linkedCommit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground">Linked Commit SHA (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} className="font-mono bg-muted/30" placeholder="e.g. a1b2c3d4" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground">Description</FormLabel>
                    <FormControl><Textarea {...field} value={field.value || ""} className="min-h-[150px] font-mono text-sm bg-muted/30" placeholder="Detailed description of the task..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptanceCriteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground">Acceptance Criteria</FormLabel>
                    <FormControl><Textarea {...field} value={field.value || ""} className="min-h-[100px] font-mono text-sm bg-muted/30" placeholder="- Criteria 1&#10;- Criteria 2" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setLocation("/tasks")} className="font-mono text-xs w-32">Cancel</Button>
                <Button type="submit" disabled={createTask.isPending} className="font-mono text-xs w-40">
                  {createTask.isPending ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}