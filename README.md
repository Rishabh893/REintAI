
# Wind Analysis Application

## Project Structure

```
REintAI/
├── .git/
├── README.md
├── analysis/
│   ├── Wind Power Dependablity Analysis/
│   │   └── wind_dependability.ipynb
│   └── Wind Power Forecast Error Analysis/
│       └── wind_forecast_error_analysis.ipynb
└── Application/
	└── windanalysis/
		├── .gitignore
		├── .next/
		├── eslint.config.mjs
		├── next-env.d.ts
		├── next.config.ts
		├── node_modules/
		├── package-lock.json
		├── package.json
		├── postcss.config.mjs
		├── tsconfig.json
		├── public/
		│   ├── file.svg
		│   ├── globe.svg
		│   ├── next.svg
		│   ├── vercel.svg
		│   └── window.svg
		└── src/
			├── app/
			│   ├── favicon.ico
			│   ├── globals.css
			│   ├── layout.tsx
			│   ├── page.tsx
			│   └── api/
			│       ├── actuals/
			│       │   └── route.ts
			│       └── forecasts/
			│           └── route.ts
			└── components/
				├── dashboard.tsx
				├── header.tsx
				└── ui/
					├── chart.tsx
					└── controls.tsx
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

**[reintai.vercel.app](http://reintai.vercel.app)**
