/**
 * Virtual File System for Athokpam Labs
 * Manages in-memory files, folders, diffs, and ZIP exports.
 */

import JSZip from 'jszip';

export interface VirtualFile {
  name: string;
  path: string;
  content: string;
  isModified?: boolean;
  isNew?: boolean;
}

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  isModified?: boolean;
  isNew?: boolean;
}

export class VirtualFileSystem {
  private files: Map<string, VirtualFile> = new Map();
  private originalFiles: Map<string, string> = new Map();

  constructor(initialFiles?: Record<string, string>) {
    if (initialFiles) {
      this.loadFiles(initialFiles);
    }
  }

  loadFiles(fileMap: Record<string, string>) {
    this.files.clear();
    this.originalFiles.clear();

    for (const [path, content] of Object.entries(fileMap)) {
      const normalized = this.normalizePath(path);
      this.files.set(normalized, {
        name: this.getFileName(normalized),
        path: normalized,
        content,
        isModified: false,
        isNew: false,
      });
      this.originalFiles.set(normalized, content);
    }
  }

  normalizePath(path: string): string {
    return path.replace(/^[./\\]+/, '').replace(/\\/g, '/');
  }

  getFileName(path: string): string {
    const parts = this.normalizePath(path).split('/');
    return parts[parts.length - 1];
  }

  getFile(path: string): VirtualFile | undefined {
    return this.files.get(this.normalizePath(path));
  }

  getFileContent(path: string): string {
    return this.getFile(path)?.content ?? '';
  }

  setFile(path: string, content: string, markModified = true) {
    const normalized = this.normalizePath(path);
    const existing = this.files.get(normalized);
    const original = this.originalFiles.get(normalized);

    const isNew = original === undefined;
    const isModified = markModified && (isNew || original !== content);

    this.files.set(normalized, {
      name: this.getFileName(normalized),
      path: normalized,
      content,
      isModified,
      isNew,
    });
  }

  deleteFile(path: string) {
    const normalized = this.normalizePath(path);
    this.files.delete(normalized);
  }

  renameFile(oldPath: string, newPath: string) {
    const normOld = this.normalizePath(oldPath);
    const normNew = this.normalizePath(newPath);
    const file = this.files.get(normOld);
    if (!file) return;

    this.files.delete(normOld);
    this.setFile(normNew, file.content, true);
  }

  getAllFiles(): VirtualFile[] {
    return Array.from(this.files.values()).sort((a, b) => a.path.localeCompare(b.path));
  }

  getAllFilesRecord(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [path, file] of this.files.entries()) {
      result[path] = file.content;
    }
    return result;
  }

  /**
   * Builds a nested folder/file tree structure for display in file explorer
   */
  getTree(): FileTreeNode[] {
    const rootNodes: Record<string, FileTreeNode> = {};

    for (const file of this.getAllFiles()) {
      const parts = file.path.split('/');
      let currentPath = '';

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const prevPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (isFile) {
          const fileNode: FileTreeNode = {
            id: currentPath,
            name: part,
            path: currentPath,
            type: 'file',
            isModified: file.isModified,
            isNew: file.isNew,
          };

          if (prevPath) {
            const parent = this.findNodeByPath(Object.values(rootNodes), prevPath);
            if (parent) {
              parent.children = parent.children || [];
              parent.children.push(fileNode);
            }
          } else {
            rootNodes[currentPath] = fileNode;
          }
        } else {
          // Folder
          let folderNode = this.findNodeByPath(Object.values(rootNodes), currentPath);
          if (!folderNode) {
            folderNode = {
              id: currentPath,
              name: part,
              path: currentPath,
              type: 'folder',
              children: [],
            };

            if (prevPath) {
              const parent = this.findNodeByPath(Object.values(rootNodes), prevPath);
              if (parent) {
                parent.children = parent.children || [];
                parent.children.push(folderNode);
              }
            } else {
              rootNodes[currentPath] = folderNode;
            }
          }
        }
      }
    }

    const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
      return nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      }).map(node => ({
        ...node,
        children: node.children ? sortNodes(node.children) : undefined,
      }));
    };

    return sortNodes(Object.values(rootNodes));
  }

  private findNodeByPath(nodes: FileTreeNode[], targetPath: string): FileTreeNode | null {
    for (const node of nodes) {
      if (node.path === targetPath) return node;
      if (node.children) {
        const found = this.findNodeByPath(node.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Export all files as a ZIP archive blob
   */
  async exportAsZip(projectName = 'athokpam-project'): Promise<Blob> {
    const zip = new JSZip();
    for (const [path, file] of this.files.entries()) {
      zip.file(path, file.content);
    }
    return await zip.generateAsync({ type: 'blob' });
  }

  /**
   * Get diff comparison between original and current file
   */
  getDiff(path: string): { original: string; current: string; hasChanges: boolean } {
    const normalized = this.normalizePath(path);
    const original = this.originalFiles.get(normalized) ?? '';
    const current = this.getFileContent(normalized);
    return {
      original,
      current,
      hasChanges: original !== current,
    };
  }
}

/**
 * Downloads a record of files directly as a ZIP archive
 */
export async function exportProjectZip(files: Record<string, string>, filename = 'project.zip'): Promise<void> {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) {
    zip.file(path.replace(/^\/+/, ''), content);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

