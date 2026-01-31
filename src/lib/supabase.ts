import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getShopItems() {
  const { data, error } = await supabase
    .from('shop')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching shop items:', error);
    return [];
  }

  return data || [];
}

export async function getShopItemByName(name: string) {
  const { data, error } = await supabase
    .from('shop')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    console.error('Error fetching shop item:', error);
    return null;
  }

  return data;
}

export async function fetchEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  console.log('Fetching events from database...');

  // Get all events
  const { data: events, error: eventsError } = await supabase
    .from('event_create')
    .select('*')
    .gte('event_date', today.toISOString())
    .order('event_date', { ascending: true });

  if (eventsError) {
    console.error('Error fetching events:', eventsError);
    return [];
  }

  console.log('Raw events from database:', events);

  if (!events || events.length === 0) {
    return [];
  }

  // Get participant counts for all events
  const eventNames = events.map(event => event.name);
  const { data: participantCounts, error: countError } = await supabase
    .from('events')
    .select('event_name')
    .in('event_name', eventNames);

  if (countError) {
    console.error('Error fetching participant counts:', countError);
    // Return events with 0 participant count if count query fails
    return events.map(event => ({ ...event, participant_count: 0 }));
  }

  // Count participants per event
  const countMap: { [key: string]: number } = {};
  participantCounts?.forEach(participant => {
    countMap[participant.event_name] = (countMap[participant.event_name] || 0) + 1;
  });

  // Add participant count to each event
  const eventsWithCounts = events.map(event => ({
    ...event,
    participant_count: countMap[event.name] || 0
  }));

  console.log('Events with real participant counts:', eventsWithCounts);
  return eventsWithCounts;
}

export async function getEventParticipants(eventId: number) {
  // Note: event_participants table may not exist yet
  // Return empty array for now to prevent errors
  console.log('Event participants table not available yet');
  return [];
}

export async function getOnlinePlayerCount() {
  // This might need to be implemented based on your backend
  // For now, return a placeholder
  return 0;
}

export async function getOnlinePlayersByGamemode() {
  const { data, error } = await supabase
    .from('online_players')
    .select('gamemodes, count')
    .order('gamemodes');

  if (error) {
    console.error('Error fetching online players by gamemode:', error);
    return {};
  }

  // Convert array to object with gamemode as key
  const result: { [key: string]: number } = {};
  data?.forEach(item => {
    result[item.gamemodes] = item.count;
  });

  return result;
}

export async function redeemGiftcard(code: string) {
  const { data, error } = await supabase
    .from('giftcard')
    .select('remaining, event, used, percentage_discount, unlimited_use')
    .eq('code', code)
    .single();

  if (error) {
    console.error('Error fetching giftcard:', error);
    throw new Error('Giftcard niet gevonden of ongeldig');
  }

  if (!data || data.used) {
    throw new Error('Deze giftcard heeft geen tegoed meer of is al gebruikt');
  }

  // Prevent event giftcards with percentage discount from being applied to cart - they should only be redeemed for rewards
  // Event giftcards with percentage_discount=0 should redirect to event reward page
  if (data.event && data.percentage_discount > 0) {
    throw new Error('Deze giftcard kan alleen worden gebruikt voor event beloningen');
  }

  // Prevent giftcards with no remaining balance from being applied (unless unlimited use)
  if (data.remaining <= 0 && !data.unlimited_use) {
    throw new Error('Deze giftcard heeft geen tegoed meer');
  }

  return {
    giftcard: { code },
    remaining: data.remaining,
    event: data.event,
    percentage_discount: data.percentage_discount,
    unlimited_use: data.unlimited_use,
    message: "Giftcard succesvol verzilverd!"
  };
}

export async function redeemEventGiftcard(code: string, selectedItem: string) {
  // First check if the giftcard exists and is valid
  const { data: giftcard, error: fetchError } = await supabase
    .from('giftcard')
    .select('remaining, event, used')
    .eq('code', code)
    .single();

  if (fetchError || !giftcard || giftcard.remaining <= 0 || giftcard.used) {
    throw new Error('Giftcard niet geldig of al gebruikt');
  }

  if (!giftcard.event) {
    throw new Error('Deze giftcard is geen event giftcard');
  }

  // No need to check items field since rewards are now hardcoded

  // Mark the giftcard as used
  const { error: updateError } = await supabase
    .from('giftcard')
    .update({
      used: true,
      used_at: new Date().toISOString(),
      remaining: 0
    })
    .eq('code', code);

  if (updateError) {
    console.error('Error updating giftcard:', updateError);
    throw new Error('Kon giftcard niet bijwerken');
  }

  return {
    success: true,
    selectedItem,
    message: `Event giftcard succesvol verzilverd! Je hebt ${selectedItem} ontvangen.`
  };
}

