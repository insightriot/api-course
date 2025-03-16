# Module 7: Practical Applications and Integration

## Integrating APIs with Existing Tools

One of the most powerful aspects of APIs is their ability to connect with tools you already use. This integration can automate workflows, enhance capabilities, and create seamless experiences.

### Common Integration Scenarios

#### 1. Enhancing Productivity Tools

**Scenario**: Adding AI capabilities to your note-taking app
**Example**: Using OpenAI's API to summarize long notes in Notion or Evernote

```python
import os
import requests
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def summarize_text(text, max_length=150):
    """Summarize text using OpenAI API"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes text concisely."},
            {"role": "user", "content": f"Please summarize the following text in about {max_length} words:\n\n{text}"}
        ],
        max_tokens=max_length * 2,  # Approximate token count
        temperature=0.5
    )
    
    return response.choices[0].message.content

# Example integration with a note-taking API (simplified)
def get_notes_from_app(api_key, notebook_id):
    """Get notes from a note-taking app API"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(
        f"https://api.notes-app.example.com/notebooks/{notebook_id}/notes",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

def add_summary_to_notes():
    """Get notes and add AI-generated summaries"""
    notes_api_key = os.getenv("NOTES_APP_API_KEY")
    notebook_id = "example-notebook-id"
    
    # Get notes from the app
    notes = get_notes_from_app(notes_api_key, notebook_id)
    
    if not notes:
        return
    
    # Process each note
    for note in notes:
        if len(note["content"]) > 500:  # Only summarize longer notes
            summary = summarize_text(note["content"])
            
            # Add summary back to the note
            update_response = requests.patch(
                f"https://api.notes-app.example.com/notes/{note['id']}",
                headers={
                    "Authorization": f"Bearer {notes_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "summary": summary
                }
            )
            
            if update_response.status_code == 200:
                print(f"Added summary to note: {note['title']}")
            else:
                print(f"Failed to update note: {note['title']}")
```

#### 2. Connecting Communication Platforms

**Scenario**: Enhancing Slack with AI-powered responses
**Example**: Creating a Slack bot that answers questions using Google's Gemini API

```python
import os
import re
import slack_sdk
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Slack client
slack_token = os.getenv("SLACK_BOT_TOKEN")
slack_client = slack_sdk.WebClient(token=slack_token)

# Configure Google Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-pro')

def handle_message(event):
    """Process incoming Slack messages and respond with AI"""
    # Get the message text
    text = event.get("text", "").strip()
    channel = event.get("channel")
    user = event.get("user")
    
    # Check if the message mentions the bot
    bot_user_id = os.getenv("SLACK_BOT_USER_ID")
    if f"<@{bot_user_id}>" in text:
        # Remove the bot mention
        question = re.sub(f"<@{bot_user_id}>", "", text).strip()
        
        # Generate response using Gemini
        try:
            response = model.generate_content(question)
            answer = response.text
            
            # Post the response to Slack
            slack_client.chat_postMessage(
                channel=channel,
                text=answer,
                thread_ts=event.get("ts")
            )
        except Exception as e:
            slack_client.chat_postMessage(
                channel=channel,
                text=f"Sorry, I encountered an error: {str(e)}",
                thread_ts=event.get("ts")
            )
```

#### 3. Enhancing Data Analysis Tools

**Scenario**: Adding AI insights to spreadsheet data
**Example**: Analyzing Google Sheets data with AI

