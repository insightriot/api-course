# AI-Specific APIs and Vector Stores

## AI API Types

### OpenAI API

OpenAI provides powerful language model APIs that can be used for a variety of natural language processing tasks. The most common models include GPT-4o, GPT-4, and other variants.

#### Authentication
- Requires an API key from OpenAI platform (https://platform.openai.com/api-keys)
- API keys should be kept secure and not shared publicly
- OpenAI recommends using project-based API keys for more granular control

#### Basic Usage (Python)
```python
# Synchronous client
from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
    model="gpt-4o-2024-05-13",
    messages=[{'role': 'user', 'content': "Hello!"}],
    temperature=0.5,
    max_tokens=250,
)
answer = response.choices[0].message.content
print(answer)
```

#### Asynchronous Usage (Python)
```python
# Asynchronous client
import asyncio
from openai import AsyncOpenAI

async def openai_chat_request(prompt, model_name, temperature=0.0):
    message = {'role': 'user', 'content': prompt}
    async with AsyncOpenAI(api_key="YOUR_API_KEY") as client:
        return await client.chat.completions.create(
            model=model_name,
            messages=[message],
            temperature=temperature,
            max_tokens=256,
        )

# Usage with asyncio
response = asyncio.run(
    openai_chat_request(prompt="Hello!", model_name="gpt-4o-2024-05-13")
)
answer = response.choices[0].message.content
```

### Anthropic Claude API

Anthropic's Claude models are designed to be helpful, harmless, and honest AI assistants.

#### Authentication
- Requires an API key from Anthropic dashboard
- Similar security considerations as OpenAI

#### Basic Usage (Python)
```python
from anthropic import Anthropic
from anthropic.types.message import Message

client = Anthropic(api_key="YOUR_API_KEY")

response = client.messages.create(
    max_tokens=256,
    messages=[{'role': 'user', 'content': 'Hello!'}],
    model="claude-3-opus-20240229",
    temperature=0.5,
)

answer = response.content[0].text
print(answer)
```

### Google Gemini API

Google's Gemini models provide state-of-the-art capabilities for various AI tasks.

#### Authentication
- Requires an API key from Google AI Studio
- For production use, Google recommends Vertex AI with Google Cloud Platform

#### Basic Usage (Python)
```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel('gemini-1.5-pro')
response = model.generate_content("Hello!")
print(response.text)
```

## Vector Stores and Document Vectorization

### What are Vector Stores?

Vector stores (or vector databases) are specialized databases designed to store, index, and query vector embeddings efficiently. They are essential components in modern AI applications, particularly for:

- Semantic search
- Recommendation systems
- Retrieval Augmented Generation (RAG)
- Multimodal search (text, images, audio)
- Similarity matching

### How Vector Search Works

1. **Vectorization/Embedding**: Convert content (text, images, etc.) into numerical vector representations using embedding models
2. **Indexing**: Store these vectors in a specialized index structure that enables efficient similarity search
3. **Similarity Search**: When a query is received, it's converted to a vector and compared to stored vectors using distance metrics
4. **Retrieval**: Return the most similar vectors (and their associated content) based on the chosen similarity metric

### Key Concepts in Vector Stores

1. **Embeddings**: Numerical representations of content that capture semantic meaning
2. **Similarity Metrics**: Methods to measure distance between vectors (cosine similarity, Euclidean distance, etc.)
3. **Nearest Neighbors Algorithms**: Techniques to efficiently find the most similar vectors (kNN, ANN)
4. **Dimensionality**: The size of the vector (number of dimensions)
5. **Vector Indexes**: Specialized data structures for efficient vector search (HNSW, IVF, etc.)

### Popular Vector Store Solutions

1. **Pinecone**: Fully managed vector database service
2. **Weaviate**: Open-source vector search engine
3. **Milvus**: Open-source vector database for scalable similarity search
4. **Qdrant**: Vector search engine focused on extended filtering
5. **Chroma**: Open-source embedding database designed for RAG applications
6. **Azure AI Search**: Microsoft's vector search solution integrated with Azure
7. **Faiss (Facebook AI Similarity Search)**: Library for efficient similarity search

### Document Vectorization Process

1. **Text Preprocessing**: Clean and prepare text (remove stopwords, tokenize, etc.)
2. **Chunking**: Split documents into manageable pieces
3. **Embedding Generation**: Convert chunks to vector embeddings using models like:
   - OpenAI's text-embedding-ada-002
   - Google's text-embedding models
   - Open-source models like SBERT
4. **Metadata Association**: Attach relevant metadata to vectors for filtering
5. **Storage**: Store vectors in a vector database for retrieval

### Example: Basic Vector Store with Python and OpenAI

```python
import openai
from openai import OpenAI
import numpy as np

# Initialize OpenAI client
client = OpenAI(api_key="YOUR_API_KEY")

# Function to create embeddings
def get_embedding(text, model="text-embedding-ada-002"):
    response = client.embeddings.create(
        model=model,
        input=text
    )
    return response.data[0].embedding

# Simple in-memory vector store
class SimpleVectorStore:
    def __init__(self):
        self.documents = []
        self.embeddings = []
        
    def add_document(self, text, metadata=None):
        embedding = get_embedding(text)
        self.embeddings.append(embedding)
        self.documents.append({"text": text, "metadata": metadata})
        
    def search(self, query, top_k=3):
        query_embedding = get_embedding(query)
        
        # Calculate cosine similarity
        similarities = []
        for doc_embedding in self.embeddings:
            similarity = np.dot(query_embedding, doc_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(doc_embedding)
            )
            similarities.append(similarity)
        
        # Get top k results
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                "document": self.documents[idx],
                "similarity": similarities[idx]
            })
            
        return results

# Usage
vector_store = SimpleVectorStore()

# Add documents
vector_store.add_document("The quick brown fox jumps over the lazy dog", {"id": 1})
vector_store.add_document("A man is walking his dog in the park", {"id": 2})
vector_store.add_document("The weather is sunny and warm today", {"id": 3})

# Search
results = vector_store.search("animals and pets")
for result in results:
    print(f"Text: {result['document']['text']}")
    print(f"Similarity: {result['similarity']}")
    print()
```

### Vector Stores in RAG Applications

Retrieval Augmented Generation (RAG) is a common pattern that combines vector stores with LLMs:

1. **Indexing Phase**:
   - Process documents into chunks
   - Generate embeddings for each chunk
   - Store embeddings and chunks in a vector store

2. **Query Phase**:
   - Convert user query to embedding
   - Retrieve relevant chunks from vector store
   - Augment LLM prompt with retrieved information
   - Generate response using the augmented context

This approach helps ground LLM responses in specific knowledge and reduces hallucinations.

### Multimodal Vector Search

Modern vector stores can handle embeddings from different modalities:

- Text embeddings from language models
- Image embeddings from vision models
- Audio embeddings from speech models

This enables cross-modal search, such as finding images that match a text description or finding text that describes an image.

### Challenges and Considerations

1. **Scalability**: Managing large vector collections efficiently
2. **Dimensionality**: Balancing embedding size and performance
3. **Filtering**: Combining vector search with metadata filtering
4. **Updating**: Strategies for updating vectors when source content changes
5. **Evaluation**: Measuring the quality of vector search results
