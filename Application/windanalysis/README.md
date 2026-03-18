
# Wind Analysis Application

## Project Structure

```
REintAI/
│
├── analysis/
│   ├── Wind Power Dependablity Analysis/
│   │   └── wind_dependability.ipynb
│   └── Wind Power Forecast Error Analysis/
│       └── wind_forecast_error_analysis.ipynb
│
└── Application/
	 └── windanalysis/
		  ├── package.json, tsconfig.json, next.config.ts, etc.
		  ├── public/           # Static assets (SVGs, images)
		  ├── src/
		  │   ├── app/
		  │   │   ├── layout.tsx, page.tsx, globals.css
		  │   │   └── api/
		  │   │       ├── actuals/route.ts
		  │   │       └── forecasts/route.ts
		  │   └── components/
		  │       ├── dashboard.tsx, header.tsx
		  │       └── ui/
		  │           ├── chart.tsx, controls.tsx
		  └── ...other config files
```

## How to Start the Application

1. Navigate to the application directory:
	```bash
	cd Application/windanalysis
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Start the development server:
	```bash
	npm run dev
	```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is deployed at:

**[Deployment Link (Vercel/Heroku) - Placeholder]**

Replace this with your actual deployment URL when available.
