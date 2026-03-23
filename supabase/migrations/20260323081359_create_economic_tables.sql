-- Create table for China Retail Sales
CREATE TABLE IF NOT EXISTS china_retail_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  yoy_change FLOAT,
  absolute_value FLOAT
);

-- Create table for China Fixed Asset Investment
CREATE TABLE IF NOT EXISTS china_fixed_asset_investment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  ytd_yoy_change FLOAT,
  absolute_value FLOAT
);

-- Create table for China Industrial Production
CREATE TABLE IF NOT EXISTS china_industrial_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  yoy_change FLOAT,
  absolute_value FLOAT
);