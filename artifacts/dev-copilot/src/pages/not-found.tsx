import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Terminal } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 border-dashed bg-card/50 backdrop-blur-xl">
        <CardContent className="pt-6 pb-8 flex flex-col items-center text-center">
          <div className="p-4 bg-muted/50 rounded-full mb-4">
            <Terminal className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">404</h1>
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-6">
            Command not found
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved. Check the URL and try again.
          </p>

          <Button asChild className="font-mono text-xs uppercase tracking-wider">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}