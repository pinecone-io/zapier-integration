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
};

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
  index = pineconeMockState.index;
}

export function __setPineconeMockState(newState: Partial<PineconeMockState>) {
  Object.assign(pineconeMockState, newState);
}
export function __getPineconeMockState() {
  return pineconeMockState;
}
