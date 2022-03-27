enum FileType {
  File,
  Dir,
}

export class FileNode {
  slug: string;
  relativePath: string;
  title: string;
  filename: string;
  extension: string | null;
  type: FileType;
  parent: FileNode | null;
  children: FileNode[] = [];
  hide: boolean = false; // hide the node when displaying the tree instead of truncating the tree

  constructor(
    slug: string,
    relativePath: string,
    title: string,
    filename: string,
    extension: string | null,
    type: FileType,
    parent: FileNode | null,
    children: FileNode[]
  ) {
    this.slug = slug;
    this.relativePath = relativePath;
    this.title = title;
    this.filename = filename;
    this.extension = extension;
    this.type = type;
    this.parent = parent;
    this.children = children;
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
}

export const constructTree = (filename: string, fileInfo: any[]): FileNode => {
  const filenode = new FileNode('/', '/', '', filename, null, FileType.Dir, null, []);
  return filenode;
};
