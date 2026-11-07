/**
 * Real GitHub Export Utility for Athokpam Labs
 * Authenticates via GitHub Personal Access Token (PAT),
 * creates a repository on behalf of the user, and uploads
 * the full project tree with official 'Made with Athokpam' badge.
 */

import { GitHubExportOptions } from '../types';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
}

export interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  default_branch: string;
}

export interface GitHubExportResult {
  success: boolean;
  repoUrl?: string;
  repoFullName?: string;
  committedFilesCount?: number;
  error?: string;
}

/**
 * Generate a comprehensive README.md for the exported project,
 * prominently displaying the 'Made with Athokpam' badge.
 */
export function generateProjectReadme(
  projectName: string,
  description: string,
  files: Record<string, string>,
  includeBadge: boolean = true
): string {
  const badgeMarkdown = includeBadge
    ? `[![Made with Athokpam](https://img.shields.io/badge/Made%20with-Athokpam%20AI-6366f1?style=for-the-badge&logo=codeforces&logoColor=white)](https://athokpamlabs.ai)\n\n`
    : '';

  const fileList = Object.keys(files)
    .filter((f) => !f.startsWith('.'))
    .slice(0, 15)
    .map((f) => `- \`${f}\``)
    .join('\n');

  return `# ${projectName}

${badgeMarkdown}${description || 'Autonomous AI-built web application engineered with Athokpam Labs.'}

## ⚡ Tech Stack & Architecture

- **Runtime**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Engine**: Athokpam AI Autonomous Builder (Multi-Model Support)
- **Deployment Ready**: Static Hosting, Vercel, Netlify, or Docker

## 🚀 Getting Started

Clone the repository and install dependencies:

\`\`\`bash
git clone https://github.com/${projectName}.git
cd ${projectName}
npm install
\`\`\`

Start the local development server:

\`\`\`bash
npm run dev
\`\`\`

Build for production:

\`\`\`bash
npm run build
\`\`\`

## 📁 Key Project Files

${fileList || '- `src/App.tsx`\n- `src/main.tsx`\n- `package.json`'}

---

> ⚡ **Built with [Athokpam Labs](https://athokpamlabs.ai)** — The Autonomous AI Web App Builder supporting 30+ Frontier LLMs.
`;
}

/**
 * Verify GitHub Token and fetch user profile
 */
export async function verifyGitHubToken(token: string): Promise<GitHubUser> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    throw new Error('GitHub Personal Access Token is required.');
  }

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Athokpam-AI-App-Builder',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid GitHub token. Please verify your token has "repo" scope.');
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub authentication failed (${response.status})`);
  }

  return response.json();
}

/**
 * Creates repository on GitHub and commits files
 */
export async function exportToGitHub(
  options: GitHubExportOptions,
  files: Record<string, string>,
  onProgress?: (status: string, percent: number) => void
): Promise<GitHubExportResult> {
  try {
    const cleanToken = options.token.trim();
    if (!cleanToken) {
      return { success: false, error: 'Personal Access Token is missing.' };
    }
    if (!options.repoName.trim()) {
      return { success: false, error: 'Repository name is required.' };
    }

    onProgress?.('Verifying GitHub authentication...', 10);
    const user = await verifyGitHubToken(cleanToken);

    onProgress?.(`Creating repository '${options.repoName}' under @${user.login}...`, 30);
    
    // Create Repo
    const createRepoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Athokpam-AI-App-Builder',
      },
      body: JSON.stringify({
        name: options.repoName.trim(),
        description: options.description || 'Built with Athokpam Labs AI App Builder',
        private: Boolean(options.isPrivate),
        auto_init: true,
      }),
    });

    let repoData: GitHubRepoResponse;

    if (!createRepoRes.ok) {
      const err = await createRepoRes.json().catch(() => ({}));
      if (createRepoRes.status === 422 && err.message?.includes('already exists')) {
        // Fetch existing repo
        const getRepoRes = await fetch(`https://api.github.com/repos/${user.login}/${options.repoName.trim()}`, {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Athokpam-AI-App-Builder',
          },
        });
        if (!getRepoRes.ok) {
          throw new Error(`Repository '${options.repoName}' already exists and cannot be accessed.`);
        }
        repoData = await getRepoRes.json();
      } else {
        throw new Error(err.message || `Failed to create repo: HTTP ${createRepoRes.status}`);
      }
    } else {
      repoData = await createRepoRes.json();
    }

    // Prepare files to commit
    const allFilesToUpload: Record<string, string> = { ...files };

    // Include or update README with 'Made with Athokpam' badge
    allFilesToUpload['README.md'] = generateProjectReadme(
      options.repoName,
      options.description,
      files,
      options.includeBadge
    );

    const fileEntries = Object.entries(allFilesToUpload);
    let committed = 0;

    for (let i = 0; i < fileEntries.length; i++) {
      const [rawPath, content] = fileEntries[i];
      const filePath = rawPath.replace(/^\/+/, ''); // remove leading slash

      const progressPercent = 30 + Math.round(((i + 1) / fileEntries.length) * 65);
      onProgress?.(`Committing ${filePath} (${i + 1}/${fileEntries.length})...`, progressPercent);

      // Check if file already exists to get sha for update
      let sha: string | undefined = undefined;
      const getFileRes = await fetch(
        `https://api.github.com/repos/${user.login}/${options.repoName}/contents/${filePath}`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Athokpam-AI-App-Builder',
          },
        }
      );

      if (getFileRes.ok) {
        const existingData = await getFileRes.json();
        sha = existingData.sha;
      }

      // Convert content to Base64 (Unicode safe)
      const base64Content = btoa(unescape(encodeURIComponent(content)));

      const putRes = await fetch(
        `https://api.github.com/repos/${user.login}/${options.repoName}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Athokpam-AI-App-Builder',
          },
          body: JSON.stringify({
            message: `feat(athokpam): add ${filePath} via Athokpam Labs AI`,
            content: base64Content,
            sha,
          }),
        }
      );

      if (putRes.ok) {
        committed++;
      }
    }

    onProgress?.('Repository sync completed!', 100);

    return {
      success: true,
      repoUrl: repoData.html_url,
      repoFullName: repoData.full_name,
      committedFilesCount: committed,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during GitHub export.',
    };
  }
}
