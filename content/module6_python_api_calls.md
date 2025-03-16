# Module 6: Hands-On with Python API Calls

## Python Basics for API Calls (No Coding Experience Required)

Don't worry if you've never written code before! This module is designed to help you understand and use Python for API calls without requiring previous programming experience. We'll focus on practical templates you can customize rather than teaching programming from scratch.

### Why Python for API Calls?

Python has become the go-to language for working with APIs because:

1. **Readability**: Python code is relatively easy to read and understand
2. **Libraries**: Python has excellent libraries for working with APIs
3. **Popularity**: It's widely used in data science, AI, and automation
4. **Simplicity**: Basic API calls can be written in just a few lines of code

### Essential Python Concepts for API Calls

You only need to understand a few basic concepts to work with our API templates:

#### Variables: Storing Information

Variables are like labeled containers that store information:

```python
# Storing text (strings)
name = "John"

# Storing numbers
age = 30

# Storing lists of items
colors = ["red", "green", "blue"]

# Storing structured data (dictionaries)
person = {
    "name": "John",
    "age": 30,
    "email": "john@example.com"
}
```

#### Functions: Reusable Blocks of Code

Functions are reusable blocks of code that perform specific tasks:

```python
# Defining a function
def greet(name):
    return f"Hello, {name}!"

# Using the function
message = greet("John")  # message will be "Hello, John!"
```

#### Importing Libraries: Using Pre-built Tools

Libraries are collections of pre-written code that you can use:

```python
# Importing the requests library for making HTTP requests
import requests

# Importing the json library for working with JSON data
import json

# Importing a specific function from a library
from datetime import datetime
```

That's it! With these basics, you'll be able to understand and modify our API templates.

## Using Templates to Create API Requests

Templates provide a structured way to make API calls without having to write code from scratch. You can simply fill in the specific details for your use case.

### Template 1: Basic GET Request

This template retrieves data from an API:

```python
import requests

def get_data_from_api(api_url, headers=None, params=None):
    """
    Make a GET request to an API and return the response.
    
    Parameters:
    - api_url: The URL of the API endpoint
    - headers: Dictionary of HTTP headers (optional)
    - params: Dictionary of query parameters (optional)
    
    Returns:
    - The JSON response from the API
    """
    # Make the request
    response = requests.get(
        url=api_url,
        headers=headers,
        params=params
    )
    
    # Check if the request was successful
    if response.status_code == 200:
        # Return the JSON response
        return response.json()
    else:
        # Print error message
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

# Example usage
api_url = "https://api.example.com/data"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
params = {
    "limit": 10,
    "category": "technology"
}

result = get_data_from_api(api_url, headers, params)
if result:
    print("Data retrieved successfully!")
    print(result)
```

### Template 2: OpenAI API Call

This template makes a request to OpenAI's API:

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def ask_openai(prompt, model="gpt-4o", temperature=0.7, max_tokens=150):
    """
    Send a prompt to OpenAI and get a response.
    
    Parameters:
    - prompt: The text prompt to send to OpenAI
    - model: The OpenAI model to use
    - temperature: Controls randomness (0-1)
    - max_tokens: Maximum length of the response
    
    Returns:
    - The text response from OpenAI
    """
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("Error: OPENAI_API_KEY not found in environment variables")
        return None
    
    # Initialize the OpenAI client
    client = OpenAI(api_key=api_key)
    
    try:
        # Make the API call
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        # Return the response text
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error: {e}")
        return None

# Example usage
prompt = "Explain what an API is in simple terms."
response = ask_openai(prompt)
if response:
    print(response)
```

### Template 3: Google Gemini API Call

This template makes a request to Google's Gemini API:

```python
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def ask_gemini(prompt, model="gemini-1.5-pro", temperature=0.7, max_tokens=150):
    """
    Send a prompt to Google's Gemini and get a response.
    
    Parameters:
    - prompt: The text prompt to send to Gemini
    - model: The Gemini model to use
    - temperature: Controls randomness (0-1)
    - max_tokens: Maximum length of the response
    
    Returns:
    - The text response from Gemini
    """
    # Get API key from environment variable
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment variables")
        return None
    
    # Configure the Gemini API
    genai.configure(api_key=api_key)
    
    try:
        # Initialize the model
        model = genai.GenerativeModel(model)
        
        # Generate content
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": temperature,
                "max_output_tokens": max_tokens
            }
        )
        
        # Return the response text
        return response.text
    
    except Exception as e:
        print(f"Error: {e}")
        return None

# Example usage
prompt = "Explain what an API is in simple terms."
response = ask_gemini(prompt)
if response:
    print(response)
