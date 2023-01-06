declare module "@sabaki/immutable-gametree" {
  export default class GameTree {
    constructor({
      getId,
      merger,
      root,
    }?: {
      getId?: any;
      merger?: any;
      root?: any;
    });
    getId: any;
    merger: any;
    root: any;
    _nodeCache: {};
    _idAliases: {};
    _heightCache: number;
    _hashCache: any;
    _structureHashCache: any;
    get(id: any): any;
    getSequence(id: any): Generator<any, void, unknown>;
    mutate(mutator: (draft: Draft) => void): GameTree;
    navigate(id: any, step: any, currents: any): any;
    listNodes(): Generator<any, void, any>;
    listNodesHorizontally(
      startId: any,
      step: any
    ): Generator<any, void, unknown>;
    listNodesVertically(
      startId: any,
      step: any,
      currents: any
    ): Generator<any, void, unknown>;
    listCurrentNodes(currents: any): Generator<any, void, unknown>;
    listMainNodes(): Generator<any, void, unknown>;
    getLevel(id: any): number;
    getSection(level: any): any;
    getCurrentHeight(currents: any): number;
    getHeight(): number;
    getStructureHash(): string;
    getHash(): string;
    onCurrentLine(id: any, currents: any): boolean;
    onMainLine(id: any): boolean;
    toJSON(): any;
  }

  export class Draft {
    constructor(base: any);
    base: any;
    root: any;
    _passOnNodeCache: boolean;
    _nodeCache: {};
    _idAliases: any;
    _heightCache: any;
    _structureHashCache: any;
    get(id: any): any;
    _getLevel(id: any): number;
    appendNode(parentId: any, data: any, options?: {}): any;
    UNSAFE_appendNodeWithId(
      parentId: any,
      id: any,
      data: any,
      {
        disableMerging,
      }?: {
        disableMerging: any;
      }
    ): boolean;
    removeNode(id: any): boolean;
    shiftNode(id: any, direction: any): any;
    makeRoot(id: any): boolean;
    addToProperty(id: any, property: any, value: any): boolean;
    removeFromProperty(id: any, property: any, value: any): boolean;
    updateProperty(id: any, property: any, values: any): boolean;
    removeProperty(id: any, property: any): boolean;
  }
}
