import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Metafile } from 'esbuild';

type ModuleId = number;
type ModuleMap = Record<number, Module>;
type ModuleDependencyGraph = Record<ModuleId, Set<ModuleId>>;
type Module = Metafile['inputs'][string] & {
  path: string;
}

function invariant(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function setToArray(_key: string, value: unknown) {
  return value instanceof Set ? Array.from(value) : value;
}

class DependencyManager {
  private static TRAVERSE_ALLOWED_KINDS = [
    'import-statement',
    'dynamic-import',
    'require-call',
  ];
  private dependencyGraph: ModuleDependencyGraph = {};
  private moduleMap: ModuleMap = {};
  private moduleIds: Record<string, number> = {};
  private initialized = false;
  private __moduleId = 1;

  constructor(private metafile: Metafile, private entryPath: string) {
    this.moduleIds[entryPath] = 0;
  }

  private generateUniqueModuleId({ path }: Module): number {
    return this.moduleIds[path] ?? (() => (this.moduleIds[path] = this.__moduleId++))();
  }

  private traverseModules() {
    for (const modulePath in this.metafile.inputs) {
      const currentModule = this.getModule(modulePath);
      const moduleId = this.generateUniqueModuleId(currentModule);
      const vertex = this.dependencyGraph[moduleId] ?? new Set();

      if (!(moduleId in this.moduleMap)) {
        this.moduleMap[moduleId] = currentModule;
        this.dependencyGraph[moduleId] = vertex;
      }
  
      for (const importModule of currentModule.imports) {
        if (!DependencyManager.TRAVERSE_ALLOWED_KINDS.some((kind) => kind === importModule.kind)) {
          continue;
        }
  
        const importedModule = this.getModule(importModule.path);
        if (importedModule) {
          vertex.add(this.generateUniqueModuleId(importedModule));
        }
      }
    }
  }

  initialize(): this {
    this.traverseModules();
    this.initialized = true;
    return this;
  }

  getModule(modulePath: string): Module | null {
    const targetInput = this.metafile.inputs[modulePath];
    if (targetInput) {
      return Object.defineProperty(this.metafile.inputs[modulePath], 'path', {
        enumerable: true,
        value: modulePath,
      }) as Module;
    } else {
      console.warn(`unable to get '${modulePath}'`);
      return null;
    };
  }

  getModuleId(modulePath: string): number | null {
    invariant(this.initialized, 'not initialized');
    return this.moduleIds[modulePath] ?? null;
  }

  getModuleById(moduleId: ModuleId): Module | undefined {
    invariant(this.initialized, 'not initialized');
    return this.moduleMap[moduleId];
  }

  getDependencyGraph(): ModuleDependencyGraph {
    invariant(this.initialized, 'not initialized');
    return this.dependencyGraph;
  }

  getModuleMap(): ModuleMap {
    invariant(this.initialized, 'not initialized');
    return this.moduleMap;
  }
}

async function main() {
  const rawMetafile = await readFile(join(__dirname, 'metafile.json'), 'utf-8');
  const metafile = JSON.parse(rawMetafile) as Metafile;

  const manager = new DependencyManager(metafile, 'index.js').initialize();
  const dependencyGraph = manager.getDependencyGraph();
  const moduleMap = manager.getModuleMap();

  // Test
  const testModulePath = 'src/screens/MainScreen.tsx';
  const testModuleId = manager.getModuleId(testModulePath);
  console.log('src/screens/MainScreen.tsx', {
    id: testModuleId,
    dependencies: Array.from(dependencyGraph[testModuleId]).map((moduleId) => ({
      id: moduleId,
      path: manager.getModuleById(moduleId).path,
    })),
  });

  await writeFile(
    join(__dirname, 'result/dependency-graph.json'),
    JSON.stringify(dependencyGraph, setToArray, 2),
    'utf-8',
  );
  await writeFile(
    join(__dirname, 'result/modules.json'),
    JSON.stringify(moduleMap, setToArray, 2),
    'utf-8',
  );
}

main().catch(console.error);
