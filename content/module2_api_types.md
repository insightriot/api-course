# Module 2: Understanding API Types and Structures

## REST APIs: The Most Common Approach

### What is REST?

REST (Representational State Transfer) is an architectural style for designing networked applications. It's the most common approach for building APIs today because of its simplicity and flexibility.

Think of REST as a set of rules for how computers should communicate over the internet. These rules make it easier for different systems to work together, similar to how traffic rules make it possible for different vehicles to share the road safely.

### Key Characteristics of REST APIs

1. **Client-Server Architecture**: 
   - The client (your application) and the server (the API provider) are separate
   - They communicate over the internet using standard HTTP methods

2. **Stateless Communication**:
   - Each request contains all the information needed to complete it
   - The server doesn't remember previous requests
   - Like ordering at a fast-food counter vs. a sit-down restaurant (the server doesn't remember your previous orders)

3. **Uniform Interface**:
   - Uses standard HTTP methods (GET, POST, PUT, DELETE)
   - Resources (data) are identified by URLs
   - Similar to how postal addresses work - each location has a unique address

4. **Resource-Based**:
   - Everything is treated as a resource (like a user, a product, or a document)
   - Each resource has its own URL (called an endpoint)
   - Example: `https://api.example.com/users/123` refers to the user with ID 123

### HTTP Methods Explained Simply

REST APIs use standard HTTP methods that correspond to the CRUD operations (Create, Read, Update, Delete):

| HTTP Method | What It Does | Real-World Analogy |
|-------------|--------------|-------------------|
| GET | Retrieves information | Looking up information in a book |
| POST | Creates new data | Filling out a form to create a new account |
| PUT | Updates existing data (replaces entirely) | Replacing an entire document with a new version |
| PATCH | Updates part of existing data | Editing specific parts of a document |
| DELETE | Removes data | Throwing away a document |

### Example of a REST API Request and Response

Let's look at a simple example of getting a user's information:

**Request:**
```
GET https://api.example.com/users/123
Headers:
  Authorization: Bearer api_key_12345
```

**Response:**
```json
{
  "id": 123,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "created_at": "2023-05-15T14:30:00Z"
}
```

This is like asking, "Can you give me information about user 123?" and receiving a card with their details.

## Other API Types: GraphQL, SOAP, and Webhooks

While REST is the most common API type, there are others you might encounter:

### GraphQL

GraphQL was developed by Facebook to address some limitations of REST APIs.

**Key Features:**
- Allows clients to request exactly the data they need (no more, no less)
- Uses a single endpoint for all requests
- Clients specify the structure of the response they want

**Analogy:**
If REST is like ordering from a fixed menu, GraphQL is like a custom sandwich shop where you specify exactly what ingredients you want.

**Example:**
```graphql
query {
  user(id: "123") {
    name
    email
    posts {
      title
      date
    }
  }
}
```

This request would return only the user's name, email, and their post titles and dates - nothing more.

### SOAP (Simple Object Access Protocol)

SOAP is an older, more rigid protocol that was common in enterprise applications.

**Key Features:**
- Uses XML format exclusively
- Has strict rules and standards
- Includes built-in error handling
- Often used in financial and enterprise systems

**Analogy:**
If REST is like casual conversation, SOAP is like formal legal documents with very specific structure and terminology.

**Example (simplified):**
```xml
<soap:Envelope>
  <soap:Header>
    <Authentication>
      <APIKey>12345</APIKey>
    </Authentication>
  </soap:Header>
  <soap:Body>
    <GetUser>
      <UserId>123</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>
```

### Webhooks

Webhooks are a different approach - instead of you requesting data, the server sends data to you when specific events happen.

**Key Features:**
- Event-driven (the server initiates communication)
- You provide a URL where you want to receive data
- The server sends data to your URL when events occur

**Analogy:**
If REST is like you calling a store to check if an item is in stock, webhooks are like the store calling you when the item arrives.

**Example:**
1. You register your URL: `https://yourapp.com/webhooks/payments`
2. When a payment is made, the payment processor sends data to your URL:
```json
{
  "event": "payment.successful",
  "amount": 99.99,
  "customer_id": "cust_123",
  "timestamp": "2023-06-15T10:30:00Z"
}
```

## Data Formats: JSON and XML Explained Visually

APIs need to send data in a structured format that both computers and humans can understand. The two most common formats are JSON and XML.

### JSON (JavaScript Object Notation)

JSON is the most popular format for modern APIs due to its simplicity and readability.

**Structure:**
- Data is organized in key-value pairs
- Uses curly braces `{}` for objects
- Uses square brackets `[]` for arrays
- Values can be strings, numbers, booleans, null, objects, or arrays

**Visual Example:**
```json
{
  "person": {
    "name": "John Doe",
    "age": 30,
    "isEmployed": true,
    "address": {
      "street": "123 Main St",
      "city": "Anytown"
    },
    "hobbies": ["reading", "hiking", "photography"]
  }
}
```

This can be visualized as:

```
person
├── name: "John Doe"
├── age: 30
├── isEmployed: true
├── address
│   ├── street: "123 Main St"
│   └── city: "Anytown"
└── hobbies
    ├── [0]: "reading"
    ├── [1]: "hiking"
    └── [2]: "photography"
```

### XML (eXtensible Markup Language)

XML is an older format that's more verbose but offers more structure.

**Structure:**
- Uses tags with opening `<tag>` and closing `</tag>` elements
- Attributes can be added to tags
- Can define document structure with schemas

**Visual Example:**
```xml
<person>
  <name>John Doe</name>
  <age>30</age>
  <isEmployed>true</isEmployed>
  <address>
    <street>123 Main St</street>
    <city>Anytown</city>
  </address>
  <hobbies>
    <hobby>reading</hobby>
    <hobby>hiking</hobby>
    <hobby>photography</hobby>
  </hobbies>
</person>
```

This represents the same data as the JSON example but in XML format.

## API Documentation: How to Read and Understand It

API documentation is like the instruction manual for an API. It tells you what the API can do and how to use it.

### Key Components of API Documentation

1. **Authentication Information**:
   - How to get access (API keys, OAuth, etc.)
   - Where to include authentication in requests

2. **Base URL**:
   - The starting point for all API requests
   - Example: `https://api.example.com/v1/`

3. **Endpoints**:
   - The specific URLs for different resources
   - Example: `/users`, `/products`, `/orders`

4. **Methods**:
   - Which HTTP methods are supported for each endpoint
   - Example: `GET /users`, `POST /users`, `DELETE /users/{id}`

5. **Parameters**:
   - Information you can send with your request
   - Path parameters (in the URL): `/users/{id}`
   - Query parameters (after ? in URL): `/users?status=active`
   - Request body parameters (in POST/PUT requests)

6. **Response Format**:
   - What data to expect back
   - Status codes and their meanings
   - Example response objects

7. **Error Handling**:
   - Common error codes
   - Error message formats
   - Troubleshooting tips

### How to Navigate API Documentation

1. **Start with the Getting Started guide**:
   - This usually covers authentication and basic requests

2. **Understand the authentication process**:
   - This is often the first hurdle

3. **Look for examples**:
   - Most good documentation includes example requests and responses

4. **Check for language-specific SDKs**:
   - Many APIs offer libraries for popular programming languages

5. **Look for interactive consoles**:
   - Some documentation lets you try API calls directly in the browser

### Example: Reading OpenAI API Documentation

Let's look at a simplified version of how you might read the OpenAI API documentation:

1. **Authentication**: You need an API key from your OpenAI account
2. **Base URL**: `https://api.openai.com/v1/`
3. **Endpoint**: `/chat/completions` for chat models
4. **Method**: POST
5. **Parameters**:
   ```json
   {
     "model": "gpt-4o",
     "messages": [
       {"role": "user", "content": "Hello!"}
     ],
     "temperature": 0.7
   }
   ```
6. **Response**:
   ```json
   {
     "id": "chatcmpl-123",
     "object": "chat.completion",
     "created": 1677858242,
     "model": "gpt-4o",
     "choices": [
       {
         "message": {
           "role": "assistant",
           "content": "Hello! How can I help you today?"
         },
         "index": 0
       }
     ]
   }
   ```

## Exercise: Exploring Public API Documentation

### Activity Instructions

For this exercise, we'll explore the documentation for a simple, public API that doesn't require authentication: the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/).

