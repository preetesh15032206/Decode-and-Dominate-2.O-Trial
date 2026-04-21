import { useState } from "react";
import { Shield, Users, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getTeams } from "@/lib/store";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");
  const [teamId, setTeamId] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const { toast } = useToast();

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const teams = getTeams();
    const team = teams.find(t => t.id === teamId && t.password === teamPassword);
    
    if (team) {
      localStorage.setItem("auth_user", JSON.stringify({ role: "student", teamId }));
      toast({
        title: "Access Granted",
        description: `Welcome, Team ${teamId}`,
      });
      window.location.href = "/";
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid Team ID or Password.",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "Preetesh@15") {
      localStorage.setItem("auth_user", JSON.stringify({ role: "admin" }));
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the Control Panel.",
      });
      window.location.href = "/admin";
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect admin password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in duration-700">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white font-display tracking-wider mb-2">SYSTEM LOGIN</h1>
        <p className="text-gray-400 font-mono text-sm">AUTHENTICATION REQUIRED</p>
      </div>

      <div className="cyber-card backdrop-blur-xl border-primary/30 p-8">
        <div className="flex space-x-4 mb-8">
          <button 
            className={`flex-1 py-2 font-display tracking-widest text-sm transition-colors border-b-2 ${activeTab === 'student' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab("student")}
          >
            PARTICIPANT
          </button>
          <button 
            className={`flex-1 py-2 font-display tracking-widest text-sm transition-colors border-b-2 ${activeTab === 'admin' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab("admin")}
          >
            ADMIN
          </button>
        </div>

        {activeTab === "student" ? (
          <form onSubmit={handleStudentLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 mb-1 block">TEAM ID (DIGITS)</label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="text"
                    pattern="[0-9]*"
                    placeholder="Enter Numeric Team ID"
                    className="pl-10 bg-black/50 border-white/10 focus:border-primary text-white font-mono"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-gray-400 mb-1 block">TEAM PASSWORD (DIGITS)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="password"
                    pattern="[0-9]*"
                    placeholder="Enter Numeric Password"
                    className="pl-10 bg-black/50 border-white/10 focus:border-primary text-white font-mono"
                    value={teamPassword}
                    onChange={(e) => setTeamPassword(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary/20 hover:bg-primary/40 border border-primary text-white font-bold tracking-widest font-display transition-all"
            >
              <LogIn className="w-4 h-4 mr-2" />
              AUTHENTICATE
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 mb-1 block">ADMIN PASSWORD</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="Enter Admin Password"
                    className="pl-10 bg-black/50 border-white/10 focus:border-red-500 text-white font-mono"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest font-display transition-all"
            >
              <LogIn className="w-4 h-4 mr-2" />
              ADMIN LOGIN
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
