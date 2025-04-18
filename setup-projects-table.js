const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function setupProjectsTable() {
  console.log('Setting up projects table...');
  
  // Get database connection from environment variables
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL is not defined in .env.local');
    return false;
  }
  
  const client = new Client({ connectionString: databaseUrl });
  
  try {
    await client.connect();
    console.log('✅ Connected to database successfully');
    
    // Check if projects table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'projects'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Projects table already exists');
      
      // Check if we can directly access the projects table
      try {
        const count = await client.query('SELECT COUNT(*) FROM projects');
        console.log(`✅ Projects table is accessible (contains ${count.rows[0].count} rows)`);
      } catch (error) {
        console.error('❌ Unable to access projects table directly:', error.message);
        console.log('Checking RLS policies...');
        
        // Check RLS settings
        const rlsCheck = await client.query(`
          SELECT relrowsecurity 
          FROM pg_class 
          WHERE relname = 'projects' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
        `);
        
        if (rlsCheck.rows.length > 0 && rlsCheck.rows[0].relrowsecurity) {
          console.log('ℹ️ Row Level Security is enabled for projects table');
          
          // Check RLS policies
          const policies = await client.query(`
            SELECT policyname, permissive, roles, cmd, qual, with_check
            FROM pg_policies
            WHERE tablename = 'projects';
          `);
          
          if (policies.rows.length === 0) {
            console.log('❌ No RLS policies found for projects table');
            console.log('Creating default RLS policies...');
            
            // Create basic RLS policies
            await client.query(`
              CREATE POLICY "Users can view their own projects" 
              ON projects FOR SELECT 
              USING (auth.uid() = user_id);
              
              CREATE POLICY "Users can create their own projects" 
              ON projects FOR INSERT 
              WITH CHECK (auth.uid() = user_id);
              
              CREATE POLICY "Users can update their own projects" 
              ON projects FOR UPDATE 
              USING (auth.uid() = user_id);
              
              CREATE POLICY "Users can delete their own projects" 
              ON projects FOR DELETE 
              USING (auth.uid() = user_id);
            `);
            
            console.log('✅ Default RLS policies created successfully');
          } else {
            console.log(`ℹ️ Found ${policies.rows.length} RLS policies for projects table`);
            policies.rows.forEach(policy => {
              console.log(`- ${policy.policyname} (${policy.cmd})`);
            });
          }
        } else {
          console.log('❌ Row Level Security is disabled for projects table');
          console.log('Enabling RLS...');
          await client.query('ALTER TABLE projects ENABLE ROW LEVEL SECURITY;');
          console.log('✅ RLS enabled for projects table');
          
          // Create basic RLS policies
          await client.query(`
            CREATE POLICY "Users can view their own projects" 
            ON projects FOR SELECT 
            USING (auth.uid() = user_id);
            
            CREATE POLICY "Users can create their own projects" 
            ON projects FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
            
            CREATE POLICY "Users can update their own projects" 
            ON projects FOR UPDATE 
            USING (auth.uid() = user_id);
            
            CREATE POLICY "Users can delete their own projects" 
            ON projects FOR DELETE 
            USING (auth.uid() = user_id);
          `);
          
          console.log('✅ Default RLS policies created successfully');
        }
      }
    } else {
      console.log('❌ Projects table does not exist, creating it now...');
      
      // Create projects table
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'active',
          agents JSONB DEFAULT '[]'::JSONB,
          team_settings JSONB DEFAULT '{}'::JSONB,
          chat_config JSONB DEFAULT '{
            "model": "gpt-4",
            "temperature": 0.7,
            "max_tokens": 2000,
            "system_prompt": "You are a helpful AI assistant working on this project.",
            "tools_enabled": true
          }'::JSONB,
          integrations JSONB DEFAULT '{
            "connected": false,
            "services": []
          }'::JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          last_active TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        
        -- Enable Row Level Security
        ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Users can view their own projects" 
        ON projects FOR SELECT 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can create their own projects" 
        ON projects FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own projects" 
        ON projects FOR UPDATE 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own projects" 
        ON projects FOR DELETE 
        USING (auth.uid() = user_id);
      `);
      
      console.log('✅ Projects table created successfully with RLS policies');
    }
    
    console.log('\nVerifying everything is correctly set up...');
    // Final verification
    const tableStructure = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'projects'
      ORDER BY ordinal_position;
    `);
    
    console.log('Projects table structure:');
    tableStructure.rows.forEach(column => {
      console.log(`- ${column.column_name} (${column.data_type})`);
    });
    
    await client.end();
    return true;
  } catch (error) {
    console.error('Error setting up projects table:', error);
    await client.end();
    return false;
  }
}

// Run the setup function
setupProjectsTable()
  .then(success => {
    if (success) {
      console.log('\n✅ Projects table setup completed successfully');
      process.exit(0);
    } else {
      console.error('\n❌ Projects table setup failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 