export async function joinEvent(eventId: number, playerName: string) {
  try {
    // First get the event to check if it exists and get the name
    const { data: event, error: eventError } = await supabase
      .from('event_create')
      .select('name, max_participants')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new Error('Event niet gevonden');
    }

    // Check if user is already registered for this event
    const { data: existingParticipant, error: checkError } = await supabase
      .from('events')
      .select('id')
      .eq('event_name', event.name)
      .eq('username', playerName)
      .single();

    if (existingParticipant) {
      throw new Error('Je bent al ingeschreven voor dit event');
    }

    // Check current participant count
    const { count: currentCount, error: countError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', event.name);

    if (countError) {
      console.error('Error checking participant count:', countError);
    } else if (event.max_participants && currentCount >= event.max_participants) {
      throw new Error('Dit event is al vol');
    }

    // Add the participant to the events table
    const { error: insertError } = await supabase
      .from('events')
      .insert([{
        event_name: event.name,
        username: playerName,
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error joining event:', insertError);
      throw new Error('Kon niet inschrijven voor het event');
    }

    return {
      success: true,
      message: "Succesvol ingeschreven voor het event!"
    };
  } catch (error) {
    console.error('Error in joinEvent:', error);
    throw error;
  }
}

export async function getRecentSupporters() {
  const { data, error } = await supabase
    .from('recent_supporters')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching recent supporters:', error);
    return [];
  }

  return data || [];
}

export async function addRecentSupporter(username: string, itemName: string) {
  const { error } = await supabase
    .from('recent_supporters')
    .insert([{
      name: username,
      item: itemName,
      created_at: new Date().toISOString()
    }]);

  if (error) {
    console.error('Error adding recent supporter:', error);
    throw error;
  }
}

export async function getUserPurchases(userId: number) {
  const { data, error } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user purchases:', error);
    return [];
  }

  return data || [];
}

export async function addUserPurchase(userId: number, itemName: string, itemType: string, price: number) {
  const { error } = await supabase
    .from('user_purchases')
    .insert([{
      user_id: userId,
      item_name: itemName,
      item_type: itemType,
      price: price
    }]);

  if (error) {
    console.error('Error adding user purchase:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('minecraft_username', username)
    .single();

  if (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }

  return data;
}

export async function getUserPurchasesByUsername(username: string) {
  // First get the user
  const user = await getUserByUsername(username);
  if (!user) {
    return [];
  }

  // Then get their purchases
  const { data, error } = await supabase
    .from('user_purchases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user purchases by username:', error);
    return [];
  }

  return data || [];
}

// Cache for user purchases to avoid multiple database queries
let userPurchasesCache: { [username: string]: string[] } = {};
let cacheTimestamp: { [username: string]: number } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getUserPurchasedItems(username: string): Promise<string[]> {
  const now = Date.now();

  // Check if we have cached data that's still valid
  if (userPurchasesCache[username] && cacheTimestamp[username] &&
      (now - cacheTimestamp[username]) < CACHE_DURATION) {
    return userPurchasesCache[username];
  }

  try {
    // First get the user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('minecraft_username', username)
      .single();

    if (userError || !user) {
      console.log('User not found:', username);
      return [];
    }

    // Get all user purchases at once
    const { data: purchases, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('item_name')
      .eq('user_id', user.id);

    if (purchaseError) {
      console.error('Error fetching user purchases:', purchaseError);
      // If table doesn't exist, return empty array
      if (purchaseError.code === 'PGRST116' || purchaseError.message?.includes('relation')) {
        console.log('user_purchases table may not exist');
        return [];
      }
      return [];
    }

    // Extract item names and cache them
    const itemNames = purchases?.map(p => p.item_name) || [];
    userPurchasesCache[username] = itemNames;
    cacheTimestamp[username] = now;

    console.log(`Loaded ${itemNames.length} purchased items for user:`, username);
    return itemNames;
  } catch (error) {
    console.error('Error in getUserPurchasedItems:', error);
    return [];
  }
}

export async function checkUserOwnsItem(username: string, itemId: string): Promise<boolean> {
  try {
    console.log('checkUserOwnsItem called with:', { username, itemId });

    // First get the user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('minecraft_username', username)
      .single();

    if (userError || !user) {
      console.log('User not found:', username, userError);
      return false;
    }

    console.log('Found user ID:', user.id);

    // Check if user owns this item in user_purchases table
    const { data: purchase, error: purchaseError } = await supabase
      .from('user_purchases')
      .select('id, item_name')
      .eq('user_id', user.id)
      .eq('item_name', itemId)
      .maybeSingle();

    if (purchaseError) {
      console.error('Error checking user purchase:', purchaseError);
      return false;
    }

    console.log('Purchase check result:', { purchase, itemId });
    const ownsItem = !!purchase;
    console.log('User owns item?', itemId, ownsItem);

    return ownsItem;
  } catch (error) {
    console.error('Error in checkUserOwnsItem:', error);
    return false;
  }
}

// Function to clear cache when needed (e.g., after purchase)
export function clearUserPurchasesCache(username?: string) {
  if (username) {
    delete userPurchasesCache[username];
    delete cacheTimestamp[username];
  } else {
    userPurchasesCache = {};
    cacheTimestamp = {};
  }
}
