
const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    if (!CacheService.instance) {
      this.cache = new NodeCache();
      CacheService.instance = this;
    }

    return CacheService.instance;
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  get(key) {
  return  this.cache.get(key)
  }

  keys() {
    return this.cache.keys();
  }

  has(key) {
    return this.cache.has(key);
  }

  flushAll () {
    this.cache.flushAll()
  }  

  del (key) {
    this.cache.del(key);
  }

}

// Создаем и экспортируем единственный экземпляр кэша, сразу возвращаем объект
const cacheService = new CacheService();
module.exports = cacheService;