```python
import os
import pandas as pd
from googleapiclient.discovery import build
from google.oauth2 import service_account
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_sheet_data(spreadsheet_id, range_name):
    """Get data from Google Sheets"""
    # Set up credentials
    credentials = service_account.Credentials.from_service_account_file(
        'service-account-key.json',
        scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
    )
    
    # Build the service
    service = build('sheets', 'v4', credentials=credentials)
    
    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(
        spreadsheetId=spreadsheet_id,
        range=range_name
    ).execute()
    
    # Convert to pandas DataFrame
    values = result.get('values', [])
    headers = values[0]
    data = values[1:]
    df = pd.DataFrame(data, columns=headers)
    
    return df

def analyze_data_with_ai(df):
    """Generate insights from data using OpenAI"""
    # Convert DataFrame to string representation
    data_str = df.to_string()
    
    # Initialize OpenAI client
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # Generate insights
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a data analyst. Provide 3-5 key insights from the data."},
            {"role": "user", "content": f"Here is my data:\n\n{data_str}\n\nWhat are the key insights?"}
        ],
        temperature=0.5,
        max_tokens=500
    )
    
    return response.choices[0].message.content

# Example usage
spreadsheet_id = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'  # Example ID
range_name = 'Sheet1!A1:F20'

df = get_sheet_data(spreadsheet_id, range_name)
insights = analyze_data_with_ai(df)
print(insights)
```

### Integration Best Practices

1. **Start Small**: Begin with simple integrations and expand as you gain confidence
2. **Use Webhooks**: For real-time updates, consider using webhooks where available
3. **Handle Errors Gracefully**: Always include error handling to prevent workflow disruptions
4. **Monitor Usage**: Keep track of API calls to avoid exceeding limits
5. **Secure Credentials**: Never hardcode API keys in your integration code

## Building Simple Workflows with APIs

APIs can be combined to create powerful workflows that automate complex tasks. Let's explore how to build these workflows.

### Workflow Example 1: Content Research Assistant

This workflow helps with content research by:
1. Searching for relevant information
2. Summarizing the findings
3. Generating content ideas

```python
import os
import requests
from openai import OpenAI
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def search_web(query):
    """Search the web for information (using a search API)"""
    search_api_key = os.getenv("SEARCH_API_KEY")
    
    response = requests.get(
        "https://api.searchapi.example.com/search",
        params={
            "api_key": search_api_key,
            "q": query,
            "num": 5
        }
    )
    
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        print(f"Search error: {response.status_code}")
        return []

def extract_content(url):
    """Extract main content from a webpage"""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract main content (simplified)
        paragraphs = soup.find_all('p')
        content = ' '.join([p.get_text() for p in paragraphs])
        
        return content[:5000]  # Limit content length
    except Exception as e:
        print(f"Error extracting content from {url}: {e}")
        return ""

def summarize_with_ai(text):
    """Summarize text using OpenAI"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Summarize the following text in 3-4 sentences."},
            {"role": "user", "content": text}
        ],
        temperature=0.5,
        max_tokens=150
    )
    
    return response.choices[0].message.content

def generate_content_ideas(topic, summaries):
    """Generate content ideas based on research"""
    combined_research = "\n\n".join(summaries)
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a content strategist. Generate 5 content ideas based on the research."},
            {"role": "user", "content": f"Topic: {topic}\n\nResearch:\n{combined_research}\n\nGenerate 5 content ideas:"}
        ],
        temperature=0.7,
        max_tokens=300
    )
    
    return response.choices[0].message.content

def research_workflow(topic):
    """Run the complete research workflow"""
    print(f"Researching: {topic}")
    
    # Step 1: Search for information
    print("Searching the web...")
    search_results = search_web(topic)
    
    # Step 2: Extract and summarize content
    print("Extracting and summarizing content...")
    summaries = []
    for result in search_results:
        content = extract_content(result["url"])
        if content:
            summary = summarize_with_ai(content)
            summaries.append(summary)
            print(f"Summarized: {result['title']}")
    
    # Step 3: Generate content ideas
    print("Generating content ideas...")
    ideas = generate_content_ideas(topic, summaries)
    
    # Return the complete research package
    return {
        "topic": topic,
        "summaries": summaries,
        "content_ideas": ideas
    }

# Example usage
research = research_workflow("artificial intelligence in healthcare")
print("\n=== RESEARCH RESULTS ===\n")
print("SUMMARIES:")
for i, summary in enumerate(research["summaries"]):
    print(f"\n--- Summary {i+1} ---")
    print(summary)

print("\nCONTENT IDEAS:")
print(research["content_ideas"])
```

