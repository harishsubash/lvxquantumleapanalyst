import { getCompaniesData } from "../../lib/bigquery";
import { Company } from "../../types/company";
import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: 'LVXQuantumLeapAI - Dashboard',
  description: 'AI-powered investment analysis and company insights',
};

export default async function Home() {
  let data: Company[] = [];

  try {
    data = await getCompaniesData();
  } catch (e) {
    console.error('Error fetching companies data:', e);
  }

  // Helper function to format currency
  const formatCurrency = (value: number | undefined | null) => {
    if (!value || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to format percentage
  const formatPercentage = (value: number | undefined | null) => {
    if (!value || isNaN(value)) return 'N/A';
    return `${value}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <Header />

        <main className="p-4 space-y-6 pb-24">
          {/* Deal Flow Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Deal Flow Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Pitches</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">15</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">New Deals This Week</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">5</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Potential Red Flags</p>
                <p className="text-3xl font-bold text-red-500 dark:text-red-400 mt-2">2</p>
              </div>
            </div>
          </section>

          {/* All Investment Opportunities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">All Investment Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.map((company, index) => (
                <Link key={index} href={`/deal/${company.CompanyName?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().replace(/^-|-$/g, '')}`}>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start gap-4 mb-4">
                      <Image 
                        alt={`${company.CompanyName} logo`} 
                        className="w-16 h-16 object-cover rounded-lg" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI" 
                        width={64}
                        height={64}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{company.CompanyName}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{company.WhatCompanyDoes}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-600 dark:text-gray-400">
                        Valuation: <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(company.Valuation)}</span>
                      </span>
                      <span className="text-green-600 dark:text-green-500 font-semibold">{formatPercentage(company.GrowthRate)}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span>{company.Industry}</span>
                      <span>•</span>
                      <span>{company.FundingStage || 'Early Stage'}</span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Investment Readiness</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((company.GrowthRate || 50) + 20, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-blue-600">Insight:</span> Strong market potential
                      </p>
                      <ArrowRight className="text-gray-600 dark:text-gray-400" size={18} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
  );
}
