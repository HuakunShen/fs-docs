import path from './path';

enum FileType {
  File,
  Dir,
}

export class FileNode {
  slug: string;
  relativePath: string;
  title: string;
  filename: string;
  extension: string | null | undefined;
  type: FileType;
  parent: FileNode | null;
  children: FileNode[] = [];
  height: number = 0;
  depth: number = 0;
  hide: boolean = false; // hide the node when displaying the tree instead of truncating the tree
  constructor(
    slug: string,
    relativePath: string, // this doesn't have a '/' prefix, slug does
    title: string,
    filename: string,
    extension: string | null | undefined,
    type: FileType,
    parent: FileNode | null,
    children: FileNode[],
    height: number = 0,
    depth: number = 0
  ) {
    this.slug = slug;
    this.relativePath = relativePath;
    this.title = title;
    this.filename = filename;
    this.extension = extension;
    this.type = type;
    this.parent = parent;
    this.children = children;
    this.height = height;
    this.depth = depth;
    
  }

  /**
   *
   * @returns whether this node represents a file
   */
  isFile(): boolean {
    return this.type === FileType.File;
  }

  isDir(): boolean {
    return this.type === FileType.Dir;
  }

  /**
   * traverse tree and apply cb callback function to each node
   * @param cb callback to be executed against each node in the tree
   * @returns
   */
  traverse(cb: Function): FileNode {
    this.children.forEach((node) => {
      node.traverse(cb);
    });
    cb(this);
    return this;
  }

  /**
   *
   * @param ext file extensions
   * @param keep keep files with ext or fileter out
   */
  filterExt(ext: string | string[], keep: boolean): FileNode {
    const helper = (node: FileNode) => {
      if (node.type === FileType.File && node.extension === ext) {
        node.hide = !keep;
      }
    };
    this.traverse(helper);
    return this;
  }

  /**
   * update height of all nodes in tree recursively
   * @returns updated this.height
   */
  updateHeight(): number {
    if (this.children.length === 0) {
      this.height = 0;
    } else {
      const heights = this.children.map((child: FileNode): number => child.updateHeight());
      this.height = Math.max.apply(Math, heights) + 1;
    }
    return this.height;
  }

  updateDepth(depth: number = 0): number {
    this.depth = depth;
    this.children.forEach((child: FileNode) => {
      child.updateDepth(depth + 1);
    });
    return this.depth;
  }
}

export const constructTree = (filename: string, fileInfo: any[]): FileNode => {
  const filenode = new FileNode('/', '/', '', filename, null, FileType.Dir, null, []);
  return filenode;
};

export type GqlNode = {
  ext: string;
  name: string;
  relativePath: string;
  fields: {
    slug: string;
  };
};

/**
 * parse all sub paths
 * e.g., input: a/b/c.md
 * 			 output: ["a", "a/b"]
 * @param p a path in string format
 * @returns array of all paths in the given dir path
 */
const getAllDirs = (p: string) => {
  const dirPaths = [];
  let p_ = p;
  while (path.dirname(p_) !== '') {
    p_ = path.dirname(p_);
    dirPaths.push(p_);
  }
  return dirPaths;
};

/**
 * Turn an array of nodes into a tree structure
 * Time Complexity: O(n)
 * @param nodes an array of file nodes returned from graphql by the gatsby-source-filesystem plugin
 */
export const construct = (nodes: GqlNode[]) => {
  // map relative path to a graphql Node
  const slug2nodeMap = new Map<string, GqlNode>();
  nodes.forEach((node) => slug2nodeMap.set(node.fields.slug, node));
  const slugs = nodes.map((node) => node.fields.slug);
  const slugSet = new Set(slugs);
  const dirPaths = slugs.map((p) => getAllDirs(p));
  const dirPathSet = new Set(dirPaths.flat());
  const rootNode = new FileNode(
    '/',
    '',
    '',
    '/',
    '',
    FileType.Dir,
    null, // null for now, will be filled
    [] // empty for now, will be filled
  );

  const map = new Map<string, FileNode>();
  map.set('', rootNode);
  // construct dir nodes O(n)
  Array.from(dirPathSet)
    .concat(Array.from(slugSet))
    .forEach((p) => {
      map.set(
        p,
        new FileNode(
          p,
          p,
          '',
          path.basename(p),
          slugSet.has(p) ? slug2nodeMap.get(p)?.ext : '',
          slugSet.has(p) ? FileType.File : FileType.Dir,
          null, // parent is null for now, will be filled
          [] // children set empty for now, will be filled
        )
      );
    });

  // fill in children and parent O(n)
  map.forEach((node: FileNode, relPath: string) => {
    if (relPath !== '') {
      // not root node
      const parent = map.get(path.dirname(node.slug));
      if (!!parent) {
        node.parent = parent;
        parent.children.push(node);
      } else throw new Error(`No Parent Found for FileNode: ${node.slug}`);
    }
  });

  // add height to tree nodes
  rootNode.updateHeight();
  rootNode.updateDepth();
  return rootNode;
};