### Workflow Example 2: Customer Feedback Analyzer

This workflow processes customer feedback by:
1. Collecting feedback from multiple sources
2. Analyzing sentiment and key themes
3. Generating actionable insights

```python
import os
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_feedback_data():
    """
    Get customer feedback from multiple sources
    In a real application, this would connect to various APIs
    """
    # Simulated data for demonstration
    feedback = [
        {"source": "email", "text": "I love your product! It's so easy to use."},
        {"source": "survey", "text": "The new feature is confusing and doesn't work well."},
        {"source": "app_review", "text": "Great app but crashes sometimes on my phone."},
        {"source": "social_media", "text": "Worst customer service ever! Never buying again."},
        {"source": "support_ticket", "text": "Having trouble connecting to my account."}
    ]
    
    return pd.DataFrame(feedback)

def analyze_sentiment(text):
    """Analyze sentiment of text using OpenAI"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Analyze the sentiment of the following text. Respond with only: positive, negative, or neutral."},
            {"role": "user", "content": text}
        ],
        temperature=0.3,
        max_tokens=10
    )
    
    return response.choices[0].message.content.strip().lower()

def extract_themes(text):
    """Extract key themes from text using OpenAI"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Extract up to 3 key themes from the following feedback. Respond with only a comma-separated list."},
            {"role": "user", "content": text}
        ],
        temperature=0.3,
        max_tokens=50
    )
    
    themes = response.choices[0].message.content.strip().split(',')
    return [theme.strip() for theme in themes]

def generate_insights(feedback_df):
    """Generate insights from analyzed feedback"""
    # Prepare the data for the AI
    feedback_summary = feedback_df.to_string()
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a customer insights analyst. Generate 3-5 actionable insights from this customer feedback data."},
            {"role": "user", "content": f"Here is the analyzed customer feedback:\n\n{feedback_summary}\n\nWhat are the key insights and recommended actions?"}
        ],
        temperature=0.5,
        max_tokens=400
    )
    
    return response.choices[0].message.content

def feedback_analysis_workflow():
    """Run the complete feedback analysis workflow"""
    print("Starting customer feedback analysis...")
    
    # Step 1: Collect feedback
    print("Collecting feedback data...")
    feedback_df = get_feedback_data()
    
    # Step 2: Analyze sentiment and themes
    print("Analyzing feedback...")
    sentiments = []
    all_themes = []
    
    for _, row in feedback_df.iterrows():
        text = row["text"]
        sentiment = analyze_sentiment(text)
        themes = extract_themes(text)
        
        sentiments.append(sentiment)
        all_themes.append(themes)
    
    # Add results to DataFrame
    feedback_df["sentiment"] = sentiments
    feedback_df["themes"] = all_themes
    
    # Step 3: Generate insights
    print("Generating insights...")
    insights = generate_insights(feedback_df)
    
    return {
        "analyzed_feedback": feedback_df,
        "insights": insights
    }

# Example usage
results = feedback_analysis_workflow()
print("\n=== ANALYSIS RESULTS ===\n")
print(results["analyzed_feedback"])
print("\nINSIGHTS:")
print(results["insights"])
```

### Tips for Building Effective Workflows

1. **Map the Process**: Before coding, sketch out the workflow steps
2. **Handle Data Transitions**: Ensure data formats are compatible between APIs
3. **Build Incrementally**: Test each step before connecting them
4. **Add Logging**: Include logging to track workflow progress
5. **Consider Asynchronous Processing**: For long-running workflows, use async patterns

## Real-World Examples from Various Industries

APIs are transforming how work gets done across industries. Here are some real-world examples:

### Healthcare

**Example**: Clinical Decision Support
- **APIs Used**: Electronic Health Record (EHR) API + Medical Knowledge Base API + AI API
- **Workflow**:
  1. Retrieve patient data from EHR
  2. Check symptoms against medical knowledge base
  3. Generate potential diagnoses and treatment options with AI
  4. Present recommendations to healthcare provider

