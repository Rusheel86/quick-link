import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

// Notice we added 'Promise' type to params
export default async function DebugPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. You MUST await params in Next.js 15
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Safety check
  if (!id) {
    return <div>Error: No ID found in URL.</div>
  }

  // 3. Now attempt to fetch
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('id', id)
    .single();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Debug Mode</h1>
      <p><strong>Attempting to find ID:</strong> {id}</p>
      
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
          <h3>Supabase Error:</h3>
          <p>{error.message}</p>
        </div>
      )}

      {data ? (
        <div style={{ color: 'green', border: '1px solid green', padding: '10px' }}>
          <h3>Success! Data Found:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        !error && <p>No data found in Supabase for this ID.</p>
      )}
    </div>
  );
}