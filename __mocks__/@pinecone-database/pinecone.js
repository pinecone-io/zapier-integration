"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pinecone = void 0;
exports.__setPineconeMockState = __setPineconeMockState;
exports.__getPineconeMockState = __getPineconeMockState;
import { vi } from "vitest";
var pineconeMockState = {
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
var Pinecone = /** @class */ (function () {
    function Pinecone() {
        this.describeIndex = pineconeMockState.describeIndex;
        this.listIndexes = pineconeMockState.listIndexes;
        this.index = pineconeMockState.index;
    }
    Object.defineProperty(Pinecone.prototype, "inference", {
        get: function () {
            return {
                embed: pineconeMockState.inference.embed,
                getModel: pineconeMockState.inference.getModel,
                listModels: pineconeMockState.inference.listModels,
                rerank: pineconeMockState.inference.rerank,
            };
        },
        enumerable: false,
        configurable: true
    });
    return Pinecone;
}());
exports.Pinecone = Pinecone;
function __setPineconeMockState(newState) {
    Object.assign(pineconeMockState, newState);
}
function __getPineconeMockState() {
    return pineconeMockState;
}
