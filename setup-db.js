import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sbytfdyuhjzboifhiisl.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieXRmZHl1aGp6Ym9pZmhpaXNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI0MzQwMiwiZXhwIjoyMDg5ODE5NDAyfQ.yR7ROAFb2JKWOVUJ8IZE71sMlkSNOrO2cS3-UmjWIX4'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    // Create china_retail_sales table
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS china_retail_sales (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          date DATE NOT NULL UNIQUE,
          yoy_change FLOAT,
          absolute_value FLOAT
        );
      `
    })
    if (error1) console.error('Error creating china_retail_sales:', error1)

    // Create china_fixed_asset_investment table
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS china_fixed_asset_investment (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          date DATE NOT NULL UNIQUE,
          ytd_yoy_change FLOAT,
          absolute_value FLOAT
        );
      `
    })
    if (error2) console.error('Error creating china_fixed_asset_investment:', error2)

    // Create china_industrial_production table
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS china_industrial_production (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          date DATE NOT NULL UNIQUE,
          yoy_change FLOAT,
          absolute_value FLOAT
        );
      `
    })
    if (error3) console.error('Error creating china_industrial_production:', error3)

    console.log('Database setup complete.')
  } catch (err) {
    console.error('Setup failed:', err)
  }
}

setupDatabase()