1. **Visit the documentation website**
2. **Identify the following**:
   - Base URL
   - Available resources/endpoints
   - Supported HTTP methods
   - Example requests and responses

3. **Try to answer these questions**:
   - How would you get a list of all users?
   - How would you get details for a specific post with ID 1?
   - How would you create a new post?
   - What format is the response data in?

### Sample Answers (for reference)

1. **Base URL**: `https://jsonplaceholder.typicode.com`
2. **Available resources**: `/posts`, `/comments`, `/albums`, `/photos`, `/todos`, `/users`
3. **Supported methods**: GET, POST, PUT, PATCH, DELETE

4. **To get all users**: 
   ```
   GET https://jsonplaceholder.typicode.com/users
   ```

5. **To get post with ID 1**:
   ```
   GET https://jsonplaceholder.typicode.com/posts/1
   ```

6. **To create a new post**:
   ```
   POST https://jsonplaceholder.typicode.com/posts
   Body:
   {
     "title": "My New Post",
     "body": "This is the content of my post",
     "userId": 1
   }
   ```

7. **Response format**: JSON

## Key Takeaways from Module 2

- REST is the most common API architecture, using standard HTTP methods and treating everything as resources
- Other API types include GraphQL (flexible queries), SOAP (strict structure), and Webhooks (event-driven)
- JSON and XML are the main data formats, with JSON being more popular in modern APIs
- API documentation provides essential information about how to use an API
- Understanding how to read API documentation is a crucial skill for working with APIs

In the next module, we'll explore AI-specific APIs and their unique capabilities, focusing on Large Language Models like GPT-4, Claude, and Gemini.
