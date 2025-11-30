import { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  Search, 
  Loader2, 
  Layers, 
  Code2, 
  Shield, 
  TestTube,
  FileCode,
  AlertCircle,
  CheckCircle2,
  GitBranch
} from "lucide-react";
import { analyzeRepository, validateGitHubUrl, AnalysisResult } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default function AppPage() {
  const { profile } = useAuth();
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const validateUrl = useCallback(
    debounce((url: string) => {
      if (!url) {
        setUrlError(null);
        return;
      }
      const validation = validateGitHubUrl(url);
      setUrlError(validation.valid ? null : validation.error || null);
    }, 300),
    []
  );

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRepoUrl(url);
    validateUrl(url);
  };

  const handleAnalyze = async () => {
    if (!repoUrl || urlError) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeRepository(repoUrl);
      setResult(data);
      toast.success("Analysis complete!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <GitBranch className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Repository Analyzer</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {profile?.full_name || "Developer"}!
              </p>
            </div>
          </div>
        </motion.div>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <label className="block text-sm font-medium mb-2">
            GitHub Repository URL
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                type="url"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={handleUrlChange}
                className={urlError ? "border-destructive" : ""}
              />
              {urlError && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {urlError}
                </p>
              )}
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !repoUrl || !!urlError}
              variant="hero"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Analyze
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Analyzing Repository...</h3>
            <p className="text-sm text-muted-foreground">
              This may take a few moments depending on the repository size.
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center border-destructive/50"
          >
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Analysis Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => setError(null)}>
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {!result && !isAnalyzing && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Analysis Yet</h3>
            <p className="text-sm text-muted-foreground">
              Enter a GitHub repository URL above to get started.
            </p>
          </motion.div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Tabs defaultValue="structure" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="structure" className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span className="hidden sm:inline">Structure</span>
                </TabsTrigger>
                <TabsTrigger value="architecture" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Architecture</span>
                </TabsTrigger>
                <TabsTrigger value="dependencies" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dependencies</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  <span className="hidden sm:inline">Tests</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="structure" className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  Code Structure
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="code-block whitespace-pre-wrap">{result.structure}</pre>
                </div>
              </TabsContent>

              <TabsContent value="architecture" className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Architecture Overview
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="code-block whitespace-pre-wrap">{result.architecture}</pre>
                </div>
              </TabsContent>

              <TabsContent value="dependencies" className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Dependencies ({result.dependencies?.length || 0})
                </h3>
                {result.dependencies && result.dependencies.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {result.dependencies.map((dep, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        <span className="text-sm font-mono truncate">{dep}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No dependencies found.</p>
                )}
              </TabsContent>

              <TabsContent value="security" className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Issues ({result.security_issues?.length || 0})
                </h3>
                {result.security_issues && result.security_issues.length > 0 ? (
                  <div className="space-y-3">
                    {result.security_issues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                      >
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                        <p className="text-sm">{issue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>No security issues found!</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tests" className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  Test Suggestions ({result.tests?.length || 0})
                </h3>
                {result.tests && result.tests.length > 0 ? (
                  <div className="space-y-3">
                    {result.tests.map((test, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <TestTube className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm">{test}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No test suggestions available.</p>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
