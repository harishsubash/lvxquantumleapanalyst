import Link from "next/link";
import { getCompaniesData } from "../../../lib/bigquery";
import { Company } from "../../../types/company";
import Header from "../components/Header";

export const metadata = {
  title: 'LVXQuantumLeapAI - Companies',
  description: 'Browse all investment opportunities and company profiles',
};

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
  let companies: Company[] = [];
  let error: string | null = null;

  try {
    companies = await getCompaniesData();
  } catch (e) {
    console.error('Error fetching companies:', e);
    error = 'Failed to load companies data';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="p-8 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Companies</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
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
                        <img
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