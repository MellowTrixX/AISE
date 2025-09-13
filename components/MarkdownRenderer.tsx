import React from 'react';

// Define the structure for a node in our tree
interface TreeNode {
  content: string;
  children: TreeNode[];
}

/**
 * Parses a markdown list string (using 2-space indentation) into a tree structure.
 * @param markdown The markdown string to parse.
 * @returns An array of root nodes.
 */
const parseMarkdownList = (markdown: string): TreeNode[] => {
  // Filter out empty lines and lines that don't start with a dash
  const lines = markdown.split('\n').filter(line => line.trim().startsWith('-'));
  if (lines.length === 0) return [];

  // Helper to determine the indentation level of a line
  const getIndentLevel = (line: string): number => {
    const indent = line.match(/^\s*/)?.[0]?.length ?? 0;
    return Math.floor(indent / 2); // Assuming 2 spaces per indent level
  };

  const root: TreeNode = { content: 'root', children: [] };
  const parentStack: { node: TreeNode; level: number }[] = [{ node: root, level: -1 }];

  for (const line of lines) {
    const level = getIndentLevel(line);
    const content = line.trim().substring(2).trim(); // Remove "- " from the start
    const newNode: TreeNode = { content, children: [] };

    // Find the correct parent in the stack by popping nodes with a greater or equal level
    while (parentStack[parentStack.length - 1].level >= level) {
      parentStack.pop();
    }

    // Add the new node to its parent's children
    parentStack[parentStack.length - 1].node.children.push(newNode);
    
    // Push the new node onto the stack to act as a potential parent
    parentStack.push({ node: newNode, level });
  }

  return root.children;
};

/**
 * A recursive component to render a single node and its children.
 */
const TreeNodeView: React.FC<{ node: TreeNode }> = ({ node }) => {
  const hasChildren = node.children.length > 0;
  return (
    <div>
      {/* The current node's content */}
      <div className="inline-block bg-surface px-3 py-1.5 text-base rounded-lg border border-muted/30 shadow-sm">
        {node.content}
      </div>

      {/* Render children if they exist */}
      {hasChildren && (
        <ul className="pl-12 pt-4 relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-0 h-full w-px bg-muted/30"></div>
          {node.children.map((child, index) => (
            <li key={index} className="relative mb-4 last:mb-0">
                {/* Horizontal connector line */}
              <div className="absolute -left-6 top-[18px] h-px w-6 bg-muted/30"></div>
              <TreeNodeView node={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


/**
 * Renders a markdown string as a visually appealing tree structure if it's hierarchical,
 * otherwise falls back to a simpler list or plain text.
 */
const MarkdownRenderer: React.FC<{ markdown: string }> = ({ markdown }) => {
  // Heuristic: if the text contains an indented list item, treat it as hierarchical.
  const isHierarchical = markdown.includes('\n  -') || markdown.includes('\n    -');
  
  if (!isHierarchical) {
    // If not hierarchical, check if it's a simple list.
    const lines = markdown.split('\n').filter(line => line.trim().startsWith('-'));
    if (lines.length > 0) {
      return (
        <ul className="space-y-2 list-disc list-inside">
          {lines.map((line, index) => (
            <li key={index} className="text-base text-light">{line.trim().substring(2).trim()}</li>
          ))}
        </ul>
      );
    }
    // Otherwise, render as plain text.
    return <p className="text-base whitespace-pre-wrap break-words text-light">{markdown}</p>;
  }

  // Parse and render the hierarchical tree.
  const treeData = parseMarkdownList(markdown);

  if (treeData.length === 0) {
    return <p className="text-base whitespace-pre-wrap break-words text-light">{markdown}</p>;
  }

  return (
    <div className="font-sans">
      {treeData.map((node, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <TreeNodeView node={node} />
        </div>
      ))}
    </div>
  );
};

export default MarkdownRenderer;