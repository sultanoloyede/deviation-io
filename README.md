# Deviation.io - NBA Props Prediction App

A Next.js application for NBA player props predictions with real-time data and confidence scoring.

## Features

- 🏀 NBA player props predictions
- 📊 Confidence scoring for each prediction
- 🔍 Filter by player name and minimum confidence
- 📈 Statistical analysis and insights
- ⚡ Real-time data from Neon PostgreSQL database
- 🎨 Modern UI with Tailwind CSS and Radix UI

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI Components

**Backend:**
- Netlify Serverless Functions
- PostgreSQL (Neon Database)
- Node.js

**Deployment:**
- GitHub (Version Control)
- Netlify (Hosting & Functions)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Neon Database account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/deviation-io.git
cd deviation-io
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Neon database URL:
```
NEON_DATABASE_URL=your_database_url_here
NEXT_PUBLIC_API_URL=/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Development with Netlify Functions

To test with Netlify Functions locally:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Run local development server with functions
netlify dev
```

## Project Structure

```
deviation-io/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── props-table.tsx   # Props data table
│   ├── props-filter.tsx  # Filter controls
│   ├── props-stats.tsx   # Statistics display
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
│   ├── api.ts            # API client functions
│   └── utils.ts          # Helper utilities
├── netlify/
│   └── functions/        # Serverless API functions
│       ├── db.ts         # Database connection
│       ├── props.ts      # GET /api/props
│       ├── props-by-id.ts # GET /api/props/:id
│       └── stats.ts      # GET /api/props/stats
├── types/                # TypeScript definitions
├── public/               # Static assets
├── netlify.toml          # Netlify configuration
└── package.json          # Dependencies
```

## API Endpoints

### Get All Props
```
GET /api/props
Query Parameters:
  - limit: number (default: 100)
  - min_confidence: number (default: 0)
  - player: string (search by name)
```

### Get Single Prop
```
GET /api/props/:id
```

### Get Statistics
```
GET /api/props/stats
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to GitHub and Netlify.

Quick deploy:
```bash
git push origin main
```

Netlify will automatically build and deploy your changes.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEON_DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL (use `/api` for production) | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

Built with ❤️ using Next.js and Netlify
