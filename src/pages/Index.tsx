import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  GitBranch, 
  Shield, 
  TestTube, 
  Layers, 
  Zap, 
  ArrowRight,
  Code2,
  Search,
  FileCode,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Architecture Analysis",
    description: "Understand the high-level structure and design patterns used in any codebase.",
  },
  {
    icon: Code2,
    title: "Dependency Mapping",
    description: "Visualize all dependencies and their relationships within the project.",
  },
  {
    icon: Shield,
    title: "Security Scanning",
    description: "Identify potential security vulnerabilities and get actionable recommendations.",
  },
  {
    icon: TestTube,
    title: "Test Suggestions",
    description: "Get AI-generated test cases and coverage insights for better code quality.",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste Repository URL",
    description: "Simply paste any public GitHub repository URL into our analyzer.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our AI engine analyzes the entire codebase in seconds.",
  },
  {
    number: "03",
    title: "Get Insights",
    description: "Receive comprehensive reports on architecture, dependencies, security, and tests.",
  },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
        
        <div className="container relative py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
            >
              <Zap className="h-4 w-4" />
              AI-Powered Code Analysis
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Understand Any GitHub Repo{" "}
              <span className="gradient-text">In Seconds</span>
            </h1>

            <p className="mb-10 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Automatically analyze code structure, architecture, dependencies, 
              security issues, and generate test suggestions with AI.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild variant="hero" size="xl">
                <Link to={user ? "/app" : "/login"}>
                  Analyze a Repository
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="glass-card p-6 glow-effect">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-accent/80" />
                <span className="ml-4 text-sm text-muted-foreground font-mono">
                  analysis-results.json
                </span>
              </div>
              <pre className="code-block text-xs sm:text-sm overflow-hidden">
{`{
  "structure": "Well-organized monorepo with clear separation...",
  "architecture": "Event-driven microservices architecture...",
  "dependencies": ["react", "typescript", "tailwindcss", ...],
  "security_issues": ["Potential SQL injection in auth module..."],
  "tests": ["Add unit tests for user service...", ...]
}`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Powerful Analysis Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get comprehensive insights into any codebase with our AI-powered analysis engine.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Analyze any GitHub repository in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center max-w-3xl mx-auto glow-effect"
          >
            <GitBranch className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Analyze Your First Repo?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join developers who use RepoAnalyzer to understand codebases faster 
              and build better software.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to={user ? "/app" : "/login"}>
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <span className="font-semibold">RepoAnalyzer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RepoAnalyzer. All rights reserved.
          </p>
        </div>
      </footer>
    </Layout>
  );
}
