import { z } from "zod";

// Centralized backend URL - change this in one place if needed
export const BACKEND_URL = "https://ai-powered-tool-that-analyzes-any-github.onrender.com";

// Response shape from the backend
export interface AnalysisResult {
  structure: string;
  architecture: string;
  dependencies: string[];
  security_issues: string[];
  tests: string[];
}

// Validation schema for GitHub URLs
const githubUrlSchema = z.string().url().refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === "github.com" && parsed.pathname.split("/").filter(Boolean).length >= 2;
    } catch {
      return false;
    }
  },
  { message: "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)" }
);

export function validateGitHubUrl(url: string): { valid: boolean; error?: string } {
  const result = githubUrlSchema.safeParse(url);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, error: result.error.errors[0]?.message || "Invalid URL" };
}

export async function analyzeRepository(repoUrl: string): Promise<AnalysisResult> {
  const validation = validateGitHubUrl(repoUrl);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const response = await fetch(`${BACKEND_URL}/analyze-repo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repo_url: repoUrl }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data as AnalysisResult;
}
