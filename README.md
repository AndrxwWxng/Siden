# AI Agent Orchestration System

This project demonstrates a multi-agent system using Mastra.ai for orchestration. The system includes multiple specialized AI agents, each with its own role, that work together under the leadership of a CEO agent.

## Features

- **Multi-agent architecture**: Each agent has a specific role (CEO, Marketing, Developer, Sales, etc.)
- **Persistent memory**: Agents have memory powered by Postgres with pgvector
- **Tool integration**: Agents can use various tools like sending emails, web research, and database access
- **Next.js frontend**: Modern web interface for interacting with agents

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL with pgvector extension (a Supabase instance works well)
- OpenAI API key
- (Optional) Resend API key for email functionality

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_postgres_connection_string_here
RESEND_API_KEY=your_resend_api_key_here
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Check your environment setup:

```bash
npm run check
# or
yarn check
# or
pnpm check
```

4. Initialize the database:

```bash
npm run init-db
# or
yarn init-db
# or
pnpm init-db
```

## Running the Application

You can start both the Next.js frontend and Mastra server with a single command:

```bash
npm run start:all
# or
yarn start:all
# or
pnpm start:all
```

Or run them separately:

```bash
# Start Next.js frontend
npm run dev

# Start Mastra server in a separate terminal
npm run mastra
```

Navigate to `http://localhost:3000/chat` to start interacting with the agents.

## Agent Structure

The system includes the following agents:

- **CEO Agent (Kenard)**: Leads the overall strategy and orchestrates other agents
- **Marketing Agent (Chloe)**: Handles marketing strategies and content
- **Developer Agent (Alex)**: Tackles technical problems and development tasks
- **Sales Agent (Hannah)**: Manages sales processes and customer relationships
- **Product Manager (Mark)**: Oversees product development and roadmaps
- **Finance Advisor (Jenna)**: Provides financial planning and analysis
- **Designer (Maisie)**: Creates UI/UX designs and visual systems
- **Research Analyst (Garek)**: Gathers and analyzes market data

## Architecture

The application uses:

- **Next.js**: Frontend framework
- **Mastra.ai**: Agent orchestration
- **Supabase/PostgreSQL with pgvector**: Vector database for semantic search
- **OpenAI**: LLM provider
- **Tailwind CSS**: Styling

## Adding New Tools

To add new tools for agents, modify the `src/mastra/tools/index.ts` file and create new tool definitions.

## Adding New Agents

To add new agents, update the `src/mastra/agents/index.ts` file and create new agent definitions. Then, update `src/mastra/index.ts` to register the new agents.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
