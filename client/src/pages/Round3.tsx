import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronLeft, Lock, LogIn } from "lucide-react";
import { useAntiCheat } from "@/hooks/use-anti-cheat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getTeams } from "@/lib/store";

interface AuthUser {
  role: "student";
  teamId: string;
}

export default function Round3() {
  const authJson = typeof window !== "undefined" ? sessionStorage.getItem("auth_user") : null;
  const authUser = authJson ? (JSON.parse(authJson) as AuthUser) : null;
  const team = authUser ? getTeams().find((team) => team.id === authUser.teamId) : undefined;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  useAntiCheat();

  const authMutation = useMutation({
    mutationFn: async () => {
      if (!authUser || authUser.role !== "student" || !team) {
        throw new Error("Unauthorized");
      }
      if (team.password !== password) {
        throw new Error("Invalid credentials");
      }
      return true;
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({ title: "Authorized", description: "Identity verified. Round 3 unlocked." });
    },
    onError: () => {
      toast({ 
        title: "Auth Failed", 
        description: "Invalid credentials.",
        variant: "destructive"
      });
    }
  });

  if (!authUser) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
        <div className="w-full max-w-md p-8 border border-white/30 rounded-lg bg-black/40 backdrop-blur-xl">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white font-display tracking-wider uppercase">Round 3 Identity Verification</h1>
            <p className="text-gray-400 font-mono text-sm mt-2">Enter credentials to unlock round content</p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            authMutation.mutate();
          }} className="space-y-6">
            <Input
              type="password"
              placeholder="Confirm Password"
              className="bg-black/50 border-white/10 focus:border-white text-white font-mono text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button 
              type="submit" 
              disabled={authMutation.isPending}
              className="w-full bg-white hover:bg-white/80 text-black font-bold tracking-widest font-display h-12"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {authMutation.isPending ? "VERIFYING..." : "UNLOCK ROUND"}
            </Button>
            <Link href="/">
              <button type="button" className="w-full text-gray-500 hover:text-white text-xs uppercase font-mono mt-4">
                Cancel
              </button>
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 border border-white/10 rounded-lg bg-black/40 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white">Round 3: Web Cloning</h1>
        <Link href="/">
          <button className="text-gray-500 hover:text-white flex items-center gap-2 text-xs uppercase font-mono tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </Link>
      </div>
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300">Welcome to the final round. Clone the provided website design as accurately as possible.</p>
      </div>
    </div>
  );
}
