# Eisenhower Agile

Eisenhower Agile is a modern task management application designed to help you prioritize your work using the proven Eisenhower Matrix method. By categorizing tasks based on urgency and importance, you can focus on what truly matters, delegate effectively, and eliminate time-wasting activities. The application is enhanced with AI-powered suggestions to streamline your workflow.

## Table of Contents

- [Live Application](#live-application)
- [Key Features](#key-features)
  - [Landing Page](#landing-page)
  - [Eisenhower Matrix Task Management](#eisenhower-matrix-task-management)
  - [AI-Powered Quadrant Suggestion](#ai-powered-quadrant-suggestion)
  - [Settings & Personalization](#settings--personalization)
  - [Data Persistence](#data-persistence)
- [Branding & Styling](#branding--styling)
  - [Logo & Name](#logo--name)
  - [Color Palette](#color-palette)
  - [Typography](#typography)
- [Technical Overview](#technical-overview)
  - [Core Technologies](#core-technologies)

## Key Features

### Landing Page

A clean and professional landing page that introduces the application's purpose and features. It provides a clear call-to-action for users to get started.

### Eisenhower Matrix Task Management

The core of the application is a visual, interactive Eisenhower Matrix.

- **Four Quadrants**: Tasks are organized into "Do", "Schedule", "Delegate", and "Eliminate" quadrants.
- **CRUD Operations**: Full support for creating, reading, updating, and deleting tasks through an intuitive dialog.
- **Drag & Drop**: Seamlessly move tasks between quadrants to re-prioritize on the fly.
- **Task Completion**: Mark tasks as complete, which visually grays them out while keeping them in place for reference.
- **Mock Data**: The application is pre-populated with sample tasks to demonstrate its functionality immediately.

### AI-Powered Quadrant Suggestion

To assist with prioritization, the app leverages Generative AI to suggest the most appropriate quadrant for a task.

- **AI Assistant**: When creating or editing a task, an AI assistant can analyze the task description.
- **Intelligent Suggestions**: Based on the description, the AI suggests a quadrant and provides its reasoning, helping you make informed decisions.
- **Genkit Integration**: The AI functionality is powered by Google's Genkit, using the Gemini model by default.

### Settings & Personalization

A dedicated settings page allows users to customize their experience.

- **Theme Switching**: Instantly switch between a light and a dark theme. The selected theme is persisted across sessions.
- **AI Provider Configuration**: Users can switch from the default Gemini provider to other services like OpenAI, Anthropic, DeepSeek, or OpenRouter by providing their own API key.

### Data Persistence

User data is stored locally in the browser to ensure a seamless experience between sessions.

- **Tasks**: All tasks and their statuses are saved in `localStorage`.
- **Settings**: Theme preferences and AI provider configurations are also persisted in `localStorage`.

## Branding & Styling

The application's design is modern, clean, and focused on user experience.

- **Name**: **Eisenhower Agile** combines the classic productivity method with a modern, flexible approach.
- **Tagline**: "Focus on what truly matters."
- **Color Palette**: The UI uses a theming system based on HSL CSS variables. The primary color is a soft, encouraging yellow, with distinct colors for each quadrant (Green, Blue, Orange, Red) to provide clear visual cues.
- **Typography**:
  - **Headlines**: `Space Grotesk` for a modern, tech-savvy feel.
  - **Body Text**: `PT Sans` for excellent readability and a professional look.
- **UI Components**: Built with the sleek and accessible **ShadCN UI** component library.
- **Layout**: The interface is responsive and designed to work beautifully on both desktop and mobile devices.

## Technical Overview

### Core Technologies

- **Framework**: Angular (version 20 latest)
- **Language**: TypeScript
- **Styling**: Tailwind CSS version 4 with CSS Variables for theming.
- **UI Components**: DaisyUI
- **Generative AI**: Genkit (with Google Gemini as the default model)
- **Icons**: @ng-icons/lucide or @ng-icons/heroicons, lightweight icons.

