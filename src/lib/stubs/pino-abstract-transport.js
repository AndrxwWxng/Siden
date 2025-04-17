// Client-side stub for pino-abstract-transport
// This empty module is used to prevent issues with server-only code in client components

module.exports = function createTransport() {
  return {
    Duplex: class Duplex {}
  };
}; 