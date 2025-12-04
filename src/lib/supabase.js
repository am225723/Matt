import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Some features may not work.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const saveResignation = async (resignationData) => {
  const { data, error } = await supabase
    .from('resignations')
    .insert([{
      addressee: resignationData.addressee,
      role: resignationData.role,
      condition: resignationData.condition,
      paid_in: resignationData.paidIn,
      instead_of: resignationData.insteadOf,
      returning_keys: resignationData.returningKeys,
      struck_responsibilities: resignationData.struckResponsibilities,
      new_position: resignationData.newPosition,
      signature_data: resignationData.signatureData,
      release_type: resignationData.releaseType,
      reference_number: resignationData.referenceNumber
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving resignation:', error);
    throw error;
  }
  
  return data;
};

export const getResignations = async () => {
  const { data, error } = await supabase
    .from('resignations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resignations:', error);
    throw error;
  }
  
  return data || [];
};

export const deleteResignation = async (id) => {
  const { error } = await supabase
    .from('resignations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting resignation:', error);
    throw error;
  }
  
  return true;
};
