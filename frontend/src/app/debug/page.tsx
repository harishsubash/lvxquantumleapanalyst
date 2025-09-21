import { getCompaniesDataWithSchema } from "../../../lib/bigquery";
import Header from "../components/Header";

export default async function DebugPage() {
  const { data, columns } = await getCompaniesDataWithSchema();

  return (
    <div>
      <Header />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Database Schema Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column Names from Schema */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Table Columns (from schema)</h2>
            <div className="space-y-1">
              {columns.length > 0 ? (
                columns.map((column: string, index: number) => (
                  <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                    {index + 1}. {column}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No columns found</p>
              )}
            </div>
          </div>

          {/* Actual Data Keys */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Actual Data Keys (from first row)</h2>
            <div className="space-y-1">
              {data.length > 0 ? (
                Object.keys(data[0]).map((key: string, index: number) => (
                  <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                    {index + 1}. {key}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No data found</p>
              )}
            </div>
          </div>
        </div>

        {/* Sample Data */}
        {data.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Sample Data (First Row)</h2>
            <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
              <pre className="text-xs">
                {JSON.stringify(data[0], null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Data Count */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            <strong>Total rows:</strong> {data.length}
          </p>
          <p className="text-green-800">
            <strong>Total columns:</strong> {columns.length}
          </p>
        </div>

        {/* Expected vs Actual Comparison */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Expected Columns (from your model)</h2>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                'CompanyName', 'WhatCompanyDoes', 'Industry', 'Region', 'TeamSize',
                'NumberOfFounders', 'FoundersQualification', 'FundingStage', 'Ask',
                'Valuation', 'PreviousRounds', 'Traction', 'Revenue', 'MRR', 'ARR',
                'ProjectedARRYear', 'GrossMargin', 'UnitEconomics', 'BurnRate',
                'Runway', 'GrowthRate', 'TAM', 'SAM', 'SOM', 'MarketSize',
                'TargetGeographies', 'Competitors', 'Founders'
              ].map((field: string) => (
                <div 
                  key={field} 
                  className={`p-2 rounded ${
                    data.length > 0 && Object.keys(data[0]).includes(field)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {field}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
