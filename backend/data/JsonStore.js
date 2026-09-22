const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_FILE = path.join(__dirname, 'db.json');

class JsonStore {
  constructor(file = DEFAULT_FILE) {
    this.file = file;
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.file)) {
        const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        if (raw && typeof raw === 'object') return raw;
      }
    } catch (err) {
      console.warn('[store] Could not read db.json, starting fresh.', err.message);
    }
    return {
      users: [],
      products: [],
      categories: [],
      rates: [],
      rate_history: [],
      gallery: [],
      site_settings: [],
      enquiries: [],
    };
  }

  persist() {
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), 'utf8');
    fs.renameSync(tmp, this.file);
  }

  static id() {
    return crypto.randomUUID();
  }

  fail(msg) {
    const err = new Error(msg);
    err.status = 404;
    throw err;
  }
}

module.exports = JsonStore;