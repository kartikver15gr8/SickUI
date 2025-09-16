const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const generate = require('@babel/generator').default;

/**
 * Extract code from example files and generate registry
 * This runs at build time to ensure code and examples stay in sync
 */

const EXAMPLES_DIR = path.join(__dirname, '../src/registry');
const OUTPUT_DIR = path.join(__dirname, '../src/generated');

function extractExampleCode(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Parse the file to AST
  const ast = parse(content, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  const examples = {};

  // Extract each exported function
  ast.program.body.forEach((node) => {
    if (node.type === 'ExportNamedDeclaration' && node.declaration?.type === 'FunctionDeclaration') {
      const functionName = node.declaration.id.name;
      
      // Generate clean code for this function
      const functionCode = generate(node, {
        retainLines: false,
        compact: false,
      }).code;

      // Add necessary imports
      const imports = ast.program.body
        .filter(n => n.type === 'ImportDeclaration')
        .map(n => generate(n).code)
        .join('\n');

      examples[functionName] = {
        name: functionName,
        code: `${imports}\n\n${functionCode}`,
        component: functionName,
      };
    }
  });

  return examples;
}

function generateRegistry() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const exampleFiles = fs.readdirSync(EXAMPLES_DIR)
    .filter(file => file.endsWith('.tsx'))
    .filter(file => file.includes('-examples'));

  const registry = {};

  exampleFiles.forEach(file => {
    const filePath = path.join(EXAMPLES_DIR, file);
    const componentName = file.replace('-examples.tsx', '');
    
    registry[componentName] = extractExampleCode(filePath);
  });

  // Generate TypeScript registry file
  const registryContent = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const EXAMPLES_REGISTRY = ${JSON.stringify(registry, null, 2)} as const;

export type ExampleName = keyof typeof EXAMPLES_REGISTRY;
export type ComponentExamples<T extends ExampleName> = typeof EXAMPLES_REGISTRY[T];
`;

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'examples-registry.ts'),
    registryContent
  );

  console.log('✅ Examples registry generated successfully');
  console.log(`📊 Generated ${Object.keys(registry).length} components with ${
    Object.values(registry).reduce((acc, examples) => acc + Object.keys(examples).length, 0)
  } examples`);
}

if (require.main === module) {
  generateRegistry();
}

module.exports = { generateRegistry, extractExampleCode };
