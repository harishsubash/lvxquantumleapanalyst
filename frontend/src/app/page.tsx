import Image from "next/image";
import { getCompaniesData } from "../../lib/bigquery";
import { Company } from "../../types/company";
import "./home.css";
import Header from "./components/Header";

export default async function Home() {
  let data: Company[] = [];
  let error: string | null = null;

  try {
    data = await getCompaniesData();
  } catch (e) {
    console.error('Error fetching companies data:', e);
    error = 'Failed to load companies data';
  }

  return (
    <div>
      <Header />
      <main className="flex-1 p-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Deal Flow Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Pitches</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">24</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">New Deals This Week</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">8</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Potential Red Flags</p>
              <p className="text-3xl font-bold text-red-500 dark:text-red-400 mt-2">2</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Top Investment Opportunities</h2>
          <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-6">
            {data.map((company, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex flex-col gap-4 hover:shadow-lg hover:dark:bg-slate-800 transition-all">
                <div className="flex items-start gap-4">
                  <img alt={`${company.CompanyName} logo`} className="w-16 h-16 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKH4luNbI2RQpfnXUtSABGKXxKgAPgzq-WBKrvTuRg45x8ExaQrZpg9qn1yAmGPOrY6aenCm_iiDlBl700aKAYDnwTFrx3t5_9107UkAfQQk-pM-fAWiQoNFRUXn50B5K1WtWEh2HpMDNl0kFh30f5aj72Kx7PT2UuzFexvWFQXgfih-rzryP7M7aVvg0zNefxqsgARbGfxMrwioX9MLtP10MKd8mcHsqWnj9sQmXXl6y74ov3P8_AsOtrxhsgGHmnB5OnDSAINRI" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{company.CompanyName}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{company.WhatCompanyDoes}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm"><span className="font-semibold text-primary/80 dark:text-primary/70">Insight:</span> Strong market fit.</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>Valuation: <span className="font-semibold text-slate-800 dark:text-slate-200">{company.Valuation}</span></span>
                  <span className="text-green-600 dark:text-green-500 font-semibold">{company.GrowthRate}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Readiness</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
