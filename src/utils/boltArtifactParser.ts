/**
 * Athokpam AI Artifact and Action Parser
 * Parses XML-like <athokpamArtifact> (and <boltArtifact>) tags from LLM streaming outputs.
 */

export interface BoltAction {
  id: string;
  type: 'file' | 'shell' | 'start';
  filePath?: string;
  content: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export type AthokpamAction = BoltAction;

export interface BoltArtifact {
  id: string;
  title: string;
  actions: BoltAction[];
  rawText: string;
  thought?: string;
}

export type AthokpamArtifact = BoltArtifact;

export function parseBoltArtifact(rawContent: string): {
  thought?: string;
  artifact?: BoltArtifact;
  markdownText: string;
} {
  let thought: string | undefined;
  let cleanContent = rawContent;

  // Extract <thought> tags if present
  const thoughtMatch = /<thought>([\s\S]*?)<\/thought>/i.exec(cleanContent);
  if (thoughtMatch) {
    thought = thoughtMatch[1].trim();
    cleanContent = cleanContent.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();
  }

  // Look for <athokpamArtifact id="..." title="..."> or <boltArtifact ...>
  const artifactMatch = /(?:<athokpamArtifact|<boltArtifact)\s+id="([^"]+)"\s+title="([^"]+)">([\s\S]*?)(?:<\/(?:athokpamArtifact|boltArtifact)>|$)/i.exec(cleanContent);

  if (!artifactMatch) {
    return {
      thought,
      artifact: undefined,
      markdownText: cleanContent,
    };
  }

  const id = artifactMatch[1];
  const title = artifactMatch[2];
  const artifactBody = artifactMatch[3];

  const actions: BoltAction[] = [];
  const actionRegex = /(?:<athokpamAction|<boltAction)\s+type="([^"]+)"(?:\s+filePath="([^"]+)")?>([\s\S]*?)(<\/(?:athokpamAction|boltAction)>|$)/gi;
  let actionMatch: RegExpExecArray | null;
  let actionIndex = 0;

  while ((actionMatch = actionRegex.exec(artifactBody)) !== null) {
    const type = actionMatch[1] as 'file' | 'shell' | 'start';
    const filePath = actionMatch[2];
    const content = actionMatch[3].trim();
    const closeTag = (actionMatch[4] || '').toLowerCase();
    const hasClosingTag = closeTag === '</athokpamaction>' || closeTag === '</boltaction>';

    actions.push({
      id: `${id}-action-${actionIndex++}`,
      type,
      filePath,
      content,
      status: hasClosingTag ? 'completed' : 'running',
    });
  }

  // Remove the artifact tags from the visible markdown message text
  const markdownText = cleanContent.replace(/(?:<athokpamArtifact|<boltArtifact)[\s\S]*?(?:<\/(?:athokpamArtifact|boltArtifact)>|$)/gi, '').trim();

  return {
    thought,
    artifact: {
      id,
      title,
      actions,
      rawText: artifactBody,
      thought,
    },
    markdownText,
  };
}

export const parseAthokpamArtifact = parseBoltArtifact;

/**
 * Format a list of files and terminal commands into standard Athokpam AI Artifact XML
 */
export function formatBoltArtifact(
  id: string,
  title: string,
  files: { path: string; content: string }[],
  shellCommands: string[] = []
): string {
  let xml = `<athokpamArtifact id="${id}" title="${title}">\n`;

  for (const cmd of shellCommands) {
    xml += `  <athokpamAction type="shell">\n${cmd}\n  </athokpamAction>\n`;
  }

  for (const file of files) {
    xml += `  <athokpamAction type="file" filePath="${file.path}">\n${file.content}\n  </athokpamAction>\n`;
  }

  xml += `  <athokpamAction type="start">\nnpm run dev\n  </athokpamAction>\n`;
  xml += `</athokpamArtifact>`;

  return xml;
}

export const formatAthokpamArtifact = formatBoltArtifact;
