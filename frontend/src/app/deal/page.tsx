import Link from "next/link";
import Image from "next/image";
import { getCompaniesData } from "../../../lib/bigquery";
import { Company } from "../../../types/company";
import Header from "../components/Header";

export const metadata = {
  title: 'LVXQuantumLeapAI - Companies',
  description: 'Browse all investment opportunities and company profiles',
};

// Static sample data
const staticCompanyData: Company[] = [
  {
    CompanyName: "Multipl Fintech Solutions Pvt LTD (Multipl)",
    WhatCompanyDoes: "A wealthtech platform pioneering 'Spendvesting,' linking India's mutual fund market with its consumption economy.",
    Industry: "Wealthtech",
    Region: "India",
    TeamSize: 50,
    NumberOfFounders: 2,
    FoundersQualification: "IIT/IIM Alumni",
    FundingStage: "Pre-Series A",
    Ask: 250000000,
    Valuation: 1370000000,
    PreviousRounds: "Seed Round ₹5 Cr",
    Traction: "700K+ registered users; 200K+ KYC verified. Assets Under Advisory (AUA): ₹100 Cr live. Target Goals Set: ₹600 Cr+ in active goals.",
    Revenue: 0,
    MRR: 0,
    ARR: 0,
    ProjectedARRYear: 2027,
    GrossMargin: 0.055,
    UnitEconomics: "LTV:CAC Ratio: 20x (₹9,000 LTV vs. ₹450 CAC)",
    BurnRate: 0,
    Runway: 0,
    GrowthRate: 2,
    TAM: 0,
    SAM: 0,
    SOM: 0,
    MarketSize: 0,
    TargetGeographies: "India",
    Competitors: "Groww, Zerodha Coin, ET Money",
    Founders: "Tech and Finance Veterans",
    LogoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI"
  },
  {
    CompanyName: "TechFlow Innovations",
    WhatCompanyDoes: "AI-powered workflow automation for enterprise clients",
    Industry: "Enterprise Software",
    Region: "Bangalore",
    TeamSize: 25,
    NumberOfFounders: 3,
    FoundersQualification: "Former Microsoft, Google employees",
    FundingStage: "Series A",
    Ask: 500000000,
    Valuation: 2000000000,
    PreviousRounds: "Pre-Series A ₹15 Cr",
    Traction: "50+ enterprise clients, ₹5 Cr ARR",
    Revenue: 50000000,
    MRR: 4166667,
    ARR: 50000000,
    ProjectedARRYear: 2026,
    GrossMargin: 0.8,
    UnitEconomics: "Strong unit economics with 80% gross margins",
    BurnRate: 5000000,
    Runway: 24,
    GrowthRate: 150,
    TAM: 10000000000,
    SAM: 2000000000,
    SOM: 200000000,
    MarketSize: 500000000,
    TargetGeographies: "India, Southeast Asia",
    Competitors: "UiPath, Automation Anywhere",
    Founders: "Ex-FAANG team",
    LogoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI"
  },
  {
    CompanyName: "GreenTech Solutions",
    WhatCompanyDoes: "Sustainable energy management systems for smart cities",
    Industry: "CleanTech",
    Region: "Mumbai",
    TeamSize: 40,
    NumberOfFounders: 2,
    FoundersQualification: "MIT/Stanford graduates",
    FundingStage: "Series B",
    Ask: 1000000000,
    Valuation: 5000000000,
    PreviousRounds: "Series A ₹50 Cr",
    Traction: "100+ smart city projects, 25% market share",
    Revenue: 200000000,
    MRR: 16666667,
    ARR: 200000000,
    ProjectedARRYear: 2025,
    GrossMargin: 0.65,
    UnitEconomics: "Positive unit economics with strong margins",
    BurnRate: 15000000,
    Runway: 36,
    GrowthRate: 200,
    TAM: 50000000000,
    SAM: 10000000000,
    SOM: 1000000000,
    MarketSize: 2000000000,
    TargetGeographies: "India, Middle East",
    Competitors: "Schneider Electric, Siemens",
    Founders: "Clean Energy Veterans",
    LogoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI"
  }
];

// Utility function to create URL-friendly slugs
function createCompanySlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export default async function CompaniesPage() {
  // Try to get real data from database first, fallback to static data
  let companies: Company[] = [];
  
  try {
    companies = await getCompaniesData();
  } catch (error) {
    console.error("Failed to fetch companies data:", error);
    // Fallback to static data if database fails
    companies = staticCompanyData;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
{/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{companies.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{new Set(companies.map(c => c.Industry)).size}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Industries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Funding Stages</div>
                </div>
              </div>
            </div>
          </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Deal View</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {companies.length} companies found
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Companies List */}
          <div className="lg:col-span-3">
            {companies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No companies found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((company, index) => (
                  <Link
                    key={index}
                    href={`/deal/${createCompanySlug(company.CompanyName || '')}`}
                    className="block group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Image
                          alt={`${company.CompanyName} logo`}
                          className="w-12 h-12 object-cover rounded-lg"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI"
                        />
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                            {company.CompanyName}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {company.Industry || 'Technology'}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        {company.WhatCompanyDoes || 'Innovative technology company focused on growth.'}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span>Valuation: ${company.Valuation ? (company.Valuation / 1000000).toFixed(1) + 'M' : 'N/A'}</span>
                        <span className="text-green-600 dark:text-green-500">
                          Growth: {company.GrowthRate ? company.GrowthRate + '%' : 'N/A'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Investment Readiness</span>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {company.FundingStage || 'Early Stage'}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((company.GrowthRate || 50) + 20, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
}