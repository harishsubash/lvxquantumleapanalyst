
import { notFound } from "next/navigation";
import { getCompaniesData } from "../../../../lib/bigquery";
import { Company } from "../../../../types/company";
import Head from "next/head";

interface CompanyPageProps {
  params: {
    name: string;
  };
}

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

export default async function CompanyPage({ params }: CompanyPageProps) {
  const slugOrName = params.name;
  let companies: Company[] = [];
  let company: any = null;

  try {
    companies = await getCompaniesData();
    
    // First try to find by exact name match
    company = companies.find((c: any) => 
      c.CompanyName === slugOrName || 
      c.CompanyName?.toLowerCase() === slugOrName.toLowerCase()
    );
    
    // If not found, try to find by slug match
    if (!company) {
      company = companies.find((c: any) => 
        createCompanySlug(c.CompanyName || '') === slugOrName.toLowerCase()
      );
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
  }

  if (!company) {
    notFound();
  }
    
  // Helper function to format currency
  const formatCurrency = (value: any) => {
    if (!value || isNaN(value)) return 'N/A';
    // Assuming the template uses USD, format as such.
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
    
  // Helper function to format percentage
  const formatPercentage = (value: any) => {
    if (!value || isNaN(value)) return 'N/A';
    return `${value}%`;
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <title>CogniVenture AI - {company.CompanyName}</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,typography,container-queries" async></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  primary: "#3b82f6",
                  "background-light": "#f3f4f6",
                  "background-dark": "#111827",
                  "card-light": "#ffffff",
                  "card-dark": "#1f2937",
                  "text-light": "#1f2937",
                  "text-dark": "#f9fafb",
                  "text-secondary-light": "#6b7280",
                  "text-secondary-dark": "#9ca3af",
                },
                fontFamily: {
                  sans: ["Inter", "sans-serif"],
                },
                borderRadius: {
                  DEFAULT: "0.75rem",
                },
              },
            },
          };
        `}} />
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            font-family: 'Inter', sans-serif;
            min-height: max(884px, 100dvh);
          }
          .material-symbols-outlined {
            font-variation-settings:
              'FILL' 0,
              'wght' 400,
              'GRAD' 0,
              'opsz' 24
          }
        `}} />
      </Head>
      <body className="bg-background-light dark:bg-background-dark">
        <div className="min-h-screen">
          <header className="bg-card-light dark:bg-card-dark shadow-sm sticky top-0 z-20 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">neurology</span>
                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">CogniVenture AI</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <span className="material-icons text-text-light dark:text-text-dark">search</span>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <span className="material-icons text-text-light dark:text-text-dark">notifications_none</span>
                </button>
              </div>
            </div>
          </header>
          <main className="p-4 space-y-6 pb-24">
            <div className="flex items-center space-x-4">
              <img alt={`${company.CompanyName} Logo`} className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" src={company.LogoURL || "https://placehold.co/64x64"}/>
              <div>
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">{company.CompanyName}</h2>
                <p className="text-md text-text-secondary-light dark:text-text-secondary-dark">{company.WhatCompanyDoes}</p>
              </div>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3 flex items-center"><span className="material-symbols-outlined mr-2 text-red-500">gpp_maybe</span>Risk Intelligence</h3>
              <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md">
                <div className="space-y-4">
                  {company.Risk1 && (
                    <div className="flex items-center">
                      <span className="material-icons text-red-500 mr-3">flag</span>
                      <div>
                        <p className="font-medium text-text-light dark:text-text-dark">Risk 1 Title</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{company.Risk1}</p>
                      </div>
                      <button className="ml-auto text-primary text-sm font-medium">XAI</button>
                    </div>
                  )}
                  {company.Risk2 && (
                    <div className="flex items-center">
                      <span className="material-icons text-yellow-500 mr-3">info</span>
                      <div>
                        <p className="font-medium text-text-light dark:text-text-dark">Risk 2 Title</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{company.Risk2}</p>
                      </div>
                      <button className="ml-auto text-primary text-sm font-medium">XAI</button>
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3 flex items-center"><span className="material-symbols-outlined mr-2 text-primary">analytics</span>Structured Data</h3>
              <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Valuation</p>
                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">{formatCurrency(company.Valuation)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">ARR</p>
                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">{formatCurrency(company.ARR)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Burn Rate</p>
                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">{formatCurrency(company.BurnRate).replace(/\,/g, '')}/mo</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Gross Margin</p>
                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">{formatPercentage(company.GrossMargin)}</p>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3 flex items-center"><span className="material-symbols-outlined mr-2 text-primary">description</span>Investor Deal Notes</h3>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md">
                    <p className="text-text-light dark:text-text-dark">{company.DealNotes || 'No deal notes available.'}</p>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3 flex items-center"><span className="material-symbols-outlined mr-2 text-green-500">recommend</span>Investment Recommendation</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-md border-l-4 border-green-500">
                    <p className="font-bold text-lg text-green-700 dark:text-green-400">{company.RecommendationTitle || 'Conditional Investment'}</p>
                    <p className="text-text-light dark:text-text-dark mt-1">{company.Recommendation || 'Recommendation details not available.'}</p>
                </div>
            </section>
            
            <section>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3 flex items-center"><span className="material-symbols-outlined mr-2 text-primary">monitoring</span>Benchmarks & Competition</h3>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md space-y-4">
                    {/* This section can be made dynamic if benchmark data is available */}
                    <div>
                        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">ARR Growth vs. Sector</p>
                        {/* Placeholder for dynamic benchmark rendering */}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">Key Competitors</p>
                        <p className="text-text-light dark:text-text-dark">{company.Competitors || 'No competitor information available.'}</p>
                    </div>
                </div>
            </section>
            
            <section>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3 flex items-center"><span className="material-symbols-outlined mr-2 text-primary">exit_to_app</span>Exit Strategy Analysis</h3>
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md">
                    <p className="text-text-light dark:text-text-dark">{company.ExitStrategy || 'No exit strategy analysis available.'}</p>
                </div>
            </section>
          </main>
          <footer className="fixed bottom-0 left-0 right-0 bg-card-light dark:bg-card-dark shadow-t-lg border-t border-gray-200 dark:border-gray-700 z-10">
            <nav className="flex justify-around p-2">
              <a className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700" href="#">
                <span className="material-icons">dashboard</span>
              </a>
              <a className="p-2 rounded-full text-primary bg-blue-100 dark:bg-blue-900/50" href="#">
                <span className="material-icons">insights</span>
              </a>
              <a className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700" href="#">
                <span className="material-icons">folder_open</span>
              </a>
              <a className="p-2 rounded-full" href="#">
                <img alt="User avatar" className="w-8 h-8 rounded-full" src="https://placehold.co/32x32"/>
              </a>
            </nav>
          </footer>
        </div>
      </body>
    </>
  );
}
