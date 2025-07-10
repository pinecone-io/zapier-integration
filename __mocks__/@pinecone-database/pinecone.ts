import { vi } from 'vitest';

type PineconeMockState = {
  inference: {
    embed: ReturnType<typeof vi.fn>;
    getModel: ReturnType<typeof vi.fn>;
    listModels: ReturnType<typeof vi.fn>;
    rerank: ReturnType<typeof vi.fn>;
  };
  describeIndex: ReturnType<typeof vi.fn>;
  listIndexes: ReturnType<typeof vi.fn>;
  index: ReturnType<typeof vi.fn>;
  configureIndex: ReturnType<typeof vi.fn>;
};

const pineconeMockState: PineconeMockState = {
  inference: {
    embed: vi.fn(),
    getModel: vi.fn(),
    listModels: vi.fn(),
    rerank: vi.fn(),
  },
  describeIndex: vi.fn(),
  listIndexes: vi.fn(),
  index: vi.fn(),
  configureIndex: vi.fn(),
};

// Helper: always return an object with namespace() for index()
function createIndexMock(namespaceImpl?: any) {
  return vi.fn().mockImplementation(() => ({
    namespace: namespaceImpl || vi.fn()
  }));
}

export class Pinecone {
  constructor() {}
  get inference() {
    return {
      embed: pineconeMockState.inference.embed,
      getModel: pineconeMockState.inference.getModel,
      listModels: pineconeMockState.inference.listModels,
      rerank: pineconeMockState.inference.rerank,
    };
  }
  describeIndex = pineconeMockState.describeIndex;
  listIndexes = pineconeMockState.listIndexes;
  index = (...args: any[]) => {
    // If the test set a custom index mock, use it
    if (typeof pineconeMockState.index === 'function') {
      const result = pineconeMockState.index(...args);
      // If the result has a namespace function, return as is
      if (result && typeof result.namespace === 'function') return result;
    }
    // Default: return an object with a namespace function that returns an object with upsert/update/deleteOne mocks
    return {
      namespace: vi.fn().mockReturnValue({
        upsert: vi.fn(),
        upsertRecords: vi.fn(),
        update: vi.fn(),
        deleteOne: vi.fn(),
      })
    };
  };
  configureIndex = pineconeMockState.configureIndex;
}

export function __setPineconeMockState(newState: Partial<PineconeMockState>) {
  Object.assign(pineconeMockState, newState);
}
export function __getPineconeMockState() {
  return pineconeMockState;
} 