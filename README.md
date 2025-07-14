FinnanceAPP

Personal Finance App built with shadcn/ui to help you manage and track all your personal expenses, bills, properties, vehicles, and payment schedules in one place.

🚀 Features

Service Tracking: Add and monitor recurring services (billed monthly or annually), such as subscriptions, utilities, and memberships.

Properties Management: Create entries for each property (home, villa, etc.) and assign bills or services to specific properties.

Vehicle Management: Track taxes, services, and maintenance costs for each vehicle you own.

Payment Calendar: View all upcoming payments in an interactive calendar to stay on top of due dates.

Responsive UI: Sleek, modern interface powered by shadcn/ui, fully responsive for desktop and mobile.

Transaction Management: Add, edit, delete and duplicate entries. Import or export transactions as CSV or Excel files and attach receipts.

🛠️ Tech Stack

Framework: React

UI Library: shadcn/ui (Tailwind CSS-based components)

State Management: Zustand or Context API

Data Storage: LocalStorage (for MVP) / SQLite or Postgres (for future expansion)

Calendar: FullCalendar or React Calendar integration

💾 Installation

Clone the repo

git clone https://github.com/your-username/finnanceapp.git
cd finnanceapp

Install dependencies

npm install
# or
yarn install

Set up shadcn/ui

npx shadcn-ui init

Run the development server

npm run dev
# or
yarn dev

Your app should now be running at http://localhost:3000.

⚙️ Usage

Add Services: Navigate to the Services page, click Add Service, fill in name, amount, billing frequency (monthly/annually), and assign to a property or general.

Manage Properties: Go to Properties, click New Property, enter details (name, address), and link bills or services.

Track Vehicles: Under Vehicles, add each vehicle and log taxes, service appointments, maintenance costs.

View Calendar: Open the Calendar view to see payment due dates and filter by category (Services, Properties, Vehicles).

🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m "feat: Add new feature")

Push to the branch (git push origin feature/YourFeature)

Open a Pull Request

📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

Keep your finances in check and never miss a bill!
