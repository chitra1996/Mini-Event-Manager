# Take-Home Assignment: Mini Event Manager

## Goal

Build a minimal Event Manager using Next.js (App Router), React, TypeScript, and GraphQL. The app should allow users to:

- View a list of events
- Create a new event
- View event details (including attendees)
- Add/remove attendees

## Requirements

### 1. Backend (GraphQL)

- Use a mock GraphQL API (Apollo Server, or similar) with an in-memory for storage.
- You are responsible for designing the GraphQL schema (types, queries, mutations) needed to support the required features.

### 2. Frontend (Next.js)

- Pages:
  - /events — List all events
  - /events/new — Form to create a event
  - /events/[id] — Event details, attendee management
- Features:
  - List events with title, date, and attendee count
  - Create event (title and date required)
  - View event details (show attendees)
  - Add attendee (name and email, email optional)
  - Remove attendee
- Tech:
  - TypeScript everywhere
  - Use Apollo Client or React Query for data fetching
  - Use React hooks and functional components
  - Minimal styling (TailwindCSS preferred)
  - Use Formik for forms
  - Use Zustand for state management (if needed)
  - Use Zod or Yup for validation (if needed)
  - Use Headless UI for any UI components (modals, dialogs, etc.) (if needed)

### 3. Entity Relationship Design

In addition to the working app, provide a short document (ENTITIES.md) where you
describe a realistic data model for the following relationships:

- Users can create and manage events (create, view, update, delete)
- Attendees can attend events, but they are not Users
- Each Event can have one or more Tags (e.g. “Internal”, “Public”, “Team Offsite”)
- Attendees may attend multiple events, and their RSVP status should be tracked

What to include:

- Entity names
- Attributes for each entity
- Types of each attribute (e.g., string, number, date, reference)
- Any "join" entities if neede
- Any constraints or unique identifiers
- Any indexes or performance considerations
- Any assumptions made about the data model

For example:

```markdown
# Entities

Dog

- name: string
- age: number (age of the dog in years)
- ownerId: string (ID of the owner, references User)

User

- name: string
- email: string (unique email address)
```

### 4. Bonus (Optional)

This is ONLY if you have extra time after completing the main features. It is preferred that you spend extra time on ensuring the code is maintainable and organized and rather than implementing these features.

- Form validation when creating events and adding attendees
- Optimistic UI for attendee add/remove
- Responsive design
- Provide a Dockerfile for the app

### 4. Deliverables

- GitHub repo (public link) or zip file (delete the .git and node_modules directories if zipping)
  - Source code for the Next.js app
  - Source code for the GraphQL server
  - Any additional scripts or configuration files needed to run the app
  - ENTITIES.md with the data model design
  - SETUP.md with setup instructions and running instructions
  - NOTES.md with any assumptions made and any known issues

### 5. Time Expectation

The core assignment should take around 5–6 hours. Please prioritize functionality and clarity. Don’t worry about perfect CSS or scalability. You’ll have 3 days to complete it, but if you need a bit more time just let me know.

## What We’re Looking For

This assignment is meant to give us a signal on how you think and structure projects. It’s not about perfection.

> **The goal is not only to make it work, but to write code that is clear, maintainable, and easy for others to understand and build upon.**

We’re focusing on:

- That the core features work as described
- Clear, maintainable code structure and logical file organization (e.g., pretend this project will be worked on by multiple people and will grow over time)
- Good use of TypeScript features (types, interfaces, generics) (e.g., no `any` types)
- Thoughtful naming of variables, types, and components
- A clean, extensible GraphQL schema
- A well-reasoned and understandable ENTITIES.md file

We’re not focusing on:

- Handling millions of users
- Pixel-perfect UI
- Advanced animations, spinners, or transitions
- Using every optional tech (Zustand, Headless UI, etc.) unless helpful

## Use of AI Tools

You’re welcome to use AI tools like ChatGPT, Copilot, or similar. Note, On the job you will be able to use services such as ChatGPT and Gemini. You may also be able to use AI code editors such as Cursor and Windsurf, though it's not a guarantee

That said, we’re still looking to understand how you think and how you’d approach a real-world task, so please make sure your submission reflects your own understanding. Be ready to walk us through your code and decisions in a follow-up conversation if needed.