```

### Template 4: Simple Vector Search

This template demonstrates a simple vector search using OpenAI embeddings:

```python
import os
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class SimpleVectorSearch:
    def __init__(self):
        """Initialize the vector search with empty documents and embeddings."""
        self.documents = []
        self.embeddings = []
        
        # Get API key from environment variable
        api_key = os.getenv("OPENAI_API_KEY")
        
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        # Initialize the OpenAI client
        self.client = OpenAI(api_key=api_key)
    
    def add_document(self, text):
        """
        Add a document to the vector search.
        
        Parameters:
        - text: The document text
        
        Returns:
        - The index of the added document
        """
        # Get embedding from OpenAI
        embedding = self._get_embedding(text)
        
        # Store document and embedding
        self.documents.append(text)
        self.embeddings.append(embedding)
        
        return len(self.documents) - 1
    
    def search(self, query, top_k=3):
        """
        Search for documents similar to the query.
        
        Parameters:
        - query: The search query
        - top_k: Number of results to return
        
        Returns:
        - List of (document, similarity) tuples
        """
        # Get embedding for the query
        query_embedding = self._get_embedding(query)
        
        # Calculate similarity with all documents
        similarities = []
        for doc_embedding in self.embeddings:
            similarity = self._calculate_similarity(query_embedding, doc_embedding)
            similarities.append(similarity)
        
        # Get indices of top_k most similar documents
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        # Return results
        results = []
        for idx in top_indices:
            results.append((self.documents[idx], similarities[idx]))
        
        return results
    
    def _get_embedding(self, text):
        """Get embedding from OpenAI."""
        response = self.client.embeddings.create(
            model="text-embedding-ada-002",
            input=text
        )
        return response.data[0].embedding
    
    def _calculate_similarity(self, embedding1, embedding2):
        """Calculate cosine similarity between two embeddings."""
        return np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )

# Example usage
def main():
    # Create a vector search
    search = SimpleVectorSearch()
    
    # Add some documents
    print("Adding documents...")
    search.add_document("APIs are interfaces that allow different software applications to communicate.")
    search.add_document("Python is a popular programming language for data science and AI.")
    search.add_document("Vector embeddings represent text as numbers to capture meaning.")
    search.add_document("Authentication is important for securing API access.")
    
    # Search for similar documents
    query = "How do computer programs talk to each other?"
    print(f"\nSearching for: '{query}'")
    
    results = search.search(query)
    
    # Display results
    print("\nResults:")
    for i, (document, similarity) in enumerate(results):
        print(f"{i+1}. Similarity: {similarity:.4f}")
        print(f"   Document: {document}\n")

if __name__ == "__main__":
    main()
```

## Understanding API Responses

When you make an API request, the response typically contains several important components:

### 1. Status Code

The status code tells you whether your request was successful:

- **2xx (Success)**
  - 200: OK - The request succeeded
  - 201: Created - A new resource was created
  
- **4xx (Client Error)**
  - 400: Bad Request - Something was wrong with your request
  - 401: Unauthorized - Authentication is required
  - 403: Forbidden - You don't have permission
  - 404: Not Found - The resource doesn't exist
  
- **5xx (Server Error)**
  - 500: Internal Server Error - Something went wrong on the server
  - 503: Service Unavailable - The server is temporarily unavailable

### 2. Headers

Headers provide metadata about the response:

```
Content-Type: application/json
Date: Tue, 15 Mar 2025 14:28:53 GMT
Content-Length: 1234
```

### 3. Body

The body contains the actual data, usually in JSON format:

```json
{
  "id": 123,
  "name": "Example Product",
  "price": 99.99,
  "in_stock": true,
  "categories": ["electronics", "gadgets"]
}
```

### Template for Parsing API Responses

```python
import requests
import json

def make_api_request(url, headers=None):
    """Make an API request and parse the response."""
    try:
        # Make the request
        response = requests.get(url, headers=headers)
        
        # Print status code
        print(f"Status Code: {response.status_code}")
        
        # Check if successful
        if 200 <= response.status_code < 300:
            print("Request was successful!")
            
            # Try to parse as JSON
            try:
                data = response.json()
                print("\nResponse Data:")
                print(json.dumps(data, indent=2))  # Pretty print JSON
                return data
            except json.JSONDecodeError:
                print("\nResponse is not JSON format:")
                print(response.text)
                return response.text
        else:
            print(f"Request failed with status code: {response.status_code}")
            print(f"Error message: {response.text}")
            return None
            
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Example usage
url = "https://jsonplaceholder.typicode.com/posts/1"
headers = {
    "Accept": "application/json"
}

data = make_api_request(url, headers)
if data:
    # Access specific fields in the response
    if isinstance(data, dict) and "title" in data:
        print(f"\nThe post title is: {data['title']}")
```

## Handling Errors Gracefully

When working with APIs, errors are inevitable. Here's how to handle them gracefully:

### Common API Errors

1. **Authentication Errors**
   - Invalid API key
   - Expired token
   - Missing credentials

2. **Rate Limiting**
   - Too many requests in a short time
   - Exceeded monthly quota

3. **Invalid Requests**
   - Missing required parameters
   - Incorrect data format
   - Invalid endpoint

4. **Server Errors**
   - Service temporarily unavailable
   - Internal server error

### Template for Error Handling

```python
import requests
import time

