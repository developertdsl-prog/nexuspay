const cache = new Map();

const getLock = (key) => {
  return cache.get(key);
};

const setLock = (key, data, ttlMs = 3600000) => {
  cache.set(key, data);
  setTimeout(() => cache.delete(key), ttlMs);
};

const clearLock = (key) => {
  cache.delete(key);
};

module.exports = { getLock, setLock, clearLock };
