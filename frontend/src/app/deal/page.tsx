import Link from "next/link";
import { getCompaniesData } from "../../../lib/bigquery";
import { Company } from "../../../types/company";
import Header from "../components/Header";

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
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Companies</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Companies Directory</h1>
          <div className="text-sm text-gray-500">
            {companies.length} companies found
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No companies found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company: Company, index: number) => (
              <Link
                key={index}
                href={`/deal/${createCompanySlug((company as any).CompanyName || `company-${index}`)}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {(company as any).CompanyName || 'Unknown Company'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {(company as any).Industry || 'Industry not specified'}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-3">
                    {(company as any).WhatCompanyDoes || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {(company as any).FundingStage || 'N/A'}
                      </span>
                      <span>{(company as any).Region || 'Global'}</span>
                    </div>
                    <span className="text-blue-600 hover:text-blue-800">
                      View Details →
                    </span>
                  </div>

                  {(company as any).TeamSize && (
                    <div className="text-xs text-gray-400">
                      Team Size: {(company as any).TeamSize}
                    </div>
                  )}
                </div>
              </a_list_files>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {companies.length > 0 && (
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {companies.length}
                </div>
                <div className="text-sm text-gray-600">Total Companies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {new Set(companies.map((c: any) => c.Industry).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600">Industries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(companies.map((c: any) => c.Region).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600">Regions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(companies.map((c: any) => c.FundingStage).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600">Funding Stages</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
