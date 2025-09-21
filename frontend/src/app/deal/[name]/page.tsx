import { notFound } from "next/navigation";
import Image from "next/image";
import { getCompaniesData } from "../../../../lib/bigquery";
import { Company } from "../../../../types/company";
import Header from "../../components/Header";
import { 
  Shield, 
  Flag, 
  Info, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Target, 
  LogOut,
  DollarSign,
  PieChart,
  Users
} from "lucide-react";

export const metadata = {
  title: 'LVXQuantumLeapAI - Company Details',
  description: 'Detailed company analysis and investment insights',
};

interface CompanyPageProps {
  params: {
    name: string;
  };
}

// Static sample companies data
const staticCompaniesData: Company[] = [
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
    LogoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI",
    Risk1: "Market competition from established players",
    Risk2: "Regulatory changes in fintech sector",
    DealNotes: "Strong performance metrics with consistent growth trajectory. Team has proven execution capabilities.",
    InvestmentRecommendation: "INVEST",
    ExitStrategy: "IPO target in 3-5 years with potential acquisition opportunities"
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
    LogoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI",
    Risk1: "High customer acquisition costs",
    Risk2: "Competition from established RPA vendors",
    DealNotes: "Exceptional technical team with strong market validation",
    InvestmentRecommendation: "STRONG BUY",
    ExitStrategy: "Strategic acquisition by enterprise software leader"
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
    LogoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI",
    Risk1: "Regulatory changes in energy sector",
    Risk2: "High capital requirements for scaling",
    DealNotes: "Market leader in sustainable energy solutions with proven track record",
    InvestmentRecommendation: "BUY",
    ExitStrategy: "IPO ready with strong financials and market position"
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

// Generate static paths for all companies from database
export async function generateStaticParams() {
  try {
    const companies = await getCompaniesData();
    return companies.map((company) => ({
      name: createCompanySlug(company.CompanyName),
    }));
  } catch (error) {
    console.error('Error fetching companies for static generation:', error);
    // Fallback to empty array if database is not available during build
    return [];
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const slugOrName = params.name;
  let companies: Company[] = [];
  let company: Company | null = null;

  try {
    companies = await getCompaniesData();
    
    // First try to find by exact name match
    company = companies.find((c: Company) => 
      c.CompanyName === slugOrName || 
      c.CompanyName?.toLowerCase() === slugOrName.toLowerCase()
    ) || null;
    
    // If not found, try to find by slug match
    if (!company) {
      company = companies.find((c: Company) => 
        createCompanySlug(c.CompanyName || '') === slugOrName.toLowerCase()
      ) || null;
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
    // Fallback to static data if database is not available
    const staticCompanies = staticCompaniesData;
    company = staticCompanies.find((c: Company) => 
      createCompanySlug(c.CompanyName || '') === slugOrName.toLowerCase()
    ) || null;
  }
    company = companies.find((c: Company) => 
      c.CompanyName === slugOrName || 
      c.CompanyName?.toLowerCase() === slugOrName.toLowerCase()
    ) || null;
    
  // If not found, try to find by slug match
  if (!company) {
    company = companies.find((c: Company) => 
      createCompanySlug(c.CompanyName || '') === slugOrName.toLowerCase()
    ) || null;
  }

  if (!company) {
    notFound();
  }  // Helper function to format currency
  const formatCurrency = (value: number | undefined | null) => {
    if (!value || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to format numbers
  const formatNumber = (value: number | undefined | null) => {
    if (!value || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Helper function to format percentage
  const formatPercentage = (value: number | undefined | null) => {
    if (!value || isNaN(value)) return 'N/A';
    return `${value}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="p-4 space-y-6 pb-24">
        {/* Company Header */}
        <div className="flex items-center space-x-4">
          <Image 
            alt={`${company.CompanyName} Logo`} 
            className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" 
            src={company.LogoURL || "https://placehold.co/64x64"}
            width={64}
            height={64}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{company.CompanyName}</h2>
            <p className="text-md text-gray-600 dark:text-gray-400">{company.WhatCompanyDoes}</p>
          </div>
        </div>

        {/* Risk Intelligence */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <Shield className="mr-2 text-red-500" size={20} />
            Risk Intelligence
          </h3>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="space-y-4">
              {company.Risk1 && (
                <div className="flex items-center">
                  <Flag className="text-red-500 mr-3" size={16} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Risk 1 Title</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{company.Risk1}</p>
                  </div>
                  <button className="ml-auto text-blue-600 text-sm font-medium">XAI</button>
                </div>
              )}
              {company.Risk2 && (
                <div className="flex items-center">
                  <Info className="text-yellow-500 mr-3" size={16} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Risk 2 Title</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{company.Risk2}</p>
                  </div>
                  <button className="ml-auto text-blue-600 text-sm font-medium">XAI</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Structured Data */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <BarChart3 className="mr-2 text-blue-600" size={20} />
            Overview
          </h3>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valuation</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(company.Valuation)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                <p className="text-lg font-semibold text-green-600">{formatPercentage(company.GrowthRate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Industry</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{company.Industry || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Funding Stage</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{company.FundingStage || 'Early Stage'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <FileText className="mr-2 text-blue-600" size={24} />
            Investor Deal Notes
          </h2>
          <div className="space-y-3">
            <p className="text-gray-900 dark:text-gray-100">{company.DealNotes || "Strong performance metrics with consistent growth trajectory. Team has proven execution capabilities."}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <TrendingUp className="mr-2 text-green-600" size={24} />
            Investment Recommendation
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-900 dark:text-gray-100">Recommendation</span>
              <span className="font-semibold text-green-600">{company.InvestmentRecommendation || "INVEST"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900 dark:text-gray-100">Confidence Level</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">High</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900 dark:text-gray-100">Risk Assessment</span>
              <span className="font-semibold text-yellow-600">Medium</span>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <DollarSign className="mr-2 text-green-600" size={24} />
            Financial Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Monthly Recurring Revenue (MRR)</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(company.MRR)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Annual Recurring Revenue (ARR)</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(company.ARR)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Projected ARR</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(company.ProjectedARRYear)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Funding Ask</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(company.Ask)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Gross Margin</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPercentage(company.GrossMargin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Burn Rate</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(company.BurnRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Runway (months)</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatNumber(company.Runway)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <PieChart className="mr-2 text-blue-600" size={24} />
            Market Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(company.TAM)}</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">Total Addressable Market</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(company.SAM)}</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">Serviceable Addressable Market</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(company.SOM)}</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">Serviceable Obtainable Market</div>
            </div>
          </div>
          {company.TargetGeographies && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Target Geographies</h4>
              <p className="text-gray-900 dark:text-gray-100">{company.TargetGeographies}</p>
            </div>
          )}
        </div>

        {/* Traction & Additional Info */}
        {(company.Traction || company.UnitEconomics || company.Competitors) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
              <Users className="mr-2 text-purple-600" size={24} />
              Additional Information
            </h2>
            <div className="space-y-4">
              {company.Traction && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Traction</h4>
                  <p className="text-gray-900 dark:text-gray-100">{company.Traction}</p>
                </div>
              )}
              {company.UnitEconomics && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Unit Economics</h4>
                  <p className="text-gray-900 dark:text-gray-100">{company.UnitEconomics}</p>
                </div>
              )}
              {company.Competitors && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Competitors</h4>
                  <p className="text-gray-900 dark:text-gray-100">{company.Competitors}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Benchmarks & Competition */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <Target className="mr-2 text-blue-600" size={24} />
            Benchmarks & Competition
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">ARR Growth vs. Sector</h4>
              {/* Placeholder for dynamic benchmark rendering */}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Key Competitors</h4>
              <p className="text-gray-900 dark:text-gray-100">{company.Competitors || 'No competitor information available.'}</p>
            </div>
          </div>
        </div>

        {/* Exit Strategy Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <LogOut className="mr-2 text-blue-600" size={24} />
            Exit Strategy Analysis
          </h2>
          <div className="space-y-3">
            <p className="text-gray-900 dark:text-gray-100">{company.ExitStrategy || 'No exit strategy analysis available.'}</p>
          </div>
        </div>


      </main>
    </div>
  );
}