def make_api_request_with_retry(url, headers=None, max_retries=3, retry_delay=2):
    """
    Make an API request with automatic retry for certain errors.
    
    Parameters:
    - url: The API endpoint URL
    - headers: Request headers (optional)
    - max_retries: Maximum number of retry attempts
    - retry_delay: Seconds to wait between retries
    
    Returns:
    - The response data or None if all retries fail
    """
    retries = 0
    
    while retries <= max_retries:
        try:
            # Make the request
            response = requests.get(url, headers=headers, timeout=10)
            
            # Handle different status codes
            if response.status_code == 200:
                # Success
                return response.json()
                
            elif response.status_code == 401:
                # Authentication error
                print("Error: Authentication failed. Check your API key.")
                return None
                
            elif response.status_code == 404:
                # Resource not found
                print(f"Error: Resource not found at {url}")
                return None
                
            elif response.status_code == 429:
                # Rate limited - retry after waiting
                if retries < max_retries:
                    retry_after = int(response.headers.get('Retry-After', retry_delay))
                    print(f"Rate limited. Retrying after {retry_after} seconds...")
                    time.sleep(retry_after)
                    retries += 1
                    continue
                else:
                    print("Error: Rate limit exceeded and max retries reached.")
                    return None
                    
            elif 500 <= response.status_code < 600:
                # Server error - retry
                if retries < max_retries:
                    print(f"Server error ({response.status_code}). Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retries += 1
                    continue
                else:
                    print(f"Error: Server error ({response.status_code}) and max retries reached.")
                    return None
                    
            else:
                # Other errors
                print(f"Error: Unexpected status code {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except requests.exceptions.ConnectionError:
            # Connection error - retry
            if retries < max_retries:
                print(f"Connection error. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retries += 1
                continue
            else:
                print("Error: Connection failed and max retries reached.")
                return None
                
        except requests.exceptions.Timeout:
            # Timeout - retry
            if retries < max_retries:
                print(f"Request timed out. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retries += 1
                continue
            else:
                print("Error: Request timed out and max retries reached.")
                return None
                
        except Exception as e:
            # Unexpected error
            print(f"Unexpected error: {e}")
            return None
    
    return None

# Example usage
url = "https://api.example.com/data"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

data = make_api_request_with_retry(url, headers)
if data:
    print("Data retrieved successfully!")
    print(data)
```

## Exercise: Customizing API Call Templates

### Activity: Personalize an OpenAI API Call

In this exercise, you'll customize the OpenAI API template to create a specific application.

#### Step 1: Set Up Your Environment

1. Create a file named `.env` with your API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

2. Create a new Python file named `custom_openai_app.py`

3. Copy the OpenAI template from earlier in this module

#### Step 2: Customize the Template

Modify the template to create a simple application that:
1. Takes a topic as input
2. Generates three questions about that topic
3. Formats the questions nicely

Here's a starting point:

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_questions(topic, num_questions=3):
    """
    Generate questions about a specific topic using OpenAI.
    
    Parameters:
    - topic: The topic to generate questions about
    - num_questions: Number of questions to generate
    
    Returns:
    - List of generated questions
    """
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("Error: OPENAI_API_KEY not found in environment variables")
        return None
    
    # Initialize the OpenAI client
    client = OpenAI(api_key=api_key)
    
    # Create the prompt
    prompt = f"Generate {num_questions} interesting questions about {topic}. " \
             f"Return only the questions, numbered from 1 to {num_questions}."
    
    try:
        # Make the API call
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        # Get the response text
        response_text = response.choices[0].message.content
        
        # Parse the questions
        questions = []
        for line in response_text.strip().split('\n'):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('•')):
                questions.append(line)
        
        return questions
    
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    # Get topic from user
    topic = input("Enter a topic to generate questions about: ")
    
    # Generate questions
    questions = generate_questions(topic)
    
    # Display results
    if questions:
        print(f"\n--- Questions about {topic} ---")
        for question in questions:
            print(question)
    else:
        print("Failed to generate questions.")

if __name__ == "__main__":
    main()
```

#### Step 3: Extend the Application

Try extending the application with one of these features:
1. Allow the user to specify the difficulty level of the questions
2. Generate answers along with the questions
3. Save the questions to a file

#### Discussion Questions

1. How could you modify this template for different use cases?
2. What parameters might you change to get different types of responses?
3. How could you handle errors if the API call fails?
4. What other APIs could you integrate with this application?

## Key Takeaways from Module 6

- Python provides a simple way to make API calls without extensive coding knowledge
- Templates can be customized for different API providers and use cases
- Understanding API responses helps you extract the information you need
- Proper error handling makes your API calls more robust
- Even with minimal coding experience, you can create useful applications with APIs

In the next module, we'll explore practical applications and integration of APIs into existing workflows.