```python
# Simplified example of clinical decision support
def clinical_decision_support(patient_id):
    # Step 1: Get patient data from EHR
    patient_data = get_patient_data(patient_id)
    
    # Step 2: Extract relevant clinical information
    symptoms = patient_data["current_symptoms"]
    medical_history = patient_data["medical_history"]
    medications = patient_data["current_medications"]
    
    # Step 3: Check against medical knowledge base
    relevant_conditions = query_medical_knowledge_base(symptoms)
    
    # Step 4: Generate AI recommendations
    clinical_context = f"""
    Patient symptoms: {symptoms}
    Medical history: {medical_history}
    Current medications: {medications}
    Relevant potential conditions: {relevant_conditions}
    """
    
    recommendations = generate_ai_recommendations(clinical_context)
    
    return recommendations
```

### Marketing

**Example**: Content Marketing Automation
- **APIs Used**: Social Media API + Analytics API + AI Content Generation API
- **Workflow**:
  1. Analyze top-performing content from analytics
  2. Generate similar content ideas with AI
  3. Create and schedule posts across platforms
  4. Track performance and adjust strategy

```python
# Simplified example of content marketing automation
def content_marketing_automation():
    # Step 1: Analyze top content
    top_content = get_top_performing_content()
    
    # Step 2: Generate new content ideas
    content_ideas = generate_content_ideas(top_content)
    
    # Step 3: Create content with AI assistance
    for idea in content_ideas:
        content = generate_ai_content(idea)
        review_and_approve(content)
        
        # Step 4: Schedule across platforms
        schedule_social_media_post(content, platforms=["twitter", "linkedin", "facebook"])
        
    # Step 5: Set up performance tracking
    setup_analytics_tracking(content_ideas)
```

### Finance

**Example**: Automated Financial Research
- **APIs Used**: Financial Data API + News API + AI Analysis API
- **Workflow**:
  1. Retrieve financial data for target companies
  2. Collect recent news and analyst reports
  3. Generate AI analysis of financial health and outlook
  4. Compile into research report

```python
# Simplified example of financial research automation
def financial_research(ticker_symbols):
    reports = []
    
    for ticker in ticker_symbols:
        # Step 1: Get financial data
        financial_data = get_financial_data(ticker)
        
        # Step 2: Get recent news
        news = get_company_news(ticker, days=30)
        
        # Step 3: Generate AI analysis
        analysis_context = f"""
        Ticker: {ticker}
        Financial Data: {financial_data}
        Recent News: {news}
        """
        
        analysis = generate_financial_analysis(analysis_context)
        
        # Step 4: Compile report
        report = {
            "ticker": ticker,
            "financial_data": financial_data,
            "news_summary": summarize_news(news),
            "ai_analysis": analysis
        }
        
        reports.append(report)
    
    return compile_research_report(reports)
```

### Education

**Example**: Personalized Learning Assistant
- **APIs Used**: Learning Management System API + AI API + Content Repository API
- **Workflow**:
  1. Analyze student performance and learning style
  2. Identify knowledge gaps and areas for improvement
  3. Generate personalized learning materials
  4. Track progress and adjust recommendations

```python
# Simplified example of personalized learning assistant
def personalized_learning(student_id):
    # Step 1: Get student data
    student_data = get_student_profile(student_id)
    performance = get_student_performance(student_id)
    
    # Step 2: Identify knowledge gaps
    knowledge_gaps = analyze_performance_gaps(performance)
    
    # Step 3: Generate personalized materials
    learning_style = student_data["learning_style"]
    
    for gap in knowledge_gaps:
        # Find relevant content
        content = find_learning_content(gap["topic"])
        
        # Adapt to learning style with AI
        personalized_content = adapt_to_learning_style(content, learning_style)
        
        # Assign to student
        assign_content_to_student(student_id, personalized_content)
    
    # Step 4: Set up progress tracking
    setup_progress_monitoring(student_id, knowledge_gaps)
```

