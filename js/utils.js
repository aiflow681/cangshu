/**
 * Utility Functions
 * 
 * Common helper functions used throughout the game.
 * These are pure functions that don't depend on game state.
 * 
 * For AI Learning:
 * - Shows utility function patterns
 * - Demonstrates pure functions
 * - Common game development helpers
 */

const Utils = {
  /**
   * Generate a random number between min and max (inclusive)
   * 
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   * 
   * Example: Utils.random(1, 10) might return 7
   */
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  /**
   * Generate a random integer between min and max (inclusive)
   * 
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer
   * 
   * Example: Utils.randomInt(1, 6) simulates a dice roll
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Clamp a value between min and max
   * 
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {number} Clamped value
   * 
   * Example: Utils.clamp(150, 0, 100) returns 100
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Linear interpolation between two values
   * 
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   * 
   * Example: Utils.lerp(0, 100, 0.5) returns 50
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * Calculate distance between two points
   * 
   * @param {number} x1 - First point X
   * @param {number} y1 - First point Y
   * @param {number} x2 - Second point X
   * @param {number} y2 - Second point Y
   * @returns {number} Distance
   * 
   * Uses Pythagorean theorem: √((x2-x1)² + (y2-y1)²)
   */
  distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Check if two rectangles overlap (AABB collision)
   * 
   * @param {Object} rect1 - First rectangle {x, y, width, height}
   * @param {Object} rect2 - Second rectangle {x, y, width, height}
   * @returns {boolean} True if rectangles overlap
   * 
   * AABB = Axis-Aligned Bounding Box
   * Common collision detection method for rectangles
   */
  rectanglesOverlap(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  },

  /**
   * Check if a point is inside a rectangle
   * 
   * @param {number} px - Point X
   * @param {number} py - Point Y
   * @param {Object} rect - Rectangle {x, y, width, height}
   * @returns {boolean} True if point is inside rectangle
   */
  pointInRect(px, py, rect) {
    return px >= rect.x &&
           px <= rect.x + rect.width &&
           py >= rect.y &&
           py <= rect.y + rect.height;
  },

  /**
   * Check if a point is inside a circle
   * 
   * @param {number} px - Point X
   * @param {number} py - Point Y
   * @param {number} cx - Circle center X
   * @param {number} cy - Circle center Y
   * @param {number} radius - Circle radius
   * @returns {boolean} True if point is inside circle
   */
  pointInCircle(px, py, cx, cy, radius) {
    const distance = this.distance(px, py, cx, cy);
    return distance <= radius;
  },

  /**
   * Convert degrees to radians
   * 
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   * 
   * Radians = Degrees × (π / 180)
   */
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  /**
   * Convert radians to degrees
   * 
   * @param {number} radians - Angle in radians
   * @returns {number} Angle in degrees
   * 
   * Degrees = Radians × (180 / π)
   */
  radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  },

  /**
   * Get a random element from an array
   * 
   * @param {Array} array - Array to choose from
   * @returns {*} Random element
   * 
   * Example: Utils.randomChoice(['red', 'blue', 'green'])
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Shuffle an array (Fisher-Yates algorithm)
   * 
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array (modifies original)
   * 
   * This is an in-place shuffle
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  /**
   * Format a number to fixed decimal places
   * 
   * @param {number} num - Number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number
   * 
   * Example: Utils.formatNumber(3.14159, 2) returns "3.14"
   */
  formatNumber(num, decimals = 2) {
    return num.toFixed(decimals);
  },

  /**
   * Create a deep copy of an object
   * 
   * @param {Object} obj - Object to copy
   * @returns {Object} Deep copy
   * 
   * Note: This is a simple implementation
   * For complex objects, consider using a library
   */
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Debounce a function (prevent rapid repeated calls)
   * 
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   * 
   * Useful for resize events, input handlers, etc.
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Check if value is within a range
   * 
   * @param {number} value - Value to check
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} True if value is in range
   */
  inRange(value, min, max) {
    return value >= min && value <= max;
  },

  /**
   * Map a value from one range to another
   * 
   * @param {number} value - Input value
   * @param {number} inMin - Input range minimum
   * @param {number} inMax - Input range maximum
   * @param {number} outMin - Output range minimum
   * @param {number} outMax - Output range maximum
   * @returns {number} Mapped value
   * 
   * Example: Utils.map(5, 0, 10, 0, 100) returns 50
   */
  map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
};

/**
 * For AI Learning Notes:
 * 
 * 1. PURE FUNCTIONS: No side effects
 *    - Same input always gives same output
 *    - Don't modify external state
 *    - Easy to test and understand
 * 
 * 2. SINGLE RESPONSIBILITY: Each function does one thing
 *    - random() only generates random numbers
 *    - distance() only calculates distance
 *    - Clear, focused purpose
 * 
 * 3. DOCUMENTATION: Every function explained
 *    - What it does
 *    - Parameters and types
 *    - Return value
 *    - Example usage
 * 
 * 4. REUSABILITY: Generic, not game-specific
 *    - Can be used in any project
 *    - Not tied to game logic
 *    - Standard utility patterns
 * 
 * 5. MATHEMATICAL HELPERS: Common game math
 *    - Distance calculation (Pythagorean theorem)
 *    - Collision detection (AABB)
 *    - Interpolation (lerp)
 *    - Angle conversion
 */
