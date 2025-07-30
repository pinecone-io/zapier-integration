declare module '@pinecone-database/pinecone' {
  import { vi } from 'vitest';
  export class Pinecone {
    constructor();
    index: ReturnType<typeof vi.fn>;
    namespace: ReturnType<typeof vi.fn>;
    configureIndex: ReturnType<typeof vi.fn>;
    describeIndex: ReturnType<typeof vi.fn>;
    listIndexes: ReturnType<typeof vi.fn>;
    listPaginated: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    // Define the inference property with a getter and setter
    get inference(): { embed: ReturnType<typeof vi.fn> };
    set inference(value: { embed: ReturnType<typeof vi.fn> });
  }
  export function __setPineconeMockState(newState: Partial<any>): void;
  export function __getPineconeMockState(): any;
}
