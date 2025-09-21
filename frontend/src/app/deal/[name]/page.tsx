import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompaniesData } from "../../../../lib/bigquery";
import { Company } from "../../../../types/company";

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
    
    // First try to find by exact name match (for backward compatibility)
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to format numbers
  const formatNumber = (value: any) => {
    if (!value || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Helper function to format percentage
  const formatPercentage = (value: any) => {
    if (!value || isNaN(value)) return 'N/A';
    return `${value}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/deal"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Companies
          </Link>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {company.CompanyName}
                </h1>
                <p className="text-xl text-gray-900 mb-4">
                  {company.Industry} • {company.Region}
                </p>
                <p className="text-gray-900 max-w-3xl">
                  {company.WhatCompanyDoes}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  {company.FundingStage || 'Stage N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Valuation</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(company.Valuation)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(company.Revenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Team Size</h3>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(company.TeamSize)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Growth Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(company.GrowthRate)}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Financial Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Monthly Recurring Revenue (MRR)</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(company.MRR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Annual Recurring Revenue (ARR)</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(company.ARR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Projected ARR</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(company.ProjectedARRYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Funding Ask</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(company.Ask)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Gross Margin</span>
                    <span className="font-semibold text-gray-900">{formatPercentage(company.GrossMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Burn Rate</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(company.BurnRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Runway (months)</span>
                    <span className="font-semibold text-gray-900">{formatNumber(company.Runway)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Market Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(company.TAM)}</div>
                  <div className="text-sm text-gray-900">Total Addressable Market</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(company.SAM)}</div>
                  <div className="text-sm text-gray-900">Serviceable Addressable Market</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(company.SOM)}</div>
                  <div className="text-sm text-gray-900">Serviceable Obtainable Market</div>
                </div>
              </div>
              {company.TargetGeographies && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-gray-900">Target Geographies</h4>
                  <p className="text-gray-900">{company.TargetGeographies}</p>
                </div>
              )}
            </div>

            {/* Traction & Additional Info */}
            {(company.Traction || company.UnitEconomics || company.Competitors) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Additional Information</h2>
                <div className="space-y-4">
                  {company.Traction && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Traction</h4>
                      <p className="text-gray-900">{company.Traction}</p>
                    </div>
                  )}
                  {company.UnitEconomics && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Unit Economics</h4>
                      <p className="text-gray-900">{company.UnitEconomics}</p>
                    </div>
                  )}
                  {company.Competitors && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Competitors</h4>
                      <p className="text-gray-900">{company.Competitors}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Team Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Team Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-900">Team Size</span>
                  <span className="font-semibold text-gray-900">{formatNumber(company.TeamSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Number of Founders</span>
                  <span className="font-semibold text-gray-900">{formatNumber(company.NumberOfFounders)}</span>
                </div>
              </div>
              {company.FoundersQualification && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-gray-900">Founders' Qualification</h4>
                  <p className="text-gray-900 text-sm">{company.FoundersQualification}</p>
                </div>
              )}
              {company.Founders && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-gray-900">Founders</h4>
                  <p className="text-gray-900 text-sm">{company.Founders}</p>
                </div>
              )}
            </div>

            {/* Funding History */}
            {company.PreviousRounds && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Funding History</h2>
                <p className="text-gray-900 text-sm">{company.PreviousRounds}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}