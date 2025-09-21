/**
 * Company data model interface based on the database schema
 */
export interface Company {
  /** Name of the company */
  CompanyName: string;
  
  /** Description of what the company does */
  WhatCompanyDoes: string;
  
  /** Industry sector the company operates in */
  Industry: string;
  
  /** Geographic region where the company is based */
  Region: string;
  
  /** Total number of team members */
  TeamSize: number;
  
  /** Number of founding members */
  NumberOfFounders: number;
  
  /** Educational and professional background of founders */
  FoundersQualification: string;
  
  /** Current stage of funding (e.g., Seed, Series A, etc.) */
  FundingStage: string;
  
  /** Amount of funding being requested */
  Ask: number;
  
  /** Current company valuation */
  Valuation: number;
  
  /** Details of previous funding rounds */
  PreviousRounds: string;
  
  /** Company's traction metrics and achievements */
  Traction: string;
  
  /** Current revenue figures */
  Revenue: number;
  
  /** Monthly Recurring Revenue */
  MRR: number;
  
  /** Annual Recurring Revenue */
  ARR: number;
  
  /** Projected ARR for the target year */
  ProjectedARRYear: number;
  
  /** Gross profit margin percentage */
  GrossMargin: number;
  
  /** Unit economics metrics */
  UnitEconomics: string;
  
  /** Monthly cash burn rate */
  BurnRate: number;
  
  /** Number of months of runway remaining */
  Runway: number;
  
  /** Growth rate percentage */
  GrowthRate: number;
  
  /** Total Addressable Market size */
  TAM: number;
  
  /** Serviceable Addressable Market size */
  SAM: number;
  
  /** Serviceable Obtainable Market size */
  SOM: number;
  
  /** Overall market size */
  MarketSize: number;
  
  /** Target geographic markets */
  TargetGeographies: string;
  
  /** Competitive landscape and key competitors */
  Competitors: string;
  
  /** Information about the founding team */
  Founders: string;
  
  /** Company logo URL */
  LogoURL?: string;
  
  /** First risk factor identified */
  Risk1?: string;
  
  /** Second risk factor identified */
  Risk2?: string;
  
  /** Investment deal notes and analysis */
  DealNotes?: string;
  
  /** Investment recommendation (INVEST, PASS, etc.) */
  InvestmentRecommendation?: string;
  
  /** Exit strategy analysis */
  ExitStrategy?: string;
}

/**
 * Optional company interface for cases where some fields might be null/undefined
 */
export interface PartialCompany {
  CompanyName?: string;
  WhatCompanyDoes?: string;
  Industry?: string;
  Region?: string;
  TeamSize?: number;
  NumberOfFounders?: number;
  FoundersQualification?: string;
  FundingStage?: string;
  Ask?: number;
  Valuation?: number;
  PreviousRounds?: string;
  Traction?: string;
  Revenue?: number;
  MRR?: number;
  ARR?: number;
  ProjectedARRYear?: number;
  GrossMargin?: number;
  UnitEconomics?: string;
  BurnRate?: number;
  Runway?: number;
  GrowthRate?: number;
  TAM?: number;
  SAM?: number;
  SOM?: number;
  MarketSize?: number;
  TargetGeographies?: string;
  Competitors?: string;
  Founders?: string;
}

/**
 * Company summary interface for displaying key metrics
 */
export interface CompanySummary {
  CompanyName: string;
  Industry: string;
  FundingStage: string;
  Valuation: number;
  Revenue: number;
  TeamSize: number;
  Region: string;
}

/**
 * Financial metrics interface
 */
export interface CompanyFinancials {
  Revenue: number;
  MRR: number;
  ARR: number;
  ProjectedARRYear: number;
  GrossMargin: number;
  BurnRate: number;
  Runway: number;
  GrowthRate: number;
}

/**
 * Market analysis interface
 */
export interface MarketAnalysis {
  TAM: number;
  SAM: number;
  SOM: number;
  MarketSize: number;
  TargetGeographies: string;
  Competitors: string;
}

/**
 * Team information interface
 */
export interface TeamInfo {
  TeamSize: number;
  NumberOfFounders: number;
  FoundersQualification: string;
  Founders: string;
}

/**
 * Funding information interface
 */
export interface FundingInfo {
  FundingStage: string;
  Ask: number;
  Valuation: number;
  PreviousRounds: string;
}

/**
 * Type guard to check if an object is a valid Company
 */
export function isCompany(obj: any): obj is Company {
  return (
    typeof obj === 'object' &&
    typeof obj.CompanyName === 'string' &&
    typeof obj.WhatCompanyDoes === 'string' &&
    typeof obj.Industry === 'string'
  );
}

/**
 * Function to create a company summary from full company data
 */
export function createCompanySummary(company: Company): CompanySummary {
  return {
    CompanyName: company.CompanyName,
    Industry: company.Industry,
    FundingStage: company.FundingStage,
    Valuation: company.Valuation,
    Revenue: company.Revenue,
    TeamSize: company.TeamSize,
    Region: company.Region,
  };
}