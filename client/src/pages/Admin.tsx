import { Shield, Lock, Unlock, AlertTriangle, Save, CheckCircle, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  getTeams, setTeams as saveTeamsToStore, Team,
  getQuestionsR1, setQuestionsR1 as saveQuestionsR1, QuestionR1,
  getSnippetsR2, setSnippetsR2 as saveSnippetsR2, SnippetR2
} from "@/lib/store";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"proctor" | "teams" | "r1" | "r2">("proctor");

  // Proctoring
  const [isProtectorEnabled, setIsProtectorEnabled] = useState(false);

  // Teams
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamId, setNewTeamId] = useState("");
  const [newTeamPassword, setNewTeamPassword] = useState("");

  // R1 Questions
  const [questions, setQuestions] = useState<QuestionR1[]>([]);
  const [newQuestion, setNewQuestion] = useState<QuestionR1>({ id: "", text: "", options: ["", "", "", ""], correctAnswer: 0 });

  // R2 Snippets
  const [snippets, setSnippets] = useState<SnippetR2[]>([]);
  const [newSnippet, setNewSnippet] = useState<SnippetR2>({ id: "", code: "", language: "javascript" });

  useEffect(() => {
    // Check auth
    const auth = sessionStorage.getItem("auth_user");
    if (!auth || JSON.parse(auth).role !== "admin") {
      window.location.href = "/";
    }

    const savedState = localStorage.getItem("protector_mode");
    setIsProtectorEnabled(savedState === "true");

    setTeams(getTeams());
    setQuestions(getQuestionsR1());
    setSnippets(getSnippetsR2());
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsProtectorEnabled(checked);
    localStorage.setItem("protector_mode", String(checked));
    toast({
      title: checked ? "Protector Mode ENABLED" : "Protector Mode DISABLED",
      variant: checked ? "default" : "destructive",
    });
  };

  // Team Handlers
  const handleAddTeam = () => {
    if (!newTeamId || !newTeamPassword) return;
    const newTeams = [...teams, { id: newTeamId, password: newTeamPassword }];
    setTeams(newTeams);
    saveTeamsToStore(newTeams);
    setNewTeamId("");
    setNewTeamPassword("");
    toast({ title: "Team Added successfully." });
  };

  const handleRemoveTeam = (id: string) => {
    const newTeams = teams.filter(t => t.id !== id);
    setTeams(newTeams);
    saveTeamsToStore(newTeams);
    toast({ title: "Team Removed." });
  };

  // R1 Handlers
  const handleAddQuestion = () => {
    if (!newQuestion.text) return;
    const newQ = { ...newQuestion, id: Date.now().toString() };
    const updated = [...questions, newQ];
    setQuestions(updated);
    saveQuestionsR1(updated);
    setNewQuestion({ id: "", text: "", options: ["", "", "", ""], correctAnswer: 0 });
    toast({ title: "Question Added" });
  };

  const handleRemoveQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    saveQuestionsR1(updated);
    toast({ title: "Question Removed" });
  };

  // R2 Handlers
  const handleAddSnippet = () => {
    if (!newSnippet.code) return;
    const newS = { ...newSnippet, id: Date.now().toString() };
    const updated = [...snippets, newS];
    setSnippets(updated);
    saveSnippetsR2(updated);
    setNewSnippet({ id: "", code: "", language: "javascript" });
    toast({ title: "Snippet Added" });
  };

  const handleRemoveSnippet = (id: string) => {
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    saveSnippetsR2(updated);
    toast({ title: "Snippet Removed" });
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-10">
      <div className="text-center mb-10 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[100%] bg-red-500/10 blur-[100px] rounded-full -z-10"></div>
         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-display uppercase tracking-wider flex items-center justify-center gap-4">
            <Shield className="w-10 h-10 text-red-500" />
            Admin <span className="text-red-500 glitch-text" data-text="Control">Control</span>
         </h1>
         <p className="text-gray-400 font-mono">SYSTEM_ADMIN_ACCESS_LEVEL_5</p>
      </div>

      <div className="flex space-x-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        <Button variant={activeTab === 'proctor' ? 'default' : 'ghost'} onClick={() => setActiveTab('proctor')} className={activeTab === 'proctor' ? 'bg-red-600 hover:bg-red-700' : ''}>Proctoring</Button>
        <Button variant={activeTab === 'teams' ? 'default' : 'ghost'} onClick={() => setActiveTab('teams')} className={activeTab === 'teams' ? 'bg-red-600 hover:bg-red-700' : ''}>Manage Teams</Button>
        <Button variant={activeTab === 'r1' ? 'default' : 'ghost'} onClick={() => setActiveTab('r1')} className={activeTab === 'r1' ? 'bg-red-600 hover:bg-red-700' : ''}>Round 1 Quiz</Button>
        <Button variant={activeTab === 'r2' ? 'default' : 'ghost'} onClick={() => setActiveTab('r2')} className={activeTab === 'r2' ? 'bg-red-600 hover:bg-red-700' : ''}>Round 2 Snippets</Button>
      </div>

      {activeTab === 'proctor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Protector Control */}
          <div className="cyber-card backdrop-blur-xl !border-red-500/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-white font-bold font-display flex items-center gap-3">
                {isProtectorEnabled ? <Lock className="w-6 h-6 text-green-400" /> : <Unlock className="w-6 h-6 text-red-400" />}
                Proctoring System
              </h2>
              <div className={`px-3 py-1 rounded border font-mono text-xs font-bold tracking-widest uppercase ${isProtectorEnabled ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
                  {isProtectorEnabled ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              Global switch for exam security protocols. When enabled, all participant clients will enforce:
            </p>
            
            <ul className="space-y-3 mb-8 text-sm text-gray-300 font-mono">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-red-500" /> Tab Switch Detection</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-red-500" /> Copy/Paste Prevention</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-red-500" /> Right-Click Block</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-red-500" /> Screenshot Monitoring</li>
            </ul>

            <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/5">
              <span className="font-bold text-white tracking-wide">Toggle Protector Mode</span>
              <Switch 
                  checked={isProtectorEnabled}
                  onCheckedChange={handleToggle}
                  className="data-[state=checked]:bg-red-600"
              />
            </div>
          </div>

          {/* System Logs (Mock) */}
          <div className="cyber-card backdrop-blur-xl">
             <h2 className="text-2xl text-secondary mb-6 font-bold font-display flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-secondary" />
                Live Security Logs
             </h2>
             <div className="bg-black/60 rounded-lg p-4 h-[300px] overflow-y-auto font-mono text-xs space-y-2 border border-white/10 shadow-inner">
               <div className="text-gray-500 border-b border-gray-800 pb-2 mb-2">STREAM_ESTABLISHED_SECURE_CHANNEL...</div>
               <div className="text-green-400">[10:00:01] System initialized</div>
               <div className="text-gray-400">[10:05:23] Admin login detected (IP: 192.168.1.1)</div>
               {isProtectorEnabled && (
                  <>
                      <div className="text-yellow-500">[10:15:42] WARN: Global Proctoring Enabled</div>
                      <div className="text-red-400 animate-pulse">[10:16:05] ALERT: Participant_004 Tab Switch Violation</div>
                      <div className="text-red-400">[10:18:12] ALERT: Participant_012 Copy Attempt Blocked</div>
                  </>
               )}
               <div className="text-gray-500 animate-pulse">_</div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="cyber-card backdrop-blur-xl space-y-8">
          <h2 className="text-2xl text-white font-bold font-display">Manage Allowed Teams</h2>
          <div className="bg-black/40 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg text-primary mb-4 font-display">Add New Team</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Team ID (Digits)</label>
                <Input value={newTeamId} onChange={e => setNewTeamId(e.target.value.replace(/[^0-9]/g, ''))} className="bg-black/50 border-white/20 text-white font-mono" placeholder="e.g. 1001" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Team Password (Digits)</label>
                <Input value={newTeamPassword} onChange={e => setNewTeamPassword(e.target.value.replace(/[^0-9]/g, ''))} className="bg-black/50 border-white/20 text-white font-mono" placeholder="e.g. 1234" />
              </div>
              <Button onClick={handleAddTeam} className="bg-primary/20 text-primary hover:bg-primary/40"><Plus className="w-4 h-4 mr-2"/> Add Team</Button>
            </div>
          </div>
          
          <div className="bg-black/40 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg text-primary mb-4 font-display">Allowed Teams ({teams.length})</h3>
            <div className="space-y-2">
              {teams.map(t => (
                <div key={t.id} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10">
                  <div>
                    <span className="text-white font-mono mr-4">ID: {t.id}</span>
                    <span className="text-gray-400 font-mono text-sm">Pass: {t.password}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleRemoveTeam(t.id)}>
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                </div>
              ))}
              {teams.length === 0 && <p className="text-gray-500 italic">No teams configured.</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'r1' && (
        <div className="cyber-card backdrop-blur-xl space-y-8">
          <h2 className="text-2xl text-white font-bold font-display">Round 1 Questions (Quiz)</h2>
          
          <div className="bg-black/40 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg text-primary mb-4 font-display">Add Question</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Question Text</label>
                <Input value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} className="bg-black/50 border-white/20 text-white" placeholder="Enter question..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[0,1,2,3].map(idx => (
                  <div key={idx}>
                    <label className="text-xs text-gray-400 mb-1 block">Option {idx + 1}</label>
                    <div className="flex gap-2">
                      <input type="radio" name="correctAns" checked={newQuestion.correctAnswer === idx} onChange={() => setNewQuestion({...newQuestion, correctAnswer: idx})} />
                      <Input value={newQuestion.options[idx]} onChange={e => {
                        const newOpts = [...newQuestion.options];
                        newOpts[idx] = e.target.value;
                        setNewQuestion({...newQuestion, options: newOpts});
                      }} className="bg-black/50 border-white/20 text-white" placeholder={`Option ${idx+1}`} />
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleAddQuestion} className="bg-primary/20 text-primary hover:bg-primary/40"><Plus className="w-4 h-4 mr-2"/> Add Question</Button>
            </div>
          </div>
          
          <div className="bg-black/40 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg text-primary mb-4 font-display">Existing Questions ({questions.length})</h3>
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white/5 p-4 rounded border border-white/10 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleRemoveQuestion(q.id)}>
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                  <p className="text-white font-medium mb-2">{idx + 1}. {q.text}</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {q.options.map((opt, i) => (
                      <li key={i} className={q.correctAnswer === i ? "text-green-400" : ""}>{i+1}. {opt} {q.correctAnswer === i && "(Correct)"}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'r2' && (
        <div className="cyber-card backdrop-blur-xl space-y-8">
          <h2 className="text-2xl text-white font-bold font-display">Round 2 Snippets (Debugging)</h2>
          
          <div className="bg-black/40 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg text-primary mb-4 font-display">Add Snippet</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Code Snippet</label>
                <Textarea 
                  value={newSnippet.code} 
                  onChange={e => setNewSnippet({...newSnippet, code: e.target.value})} 
                  className="bg-black/50 border-white/20 text-white font-mono min-h-[150px]" 
                  placeholder="Paste buggy code here..." 
                />
              </div>
              <Button onClick={handleAddSnippet} className="bg-primary/20 text-primary hover:bg-primary/40"><Plus className="w-4 h-4 mr-2"/> Add Snippet</Button>
            </div>
          </div>
          
          <div className="bg-black/40 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg text-primary mb-4 font-display">Existing Snippets ({snippets.length})</h3>
            <div className="space-y-4">
              {snippets.map((s, idx) => (
                <div key={s.id} className="bg-white/5 p-4 rounded border border-white/10 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleRemoveSnippet(s.id)}>
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                  <p className="text-white font-medium mb-2 font-display">Snippet #{idx + 1}</p>
                  <pre className="text-xs text-gray-400 bg-black/60 p-3 rounded font-mono overflow-x-auto whitespace-pre-wrap">{s.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
