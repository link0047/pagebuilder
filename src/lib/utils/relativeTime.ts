type RelativeTimeOptions = {
  justNowThreshold?: number;
  locale?: string;
  includeTime?: boolean;
}

export function getRelativeTime(
  dateString: string,
  options: RelativeTimeOptions = {}
): string {
  const {
    justNowThreshold = 10,
    locale = "en",
    includeTime = false
  } = options;

  const date = new Date(dateString);
  const now = new Date();
  
  // Validation
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  const diffMs = now.getTime() - date.getTime();
  
  // Handle future dates
  if (diffMs < 0) {
    return "in the future";
  }
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  // Helper for pluralization
  const plural = (
    count: number,
    singular: string,
    pluralForm: string = singular + "s"
  ): string => {
    return count === 1 ? singular : pluralForm;
  };
  
  // Sub-minute
  if (diffSecs < justNowThreshold) {
    return "just now";
  }
  
  // Seconds
  if (diffSecs < 60) {
    return `${diffSecs} ${plural(diffSecs, "second")} ago`;
  }
  
  // Minutes
  if (diffMins < 60) {
    return `${diffMins} ${plural(diffMins, "minute")} ago`;
  }
  
  // Hours (but check if it"s actually yesterday first)
  if (diffHours < 24) {
    // Check if we"ve crossed a day boundary
    if (isYesterday(date, now)) {
      return "yesterday";
    }
    return `${diffHours} ${plural(diffHours, "hour")} ago`;
  }
  
  // Yesterday (proper calendar day check)
  if (isYesterday(date, now)) {
    return "yesterday";
  }
  
  // Days
  const daysDiff = getDaysDifference(date, now);
  if (daysDiff < 7) {
    return `${daysDiff} ${plural(daysDiff, "day")} ago`;
  }
  
  // Weeks (less than a month)
  if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `${weeks} ${plural(weeks, "week")} ago`;
  }
  
  // Months (using actual calendar months)
  const monthsDiff = getMonthsDifference(date, now);
  if (monthsDiff < 12) {
    return `${monthsDiff} ${plural(monthsDiff, "month")} ago`;
  }
  
  // Years
  const yearsDiff = getYearsDifference(date, now);
  return `${yearsDiff} ${plural(yearsDiff, "year")} ago`;
}

/**
 * Check if date is exactly yesterday (previous calendar day)
 */
function isYesterday(date: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
}

/**
 * Get difference in calendar days (not 24-hour periods)
 */
function getDaysDifference(date: Date, now: Date): number {
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = startOfNow.getTime() - startOfDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in calendar months
 */
function getMonthsDifference(date: Date, now: Date): number {
  let months = (now.getFullYear() - date.getFullYear()) * 12;
  months += now.getMonth() - date.getMonth();
  
  // Adjust if we haven"t reached the same day of month yet
  if (now.getDate() < date.getDate()) {
    months--;
  }
  
  return Math.max(months, 1); // At least 1 month if we"re in this function
}

/**
 * Get difference in calendar years
 */
function getYearsDifference(date: Date, now: Date): number {
  let years = now.getFullYear() - date.getFullYear();
  
  // Adjust if we haven"t reached the anniversary yet this year
  if (now.getMonth() < date.getMonth() || 
      (now.getMonth() === date.getMonth() && now.getDate() < date.getDate())) {
    years--;
  }
	
  // At least 1 year if we're in this function
  return Math.max(years, 1); 
}