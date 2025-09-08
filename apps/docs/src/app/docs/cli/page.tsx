import {  Settings, Plus, List, GitCompare } from "lucide-react";

import { CodeBlock } from "../../../components/code-block";

export default function CLIPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">CLI Reference</h1>
          <p className="text-xl text-muted-foreground">
            Complete reference for the SickUI CLI commands and options.
          </p>
        </div>

        {/* Global Usage */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Usage</h2>
          <CodeBlock
            code="npx @sickui/cli [command] [options]"
            title="Global usage"
          />
        </div>

        {/* Init Command */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">init</h2>
              <p className="text-muted-foreground">
                Initialize your project and install dependencies
              </p>
            </div>
          </div>

          <CodeBlock code="npx @sickui/cli init [options]" title="Usage" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Options</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    -y, --yes
                  </code>
                  <span className="text-sm text-muted-foreground">
                    Skip confirmation prompt
                  </span>
                </div>
                <CodeBlock code="npx @sickui/cli init --yes" />
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    -d, --defaults
                  </code>
                  <span className="text-sm text-muted-foreground">
                    Use default configuration
                  </span>
                </div>
                <CodeBlock code="npx @sickui/cli init --defaults" />
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    -c, --cwd &lt;cwd&gt;
                  </code>
                  <span className="text-sm text-muted-foreground">
                    Working directory
                  </span>
                </div>
                <CodeBlock code="npx @sickui/cli init --cwd ./my-project" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h4 className="font-semibold mb-2">What it does:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • Creates{" "}
                <code className="bg-muted px-1 rounded">components.json</code>
              </li>
              <li>
                • Updates{" "}
                <code className="bg-muted px-1 rounded">
                  tailwind.config.js
                </code>
              </li>
              <li>
                • Creates{" "}
                <code className="bg-muted px-1 rounded">lib/utils.ts</code>
              </li>
              <li>• Installs required dependencies</li>
              <li>• Sets up component directory structure</li>
            </ul>
          </div>
        </div>

        {/* Add Command */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">add</h2>
              <p className="text-muted-foreground">
                Add components to your project
              </p>
            </div>
          </div>

          <CodeBlock
            code="npx @sickui/cli add [components...] [options]"
            title="Usage"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Examples</h3>
            <div className="grid gap-3">
              <CodeBlock
                code="npx @sickui/cli add button"
                title="Add single component"
              />
              <CodeBlock
                code="npx @sickui/cli add button card input"
                title="Add multiple components"
              />
              <CodeBlock
                code="npx @sickui/cli add"
                title="Interactive selection"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Options</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    -y, --yes
                  </code>
                  <span className="text-sm text-muted-foreground">
                    Skip confirmation prompt
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    -o, --overwrite
                  </code>
                  <span className="text-sm text-muted-foreground">
                    Overwrite existing files
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    -a, --all
                  </code>
                  <span className="text-sm text-muted-foreground">
                    Add all available components
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    -p, --path &lt;path&gt;
                  </code>
                  <span className="text-sm text-muted-foreground">
                    Custom installation path
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* List Command */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <List className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">list</h2>
              <p className="text-muted-foreground">
                List all available components
              </p>
            </div>
          </div>

          <CodeBlock code="npx @sickui/cli list" title="Usage" />

          <div className="bg-card border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Output example:</h4>
            <pre className="text-sm text-muted-foreground">
              {`Available components:

● button
  Dependencies: class-variance-authority, clsx, tailwind-merge, @radix-ui/react-slot

● card  
  Dependencies: clsx, tailwind-merge

Total: 2 components

Run sickui add <component> to add a component.`}
            </pre>
          </div>
        </div>

        {/* Diff Command */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">diff</h2>
              <p className="text-muted-foreground">
                Check for updates against the registry
              </p>
            </div>
          </div>

          <CodeBlock
            code="npx @sickui/cli diff [component] [options]"
            title="Usage"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Examples</h3>
            <div className="grid gap-3">
              <CodeBlock
                code="npx @sickui/cli diff button"
                title="Check specific component"
              />
              <CodeBlock
                code="npx @sickui/cli diff"
                title="Check all components"
              />
            </div>
          </div>
        </div>

        {/* Global Options */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Global Options</h2>

          <div className="space-y-3">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  -h, --help
                </code>
                <span className="text-sm text-muted-foreground">
                  Display help for command
                </span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  -v, --version
                </code>
                <span className="text-sm text-muted-foreground">
                  Display version number
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Troubleshooting</h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Command not found</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you get a "command not found" error, make sure you're using
                npx:
              </p>
              <CodeBlock code="npx @sickui/cli --help" />
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Permission errors</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you encounter permission errors, try running with sudo
                (macOS/Linux):
              </p>
              <CodeBlock code="sudo npx @sickui/cli init" />
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Configuration missing</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you get a "configuration missing" error, run init first:
              </p>
              <CodeBlock code="npx @sickui/cli init" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
