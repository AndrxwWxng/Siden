# Siden - AI Agent Orchestration Platform with Next.js & Supabase

<div align="center">
  <h1>
    <img src="https://img.shields.io/badge/Siden-AI%20Platform-blue?style=for-the-badge&logo=robot&logoColor=white" alt="Siden AI Platform"/>
  </h1>
  
  <p>
    <strong>Empowering Teams with Intelligent AI Agent Orchestration</strong>
  </p>

  <p>
    <em>A modern, full-stack platform that seamlessly integrates AI agents with Next.js and Supabase for enhanced productivity and automation.</em>
  </p>

  <div>
    <a href="https://siden.ai">
      <img src="https://img.shields.io/badge/Website-siden.ai-blue?style=for-the-badge&logo=globe&logoColor=white" alt="Website"/>
    </a>
    <img src="https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Supabase-2.0-green?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
    <img src="https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
  </div>

  <br/>
</div>

> A modern, full-stack application template with Next.js 13, Supabase, and TypeScript. Visit [siden.ai](https://siden.ai) for more information.

This project integrates Next.js with Supabase for authentication, user profiles, settings, and project management.

## Table of Contents

- [Features](#features)
- [Agents](#agents)
- [Recent Fixes](#recent-fixes)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Authentication
- User signup and signin
- Password reset flow
- Email verification
- Persistent sessions across tabs
- Protected routes

### User Profiles
- Custom usernames
- Profile pictures (with upload)
- Personal websites and metadata

### User Settings
- Theme preferences
- Email notification preferences

### Projects
- Create, read, update, delete operations
- Project filtering and searching
- Project permissions based on ownership


### Available Agents

| Agent | Description | Key Features |
|-------|-------------|--------------|
| 🔍 **Research Agent** | Web search and information gathering | • Serper API Integration<br>• OpenAI Enhancement<br>• Citation Support<br>• Result Analysis |
| 💻 **Code Agent** | Development and coding assistance | • Code Generation<br>• Documentation<br>• Debug Support<br>• Multi-language Support |
| ✍️ **Writing Agent** | Content creation and editing | • Technical Writing<br>• Email Assistance<br>• Style Guidance<br>• Content Generation |
| 📊 **Analysis Agent** | Data processing and insights | • Data Analysis<br>• Report Generation<br>• Decision Support<br>• Visualization Tips |

### Agent Capabilities

<details>
<summary>🔍 Research Agent</summary>

- **Search Integration**
  - Web search via Serper API
  - Result filtering and ranking
  - Source verification

- **Analysis Features**
  - Content summarization
  - Key point extraction
  - Citation generation

- **AI Enhancement**
  - OpenAI integration
  - Context understanding
  - Relevance scoring
</details>

<details>
<summary>💻 Code Agent</summary>

- **Development Support**
  - Code generation
  - Bug fixing
  - Refactoring suggestions

- **Documentation**
  - Code documentation
  - API documentation
  - Usage examples

- **Language Support**
  - JavaScript/TypeScript
  - Python
  - SQL
  - And more...
</details>

<details>
<summary>✍️ Writing Agent</summary>

- **Content Creation**
  - Technical documentation
  - Blog posts
  - Email composition

- **Editing Support**
  - Grammar checking
  - Style suggestions
  - Format optimization

- **Specialized Writing**
  - API documentation
  - User guides
  - Technical specifications
</details>

<details>
<summary>📊 Analysis Agent</summary>

- **Data Processing**
  - Data cleaning
  - Pattern recognition
  - Trend analysis

- **Reporting**
  - Insight generation
  - Report creation
  - Visualization suggestions

- **Decision Support**
  - Data-driven recommendations
  - Risk assessment
  - Option analysis
</details>

## Recent Fixes

1. **Authentication Persistence**: Sessions now persist across tabs and refreshes
2. **Project Fetching Errors**: Fixed error handling in project service
3. **Improved Auth Callback Handling**: Better error handling and user onboarding
4. **Route Protection**: Middleware now properly protects dashboard routes
5. **Enhanced User Experience**: Added loading states and better error messages

## Getting Started

### 1. Database Setup

Run the SQL commands in `src/db/schema.sql` in your Supabase SQL Editor to create:
- Profiles table
- Projects table
- User settings table
- Required RLS policies
- Auto-creation triggers for new users

### 2. Storage Configuration

Follow the instructions in `src/storage-setup.md` to:
- Create an 'avatars' bucket
- Set up RLS policies for the bucket
- Configure access controls

### 3. Environment Variables

Ensure your Supabase URL and Anon Key are properly configured in `src/utils/supabase/config.ts`.

For local development, you can also use a `.env.local` file:

```env
E2B_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
SERPER_API_KEY=
SLACK_BOT_TOKEN=

# Supabase Auth configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Remove Clerk Auth keys to avoid conflicts with Supabase Auth
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=
```

## Features

### Authentication

- User signup and signin
- Password reset flow
- Email verification
- Persistent sessions across tabs
- Protected routes

### User Profiles

- Custom usernames
- Profile pictures (with upload)
- Personal websites and metadata

### User Settings

- Theme preferences
- Email notification preferences

### Projects

- Create, read, update, delete operations
- Project filtering and searching
- Project permissions based on ownership

## Usage

The authentication flow is now seamless:

1. **Sign Up**: Creates a new user and automatically creates profile/settings
2. **Sign In**: Persists session across tabs and page refreshes
3. **Account Management**: Update profile, avatar, and settings
4. **Project Management**: Create and manage projects with proper permissions

## Key Files

- `src/utils/supabase/client.ts` - Client-side Supabase client
- `src/utils/supabase/server.ts` - Server-side Supabase client
- `src/utils/supabase/middleware.ts` - Session refresh middleware
- `src/middleware.ts` - Route protection and auth redirects
- `src/services/userService.ts` - User profile and settings operations
- `src/services/projectService.ts` - Project CRUD operations
- `src/app/auth/callback/route.ts` - Auth callback handler for OAuth/email verification
- `src/app/dashboard/account/page.tsx` - Account settings page
- `src/app/dashboard/settings/page.tsx` - User settings page
- `src/app/signin/page.tsx` and `src/app/signup/page.tsx` - Auth pages

## Troubleshooting

### Authentication Issues
1. Check browser console for errors
2. Verify your Supabase project URL and anon key are correct
3. Ensure SQL migrations have been applied correctly
4. Clear cookies and local storage if testing auth flows
5. Check Supabase authentication logs in the dashboard

### Project-related Errors
1. Verify RLS policies are correctly set up
2. Check that the user has appropriate permissions
3. Confirm the database tables exist with correct schema
4. Review Supabase database logs for query errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

