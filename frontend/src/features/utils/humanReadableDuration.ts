// converts milliseconds into human readable duration, e.g. 2 days ago
export function humanReadableDuration(milliseconds: number) {
    function numberEnding(number: number) {
        return (number > 1) ? 's' : '';
    }
    const seconds = Math.floor(milliseconds / 1000);

    const years = Math.floor(seconds / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    const months = Math.floor(seconds / 2592000);
    if (years) {
        return months + ' month' + numberEnding(months);
    }
    const days = Math.floor(seconds / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    const hours = Math.floor(seconds / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    return seconds + ' second' + numberEnding(seconds);
}