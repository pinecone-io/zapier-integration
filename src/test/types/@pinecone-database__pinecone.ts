declare module '@pinecone-database/pinecone' {
  export class Pinecone {
    constructor();
    get inference(): { embed: ReturnType<typeof vi.fn> };
    describeIndex: ReturnType<typeof vi.fn>;
    listIndexes: ReturnType<typeof vi.fn>;
    index: ReturnType<typeof vi.fn>;
  }
  export function __setPineconeMockState(newState: Partial<any>): void;
  export function __getPineconeMockState(): any;
}