## Future Trends in API Usage

The API landscape continues to evolve rapidly. Here are some emerging trends to watch:

### 1. AI-First APIs

APIs are increasingly incorporating AI capabilities directly:
- **Multimodal APIs**: Processing text, images, audio, and video together
- **Reasoning APIs**: Specialized for complex problem-solving
- **Domain-Specific AI**: APIs tailored for specific industries or use cases

### 2. Low-Code/No-Code Integration

APIs are becoming more accessible to non-developers:
- **Visual API Builders**: Drag-and-drop interfaces for API workflows
- **Natural Language API Interfaces**: Describing what you want in plain language
- **AI-Assisted Integration**: AI helping to connect and configure APIs

### 3. Real-Time and Event-Driven APIs

APIs are moving beyond request-response patterns:
- **WebSockets and Server-Sent Events**: For real-time data streaming
- **Event-Driven Architecture**: APIs that trigger based on events
- **Reactive APIs**: Responding to changes automatically

### 4. API Ecosystems

APIs are forming interconnected ecosystems:
- **API Marketplaces**: One-stop shops for discovering and connecting APIs
- **Composable APIs**: Building blocks that work seamlessly together
- **Industry-Specific API Standards**: Common formats for specific sectors

### 5. Enhanced Security and Privacy

API security is becoming more sophisticated:
- **Zero Trust Architecture**: Verifying every request regardless of source
- **Privacy-Preserving APIs**: Minimizing data exposure
- **Decentralized Identity**: New approaches to authentication

## Exercise: Planning an API Integration for Your Work

### Activity: API Integration Planning Worksheet

Think about your current work and how APIs might enhance your productivity or capabilities. Complete the following worksheet:

1. **Current Process to Improve**:
   - What manual or time-consuming process could be automated?
   - What information do you frequently need to access?
   - What tasks require combining data from multiple sources?

2. **Potential API Solutions**:
   - What APIs could help with this process?
   - What data or functionality would you need from these APIs?
   - How would these APIs work together?

3. **Integration Sketch**:
   - Draw a simple flowchart of how the integration would work
   - Identify the key steps in the process
   - Note where data needs to be transformed or processed

4. **Implementation Considerations**:
   - What technical resources would you need?
   - What security or privacy concerns exist?
   - How would you measure the success of this integration?

5. **Next Steps**:
   - What small, initial integration could you start with?
   - Who would need to be involved?
   - What timeline would be realistic?

### Example Completed Worksheet

**Current Process to Improve**:
- Manually collecting competitor pricing information
- Spending hours searching websites and recording prices
- Compiling data into spreadsheets for analysis

**Potential API Solutions**:
- Web Scraping API to collect pricing data
- Spreadsheet API to store and organize data
- AI API to analyze pricing trends and strategies

**Integration Sketch**:
```
[Web Scraping API] → Collect competitor prices
        ↓
[Data Processing] → Clean and structure data
        ↓
[Spreadsheet API] → Store in organized format
        ↓
[AI API] → Analyze pricing strategies
        ↓
[Notification API] → Alert on significant changes
```

**Implementation Considerations**:
- Need developer help for initial setup
- Must ensure compliance with terms of service for websites
- Success measured by time saved and pricing insights gained

**Next Steps**:
- Start with scraping one competitor's website
- Involve IT for security review and developer resources
- Implement basic version within 4 weeks

## Key Takeaways from Module 7

- APIs can be integrated with existing tools to enhance their capabilities
- Combining multiple APIs creates powerful workflows that automate complex tasks
- Real-world applications of APIs span across industries from healthcare to education
- Future trends point toward AI-first APIs and low-code integration
- Planning API integrations starts with identifying manual processes that could be automated
- Even small API integrations can deliver significant productivity improvements

Congratulations on completing the final module of this course! You now have a solid understanding of APIs, from fundamental concepts to practical applications. The next step is to apply this knowledge to your specific needs and start exploring how APIs can transform your work.
