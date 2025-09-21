
import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery';

const options: BigQueryOptions = {};
const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (credsJson) {
    try {
        options.credentials = JSON.parse(credsJson);
    } catch (e) {
        throw new Error("Could not parse GOOGLE_APPLICATION_CREDENTIALS_JSON. Please ensure it is a valid JSON string.");
    }
}

// If GOOGLE_APPLICATION_CREDENTIALS_JSON is not set, the BigQuery client
// will use the default credential provider chain, which includes checking
// for the GOOGLE_APPLICATION_CREDENTIALS file path.
const bigquery = new BigQuery(options);

export async function getCompaniesData() {
  const query = `SELECT * FROM `steel-sonar-472811-h2.gemini_dataset.companies``;

  const queryOptions = {
    query: query,
    location: 'US',
  };

  const [rows] = await bigquery.query(queryOptions);

  return rows;
}
