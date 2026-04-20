const fs = require('fs');
const path = require('path');

const traverse = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let newContent = content
        .replace(/bg-\[\#020617\]/g, 'bg-background')
        .replace(/bg-\[\#1e293b\]/g, 'bg-surface-elevated')
        .replace(/bg-\[\#0f172a\]/g, 'bg-surface')
        .replace(/bg-slate-900\/50/g, 'bg-surface')
        .replace(/bg-slate-900\/30/g, 'bg-surface-hover')
        .replace(/bg-slate-800\/50/g, 'bg-surface-elevated')
        .replace(/bg-slate-800\/30/g, 'bg-surface')
        .replace(/border-slate-800/g, 'border-border-subtle')
        .replace(/border-slate-700\/50/g, 'border-border-subtle')
        .replace(/border-slate-700/g, 'border-border-default')
        .replace(/border-white\/5/g, 'border-border-default')
        .replace(/border-white\/10/g, 'border-border-focus')
        .replace(/text-slate-500/g, 'text-text-muted')
        .replace(/text-slate-400/g, 'text-text-muted')
        .replace(/text-slate-300/g, 'text-text-secondary')
        .replace(/text-slate-200/g, 'text-text-primary')
        .replace(/text-slate-100/g, 'text-text-primary')
        .replace(/text-white/g, 'text-text-primary')
        .replace(/bg-green-500\/10/g, 'bg-success/10')
        .replace(/bg-green-500\/20/g, 'bg-success/20')
        .replace(/text-green-500/g, 'text-success')
        .replace(/focus:border-green-500/g, 'focus:border-border-focus')
        .replace(/focus:ring-green-500\/50/g, 'focus:ring-border-focus')
        .replace(/focus:ring-green-500/g, 'focus:ring-border-focus')
        .replace(/bg-blue-500\/10/g, 'bg-primary/10')
        .replace(/text-blue-500/g, 'text-primary')
        .replace(/bg-blue-600/g, 'bg-primary')
        .replace(/bg-purple-600/g, 'bg-secondary')
        .replace(/text-purple-500/g, 'text-secondary');
      
      // Fix potential button mess ups
      // Not perfect but better.
      newContent = newContent.replace(/text-text-primary/g, 'text-text-primary'); // no-op

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
};

traverse(path.join(__dirname, 'frontend/src/pages'));
traverse(path.join(__dirname, 'frontend/src/components'));
console.log("Done");
