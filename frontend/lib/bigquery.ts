
import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery';
import { Company } from '../types/company';

const options: BigQueryOptions = {};
const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (credsJson) {
    try {
        options.credentials = JSON.parse(credsJson);
        options.projectId = 'steel-sonar-472811-h2';
    } catch (e) {
        console.error("Error parsing GOOGLE_APPLICATION_CREDENTIALS_JSON:", e);
        throw new Error("Could not parse GOOGLE_APPLICATION_CREDENTIALS_JSON. Please ensure it is a valid JSON string.");
    }
} else {
    // Set project ID even when using default credentials
    options.projectId = 'steel-sonar-472811-h2';
}

// If GOOGLE_APPLICATION_CREDENTIALS_JSON is not set, the BigQuery client
// will use the default credential provider chain, which includes checking
// for the GOOGLE_APPLICATION_CREDENTIALS file path.
const bigquery = new BigQuery(options);

export async function getCompaniesData(): Promise<Company[]> {
  try {
    const query = `SELECT * FROM \`steel-sonar-472811-h2.gemini_dataset.companies\``;

    const queryOptions = {
      query: query,
      location: 'US',
    };

    const [rows] = await bigquery.query(queryOptions);
    
    // Log the columns from the first row for debugging
    if (rows.length > 0) {
      console.log('Available columns from BigQuery:', Object.keys(rows[0]));
      console.log('Sample data structure:', JSON.stringify(rows[0], null, 2));
    }
    
    return rows as Company[];
  } catch (error) {
    console.error('BigQuery error:', error);
    // Return empty array on error to prevent page crash
    return [];
  }
}

export async function getTableSchema(): Promise<string[]> {
  try {
    const query = `
      SELECT column_name 
      FROM \`steel-sonar-472811-h2.gemini_dataset.INFORMATION_SCHEMA.COLUMNS\` 
      WHERE table_name = 'companies'
      ORDER BY ordinal_position
    `;

    const queryOptions = {
      query: query,
      location: 'US',
    };

    const [rows] = await bigquery.query(queryOptions);
    return rows.map((row: any) => row.column_name);
  } catch (error) {
    console.error('Schema query error:', error);
    return [];
  }
}

export async function getCompaniesDataWithSchema(): Promise<{ data: Company[], columns: string[] }> {
  try {
    const [data, columns] = await Promise.all([
      getCompaniesData(),
      getTableSchema()
    ]);
    
    console.log('Table columns from schema:', columns);
    
    return { data, columns };
  } catch (error) {
    console.error('Error getting data with schema:', error);
    return { data: [], columns: [] };
  }
}
