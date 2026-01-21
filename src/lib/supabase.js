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

export const saveNorthStarGoal = async (goalData) => {
  const { data, error } = await supabase
    .from('north_star_goals')
    .insert([{
      timeframe: goalData.timeframe,
      raw_goal: goalData.raw_goal,
      smart_goal: goalData.smart_goal,
      milestones: goalData.milestones,
      reality_check: goalData.reality_check,
      status: goalData.status || 'in-progress'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving North Star goal:', error);
    throw error;
  }
  
  return data;
};

export const getNorthStarGoals = async () => {
  const { data, error } = await supabase
    .from('north_star_goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching North Star goals:', error);
    throw error;
  }
  
  return data || [];
};

export const updateNorthStarGoal = async (id, updates) => {
  const { data, error } = await supabase
    .from('north_star_goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating North Star goal:', error);
    throw error;
  }
  
  return data;
};

export const deleteNorthStarGoal = async (id) => {
  const { error } = await supabase
    .from('north_star_goals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting North Star goal:', error);
    throw error;
  }
  
  return true;
};
