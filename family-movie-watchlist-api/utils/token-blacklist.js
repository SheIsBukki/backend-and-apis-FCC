const blacklist = new Set();

export const blacklistToken = (token) => blacklist.add(token);
export const isBlacklisted = (token) => blacklist.has(token);
