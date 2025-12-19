import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

export default async function DebugPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Attempt to fetch
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
          <p>Check if your table name is 'links' and 'id' is a column.</p>
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