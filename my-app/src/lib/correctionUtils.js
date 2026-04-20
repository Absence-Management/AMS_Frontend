/**
 * Checks if the current time is within the "free correction window"
 * (currently defined as 15 minutes after the session end time).
 * 
 * @param {string|number|Date} sessionEndTime - The end time of the session
 * @returns {boolean} - True if still within the free window
 */
export const isWithinFreeWindow = (sessionEndTime) => {
  if (!sessionEndTime) return false;
  
  const end = new Date(sessionEndTime).getTime();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  return now <= end + windowMs;
};
