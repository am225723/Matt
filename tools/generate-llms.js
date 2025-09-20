#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const CLEAN_CONTENT_REGEX = {
  comments: /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
  templateLiterals: /`[\s\S]*?`/g,
  strings: /'[^']*'|"[^"]*"/g,
  jsxExpressions: /\{.*?\}/g,
  htmlEntities: {
    quot: /&quot;/g,
    amp: /&amp;/g,
    lt: /&lt;/g,
    gt: /&gt;/g,
    apos: /&apos;/g
  }
};

const EXTRACTION_REGEX = {
  helmet: /<Helmet[^>]*?>([\s\S]*?)<\/Helmet>/i,
  helmetTest: /<Helmet[\s\S]*?<\/Helmet>/i,
  title: /<title[^>]*?>\s*(.*?)\s*<\/title>/i,
  description: /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i,
  import: /import\s+(\w+)\s+from\s+['"]@\/([^'"]+)['"]/g,
  view: /{view === '([^']*)' && <([A-Z][^\s/>]+)/g,
};

function cleanContent(content) {
  return content
    .replace(CLEAN_CONTENT_REGEX.comments, '')
    .replace(CLEAN_CONTENT_REGEX.templateLiterals, '""')
    .replace(CLEAN_CONTENT_REGEX.strings, '""');
}

function cleanText(text) {
  if (!text) return text;
  
  return text
    .replace(CLEAN_CONTENT_REGEX.jsxExpressions, '')
    .replace(CLEAN_CONTENT_REGEX.htmlEntities.quot, '"')
    .replace(CLEAN_CONTENT_REGEX.htmlEntities.amp, '&')
    .replace(CLEAN_CONTENT_REGEX.htmlEntities.lt, '<')
    .replace(CLEAN_CONTENT_REGEX.htmlEntities.gt, '>')
    .replace(CLEAN_CONTENT_REGEX.htmlEntities.apos, "'")
    .trim();
}

function extractRoutes(appJsxPath, srcDir) {
  if (!fs.existsSync(appJsxPath)) return new Map();

  try {
    const content = fs.readFileSync(appJsxPath, 'utf8');
    const imports = new Map();
    let match;
    while ((match = EXTRACTION_REGEX.import.exec(content)) !== null) {
      const componentName = match[1];
      const componentPath = match[2];
      imports.set(componentName, path.join(srcDir, `${componentPath}.jsx`));
    }

    const routes = new Map();
    while ((match = EXTRACTION_REGEX.view.exec(content)) !== null) {
      const viewName = match[1];
      const componentName = match[2];
      const componentPath = imports.get(componentName);

      if (componentPath) {
        const routePath = viewName === 'dashboard' ? '/' : `/${viewName}`;
        routes.set(componentPath, routePath);
      }
    }

    // Add the App.jsx itself for the dashboard view
    routes.set(appJsxPath, '/');

    return routes;
  } catch (error) {
    console.error('Error extracting routes:', error);
    return new Map();
  }
}

function findReactFiles(dir, allFiles = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      findReactFiles(itemPath, allFiles);
    } else if (path.extname(item) === '.jsx') {
      allFiles.push(itemPath);
    }
  }

  return allFiles;
}

function extractHelmetData(content, filePath, routes) {
  if (!EXTRACTION_REGEX.helmetTest.test(content)) {
    return null;
  }
  
  const helmetMatch = content.match(EXTRACTION_REGEX.helmet);
  if (!helmetMatch) return null;
  
  const helmetContent = helmetMatch[1];
  const titleMatch = helmetContent.match(EXTRACTION_REGEX.title);
  const descMatch = helmetContent.match(EXTRACTION_REGEX.description);
  
  const title = cleanText(titleMatch?.[1]);
  const description = cleanText(descMatch?.[1]);
  
  const url = routes.has(filePath)
    ? routes.get(filePath)
    : generateFallbackUrl(path.basename(filePath, '.jsx'));
  
  return {
    url,
    title: title || 'Untitled Page',
    description: description || 'No description available'
  };
}

function generateFallbackUrl(fileName) {
  const cleanName = fileName.replace(/Page$/, '').toLowerCase();
  return cleanName === 'app' ? '/' : `/${cleanName}`;
}

function generateLlmsTxt(pages) {
  const sortedPages = pages.sort((a, b) => a.url.localeCompare(b.url));
  const pageEntries = sortedPages.map(page => 
    `- [${page.title}](${page.url}): ${page.description}`
  ).join('\n');
  
  return `## Pages\n${pageEntries}`;
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function processPageFile(filePath, routes) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return extractHelmetData(content, filePath, routes);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

function main() {
  const srcDir = path.join(process.cwd(), 'src');
  const appJsxPath = path.join(srcDir, 'App.jsx');

  const routes = extractRoutes(appJsxPath, srcDir);
  const reactFiles = findReactFiles(srcDir);
  
  const pages = reactFiles
    .map(filePath => processPageFile(filePath, routes))
    .filter(Boolean);
    
  if (pages.length === 0) {
    console.error('❌ No pages with Helmet components found!');
    // Do not exit with error, as it might break the build process
    // process.exit(1);
  }

  const llmsTxtContent = generateLlmsTxt(pages);
  const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
  
  ensureDirectoryExists(path.dirname(outputPath));
  fs.writeFileSync(outputPath, llmsTxtContent, 'utf8');
  console.log(`✅ Generated llms.txt with ${pages.length} pages.`);
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  main();
}
