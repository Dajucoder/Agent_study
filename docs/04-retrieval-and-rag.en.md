# 04 · Retrieval & RAG (Retrieval-Augmented Generation)

> 🌐 **中文版**: [04-retrieval-and-rag.md](04-retrieval-and-rag.md)

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

## Further Reading

- LangChain "RAG" tutorial and "Retrieval" module docs.
- Advanced: hybrid search (vector + keyword), re-ranking, parent-child document retrieval.
