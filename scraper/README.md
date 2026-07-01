# Udyam Registration Scraper

A production-quality web scraping module built with Node.js and Puppeteer to extract the UI schema of the Udyam Registration Portal. The extracted data is designed to be highly structured and modular, suitable for dynamically rendering the form in a React application.

## Prerequisites
- Node.js (v18 or higher recommended)
- NPM

## How to Install
1. Navigate to the `scraper/` directory.
2. Run the following command to install dependencies:
   ```bash
   npm install
   ```

## How to Run
Execute the following command to start the scraping process:
```bash
node src/index.js
```
The script will launch a headless Chromium browser, navigate to the portal, wait for all network requests to finish (`networkidle2`), wait an additional 3 seconds for client-side rendering, and begin extraction.

## Folder Structure
```text
scraper/
├── package.json
├── README.md
├── src/
│   ├── index.js                # Main orchestrator
│   ├── browser.js              # Puppeteer setup and teardown
│   ├── extractStructure.js     # Extracts hierarchical UI containers
│   ├── extractFields.js        # Extracts all form fields and labels
│   ├── extractButtons.js       # Extracts buttons and actions
│   ├── extractValidators.js    # Extracts ASP.NET WebForms validators
│   ├── extractScripts.js       # Extracts scripts (OTP/PAN logic)
│   └── saveSchema.js           # Saves extracted JSON schema and HTML
└── output/                     # Generated on run
    ├── page.html               # Raw DOM HTML
    ├── schema.json             # Combined structured JSON schema
    ├── scripts.json            # Categorized script contents
    └── validators.json         # Extracted form validators
```

## Output Format
The `schema.json` is highly structured and contains the following sections:
- **`metadata`**: Page title, URL, timestamp, and total forms.
- **`steps`**: Nested JSON representing the UI structure (`section`, `container`, `card`, etc.).
- **`fields`**: Form fields (`input`, `select`, etc.) mapped with their associated labels, standard attributes, ASP.NET validation attributes (`data-val`), and linked validator IDs.
- **`buttons`**: All interactive buttons with their onclick events.
- **`validators`**: ASP.NET WebForms client-side validation logic parsed from DOM and `Page_Validators`.
- **`scripts`**: Extracted inline and external scripts categorized into `otp`, `pan`, `validation`, and `postback`.
- **`events`**: Extracted global events like `onclick`, `onchange`.

## Limitations
- **Step 2 (PAN Validation) Navigation**: The Udyam portal uses server-side postbacks requiring a valid Aadhaar number and OTP verification to transition from Step 1 to Step 2. Without real credentials, it is impossible to fully navigate to Step 2 automatically. The scraper attempts to detect if Step 2 elements are pre-rendered (hidden) in the DOM, but typically a server-side postback is required.
- **Dynamic Postbacks**: ASP.NET dynamically loads panels via `__doPostBack`. Elements loaded via AJAX after the initial load are not captured unless triggered.

## Future Improvements
- Implement automated filling of test credentials to trigger postbacks if a test environment is available.
- Intercept and mock network requests to simulate successful OTP validation.
- Translate extracted ASP.NET validation expressions directly into React Hook Form or Yup validation schemas.
