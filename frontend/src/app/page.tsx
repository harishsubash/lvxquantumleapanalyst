
import Image from "next/image";
import { getCompaniesData } from "../../lib/bigquery";
import { Company } from "../../types/company";

export default async function Home() {
  let data: Company[] = [];
  let error: string | null = null;

  try {
    data = await getCompaniesData();
  } catch (e) {
    console.error('Error fetching companies data:', e);
    error = 'Failed to load companies data';
  }

  // Get column headers from the first data row
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div>
          <h1 className="text-xl font-bold mb-4 text-gray-900">Companies Data</h1>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : data.length === 0 ? (
            <p>No data available</p>
          ) : (
            <table className="table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {headers.map((header) => (
                    <th key={header} className="border border-gray-300 px-4 py-2 text-left text-gray-900 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {headers.map((header) => (
                      <td key={header} className="border border-gray-300 px-4 py-2 text-gray-900">
                        {String((row as any)[header] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
