import express from 'express';
import bodyParser from 'body-parser';
import { Octokit } from '@octokit/rest';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// --- GitHub App Configuration ---
// These should be set as environment variables in a real application
const APP_ID = process.env.GITHUB_APP_ID || 'your-app-id';
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'your-webhook-secret';
// The private key should be stored securely, not in the code.
// For this example, we'll read it from a file if it exists, or use a placeholder.
let privateKey;
try {
  privateKey = fs.readFileSync('private-key.pem', 'utf8');
} catch (err) {
  privateKey = process.env.GITHUB_PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n';
}

const app = express();
const port = process.env.PORT || 3000;

// --- Logic ported from generate-llms.js ---

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

async function extractRoutes(octokit, owner, repo, ref) {
  try {
    const { data: appJsxContent } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'src/App.jsx',
      ref,
    });

    const content = Buffer.from(appJsxContent.content, 'base64').toString('utf8');
    const imports = new Map();
    let match;
    while ((match = EXTRACTION_REGEX.import.exec(content)) !== null) {
      const componentName = match[1];
      const componentPath = match[2];
      imports.set(componentName, `src/${componentPath}.jsx`);
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
    routes.set('src/App.jsx', '/');
    return routes;
  } catch (error) {
    console.error('Error extracting routes:', error);
    return new Map();
  }
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
    : `/${path.basename(filePath, '.jsx').toLowerCase()}`;

  return { url, title: title || 'Untitled Page', description: description || 'No description available' };
}

function generateLlmsTxt(pages) {
  const sortedPages = pages.sort((a, b) => a.url.localeCompare(b.url));
  const pageEntries = sortedPages.map(page => `- [${page.title}](${page.url}): ${page.description}`).join('\n');
  return `## Pages\n${pageEntries}`;
}

async function findReactFiles(octokit, owner, repo, ref, directory = 'src') {
    const allFiles = [];
    const { data: items } = await octokit.repos.getContent({
        owner,
        repo,
        path: directory,
        ref,
    });

    for (const item of items) {
        if (item.type === 'dir') {
            const subFiles = await findReactFiles(octokit, owner, repo, ref, item.path);
            allFiles.push(...subFiles);
        } else if (item.path.endsWith('.jsx')) {
            allFiles.push(item);
        }
    }
    return allFiles;
}


// --- Express Middleware and Routes ---

// Middleware to verify webhook signature
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    const signature = req.headers['x-hub-signature-256'];
    if (signature) {
      const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
      const digest = 'sha256=' + hmac.update(buf).digest('hex');
      if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
        throw new Error('Invalid signature.');
      }
    }
  }
}));

app.get('/', (req, res) => {
  res.send('Ahoy, the GitHub App server is running!');
});

app.post('/api/github/webhooks', async (req, res) => {
  const event = req.headers['x-github-event'];

  if (event === 'push' && req.body.ref === 'refs/heads/main') {
    console.log('Received a push event to the main branch');

    const repository = req.body.repository;
    const owner = repository.owner.login;
    const repo = repository.name;
    const installationId = req.body.installation.id;
    const ref = req.body.after;

    try {
      // --- Authenticate as GitHub App ---
      const appJwt = jwt.sign({
        iat: Math.floor(Date.now() / 1000) - 60,
        exp: Math.floor(Date.now() / 1000) + (10 * 60),
        iss: APP_ID,
      }, privateKey, { algorithm: 'RS256' });

      const appOctokit = new Octokit({ auth: appJwt });

      const { data: { token } } = await appOctokit.apps.createInstallationAccessToken({
        installation_id: installationId,
      });

      const octokit = new Octokit({ auth: token });

      // --- Process the repository ---
      const routes = await extractRoutes(octokit, owner, repo, ref);
      const reactFiles = await findReactFiles(octokit, owner, repo, ref);

      let pages = [];
      for (const file of reactFiles) {
          const { data: fileContentData } = await octokit.repos.getContent({
              owner,
              repo,
              path: file.path,
              ref,
          });
          const content = Buffer.from(fileContentData.content, 'base64').toString('utf8');
          const pageData = extractHelmetData(content, file.path, routes);
          if (pageData) {
              pages.push(pageData);
          }
      }

      const llmsTxtContent = generateLlmsTxt(pages);

      // --- Commit the llms.txt file ---
      const llmsTxtPath = 'public/llms.txt';
      let existingFileSha;
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner,
          repo,
          path: llmsTxtPath,
          branch: 'main',
        });
        existingFileSha = existingFile.sha;
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
        // File does not exist, which is fine.
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: llmsTxtPath,
        message: 'docs: update llms.txt',
        content: Buffer.from(llmsTxtContent).toString('base64'),
        sha: existingFileSha,
        branch: 'main'
      });

      console.log('Successfully generated and committed llms.txt');

    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
  }

  res.status(200).send('Event received');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;
