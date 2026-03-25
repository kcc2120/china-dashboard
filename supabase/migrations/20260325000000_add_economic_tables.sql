-- create 6 new China economic indicator tables
CREATE TABLE IF NOT EXISTS china_cpi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  yoy_change FLOAT
);

CREATE TABLE IF NOT EXISTS china_pmi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  index_value FLOAT
);

CREATE TABLE IF NOT EXISTS china_trade_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  exports_usd_billion FLOAT,
  imports_usd_billion FLOAT,
  balance_usd_billion FLOAT
);

CREATE TABLE IF NOT EXISTS china_usd_cny (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  exchange_rate FLOAT
);

CREATE TABLE IF NOT EXISTS china_fdi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  yoy_change FLOAT
);

CREATE TABLE IF NOT EXISTS china_unemployment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  unemployment_rate FLOAT
);
