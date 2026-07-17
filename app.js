// app.js
// Dual ESM and CommonJS loader for Phusion Passenger (Hostinger / cPanel Node.js Selector)
// This boots our compiled production Express server bundle safely.

if (typeof require !== 'undefined') {
  // We are in a CommonJS environment
  require('./dist/server.cjs');
} else {
  // We are in an ES Module environment
  import('./dist/server.cjs');
}
