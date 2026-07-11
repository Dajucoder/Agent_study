# 04 · Retrieval & RAG (Retrieval-Augmented Generation)

> 🌐 **中文版**: [04-retrieval-and-rag.md](04-retrieval-and-rag.md)
>
> 🧭 **Navigate** · [🏠 Home](/en/index/) · [📚 Learning Path](/en/LEARNING_GUIDE/) · Prev：[03 Memory](/en/03-memory/) · Next：[05 Agents](/en/05-agents/) · Related：[03 Memory](/en/03-memory/) · [ARCHITECTURE](/en/ARCHITECTURE/)
>
> 🏷️ **Level**: Intermediate · **Time**: ~30 min · **Prereq**: [03 Memory](/en/03-memory/)

**RAG** lets the model answer based on "private documents you provide", rather than only what it remembered during training. It's one of the most common application patterns with LangChain.

## Goals

- Understand the RAG pipeline: load → split → embed → store → retrieve → generate.
- Use Chroma to build a local vector store and do similarity search.
- Assemble a "retrieval + generation" RAG chain.

## Core Concepts

### 1. Pipeline

1. **Document Loaders**: load text from PDF / Markdown / webpage / database.
2. **Text Splitters**: split long documents into appropriate chunks, balancing semantic integrity and model window.
3. **Embeddings**: turn each chunk into a vector.
4. **Vector Store (e.g. Chroma)**: store vectors and support "similarity search".
5. **Retriever**: given a query, return the most relevant chunks.
6. **Generation**: stuff the "relevant chunks + question" into the prompt and have the model answer based on the docs, ideally with citations.

### 2. Why Split

Models have a context limit, and overly long text isn't accurately retrievable. A good split (e.g. 500 chars with 50-char overlap) improves relevance.

### 3. Retrieval Quality Sets the Ceiling

RAG quality ≈ retrieval quality × generation quality. Focus on:

- Whether the split strategy preserves semantic boundaries.
- Whether the embedding model suits your corpus.
- Whether the number of retrieved chunks (top_k) is appropriate.

### 4. Prompt Tips

In the generation step, clearly tell the model "only answer based on the provided context, say 'I don't know' otherwise", to reduce hallucinations.

## Exercises

1. Prepare a Markdown file in `data/docs/`, complete loading and splitting.
2. Use `OpenAIEmbeddings` + `Chroma` to build a vector store (persisted to `data/chroma/`).
3. Implement a `retriever` that returns the top-3 relevant chunks for a query.
4. Build a RAG chain: retrieval injected into the prompt → model generates an answer with "sources".

## Common Pitfalls

- No persistence — rebuilding the vector store every time wastes tokens and time (Chroma supports `persist_directory`).
- Chunk too big / too small leads to inaccurate retrieval; start with defaults, then tune.
- Trusting the model's "made up" citations blindly; in practice, print the actually retrieved chunks to verify.

## Advanced: Evaluation

Getting RAG to run is just the first step. After changing chunk size, retrieval top_k, or the prompt, you usually want to know "did it get better or worse?".

### 1. Self-built "context recall"

No evaluation framework needed: prepare a few `{"question": ..., "expected_keywords": [...]}`,
run the RAG chain, and assert that the answer contains **at least 1** expected keyword.
A low hit rate means the retrieved context is insufficient to support the answer.

See [examples/10_rag_eval.py](../examples/10_rag_eval.py) for the full implementation:

- Part 1: hit rate over 5 samples, with tuning hints when below 4/5;
- Part 2 (optional): install `ragas` for faithfulness / answer_relevancy; degrades gracefully if absent.

### 2. Advanced metrics

- **Faithfulness**: is the answer fully grounded in retrieved context, with no hallucination?
- **Answer Relevancy**: does the answer address the question?
- **Context Relevancy**: are the retrieved chunks actually useful?

Frameworks like [RAGAS](https://docs.ragas.io/) can automate these.

## Advanced Retrieval (Re-ranking / Hybrid Search)

The `04` demo only uses vector similarity for retrieval, which is often not enough on real corpora.

### 1. Hybrid Search

Pure vector search is good at "semantic proximity" but tends to miss **literal keywords** (model numbers, code, proper nouns).
Hybrid search fuses two recall paths:

- **Vector search**: semantic match (already used, Chroma default).
- **Keyword search (BM25)**: literal match, via [`langchain_community.retrievers.BM25Retriever`](https://python.langchain.com/docs/integrations/retrievers/bm25/).
- **Fusion**: [`EnsembleRetriever`](https://python.langchain.com/docs/integrations/retrievers/ensemble/) weights the two paths (`weights=[0.5, 0.5]`) then merges with Reciprocal Rank Fusion.

### 2. Re-ranking

The **highest ROI** step for precision: recall more first (e.g. top-20), then re-score candidates with a Cross-Encoder and keep the top-k (e.g. top-5).

- Local: `sentence-transformers`' `CrossEncoder` (e.g. `cross-encoder/ms-marco-MiniLM-L-6-v2`).
- Hosted: [Cohere Rerank API](https://docs.cohere.com/docs/rerank); LangChain ships [`CohereRerank`](https://python.langchain.com/docs/integrations/document_compressors/cohere_rerank/) as a document compressor you can attach to the `retriever`.

Typical chain: `retriever(top_k=20) → CrossEncoderRerank(top_n=5) → LLM`.

### 3. Parent-Child Retrieval

Split into **small chunks** for embedding/retrieval (more precise), then link back to the **large chunk** to feed the LLM (more complete context).
LangChain provides [`InParentDocumentRetriever`](https://python.langchain.com/docs/integrations/retrievers/parent_document/).

> No full code here (to keep the repo lean); once the concepts are stable, follow the official docs to implement.

## Further Reading

- LangChain "RAG" tutorial and "Retrieval" module docs.
- Advanced: hybrid search (vector + keyword), re-ranking, parent-child document retrieval.
