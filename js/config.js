/**
 * Game Configuration
 * 
 * Central configuration file for all game constants and settings.
 * This makes it easy to adjust game parameters without touching the logic.
 * 
 * For AI Learning:
 * - Shows how to organize game constants
 * - Demonstrates configuration pattern
 * - Makes values easy to tune
 */

const CONFIG = {
  // ===== CANVAS SETTINGS =====
  CANVAS: {
    WIDTH: 1000,          // Canvas width in pixels (increased)
    HEIGHT: 700,          // Canvas height in pixels (increased)
    BACKGROUND: '#F5E6D3' // Beige background color
  },

  // ===== CAGE SETTINGS =====
  CAGE: {
    WIDTH: 700,           // Cage width (legacy)
    HEIGHT: 500,          // Cage height (legacy)
    X: 50,                // Cage X position (legacy)
    Y: 50,                // Cage Y position (legacy)
    BORDER_COLOR: '#8B4513', // Brown border
    BORDER_WIDTH: 3,
    FLOOR_COLOR: '#DEB887', // Tan floor
    BEDDING_COLOR: '#F4A460' // Sandy bedding
  },

  // ===== HAMSTER SETTINGS =====
  HAMSTER: {
    // Size (smaller for better movement)
    WIDTH: 30,            // Hamster width (reduced from 40)
    HEIGHT: 22,           // Hamster height (reduced from 30)
    
    // Movement (faster and smoother)
    SPEED: 3,             // Base movement speed (increased from 2)
    MAX_SPEED: 4,         // Maximum speed (increased from 3)
    ACCELERATION: 0.15,   // How quickly hamster speeds up (increased)
    FRICTION: 0.97,       // Slowdown factor (increased for smoother)
    
    // Behavior
    DIRECTION_CHANGE_CHANCE: 0.02, // 2% chance per frame to change direction
    IDLE_CHANCE: 0.01,    // 1% chance to stop and idle
    IDLE_DURATION: 60,    // Frames to stay idle (60 = 1 second at 60fps)
    
    // Needs (increased rates so hamsters get hungry/thirsty faster)
    HUNGER_RATE: 0.003,   // How fast hunger increases per frame (3x faster)
    THIRST_RATE: 0.0025,  // How fast thirst increases per frame (3x faster)
    ENERGY_RATE: 0.002,   // How fast energy decreases per frame (4x faster)
    
    // Colors (default)
    DEFAULT_COLOR: '#D2691E', // Chocolate brown
    EYE_COLOR: '#000000',     // Black eyes
    NOSE_COLOR: '#FFB6C1'     // Pink nose
  },

  // ===== FOOD BOWL SETTINGS =====
  FOOD_BOWL: {
    X: 250,               // Position X (lower left cage)
    Y: 550,               // Position Y
    WIDTH: 80,            // Bowl width (increased from 60)
    HEIGHT: 40,           // Bowl height (increased from 30)
    COLOR: '#4169E1',     // Royal blue
    FOOD_COLOR: '#FFD700', // Gold (food pellets)
    MAX_FOOD: 100,        // Maximum food level
    FEED_AMOUNT: 30,      // Amount added when feeding
    EAT_AMOUNT: 0.5       // Amount eaten per frame when eating
  },

  // ===== WATER BOTTLE SETTINGS =====
  WATER_BOTTLE: {
    X: 750,               // Position X (upper right cage)
    Y: 180,               // Position Y (mounted on wall)
    WIDTH: 40,            // Bottle width (increased from 30)
    HEIGHT: 100,          // Bottle height (increased from 80)
    COLOR: '#87CEEB',     // Sky blue
    WATER_COLOR: '#4682B4', // Steel blue
    MAX_WATER: 100,       // Maximum water level
    FILL_AMOUNT: 40,      // Amount added when filling
    DRINK_AMOUNT: 0.3     // Amount drunk per frame when drinking
  },

  // ===== WHEEL SETTINGS =====
  WHEEL: {
    X: 500,               // Center X position (centered in main cage)
    Y: 450,               // Center Y position (main cage)
    RADIUS: 60,           // Wheel radius
    COLOR: '#FF6347',     // Tomato red
    SPOKE_COLOR: '#8B0000', // Dark red
    SPOKES: 8,            // Number of spokes
    ROTATION_SPEED: 0.1   // Rotation speed when hamster is on it
  },

  // ===== TUNNEL SETTINGS =====
  TUNNEL: {
    X: 300,               // Position X (upper left cage)
    Y: 225,               // Position Y
    WIDTH: 80,            // Tunnel width
    HEIGHT: 40,           // Tunnel height
    COLOR: '#CD853F',     // Peru brown
    ENTRANCE_COLOR: '#8B4513' // Saddle brown
  },

  // ===== LANGUAGE SETTINGS =====
  LANGUAGE: 'zh',         // 'zh' or 'en' - Default to Chinese
  
  LABELS: {
    en: {
      HUNGER: 'Hunger',
      THIRST: 'Thirst',
      ENERGY: 'Energy',
      HAPPY: 'Happy',
      PAUSED: 'PAUSED',
      PRESS_SPACE: 'Press SPACE to resume',
      FOOD_ADDED: '🍽️ Food added!',
      WATER_FILLED: '💧 Water filled!'
    },
    zh: {
      HUNGER: '饥饿',
      THIRST: '口渴',
      ENERGY: '精力',
      HAPPY: '快乐',
      PAUSED: '已暂停',
      PRESS_SPACE: '按空格键继续',
      FOOD_ADDED: '🍽️ 已添加食物！',
      WATER_FILLED: '💧 已加水！'
    }
  },

  // ===== UI SETTINGS =====
  UI: {
    BUTTON_WIDTH: 100,
    BUTTON_HEIGHT: 40,
    BUTTON_MARGIN: 10,
    BUTTON_COLOR: '#4CAF50',
    BUTTON_HOVER_COLOR: '#45a049',
    BUTTON_TEXT_COLOR: '#FFFFFF',
    FONT: '16px Arial',
    
    // Status bars
    BAR_WIDTH: 150,
    BAR_HEIGHT: 20,
    BAR_X: 10,
    BAR_Y_START: 10,
    BAR_SPACING: 30
  },

  // ===== GAME LOOP SETTINGS =====
  GAME: {
    TARGET_FPS: 60,       // Target frames per second
    UPDATE_INTERVAL: 1000 / 60, // Milliseconds per frame
    DEBUG_MODE: false     // Show debug info
  },

  // ===== PHYSICS SETTINGS =====
  PHYSICS: {
    GRAVITY: 0,           // No gravity for top-down view
    COLLISION_PADDING: 5  // Pixels of padding for collision detection
  },

  // ===== CUSTOMIZATION OPTIONS =====
  CUSTOMIZATION: {
    HAMSTER_COLORS: [
      { name: 'Brown', value: '#D2691E' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Gray', value: '#808080' },
      { name: 'Golden', value: '#FFD700' },
      { name: 'Black', value: '#2F4F4F' }
    ],
    
    CAGE_COLORS: [
      { name: 'Tan', value: '#DEB887' },
      { name: 'Blue', value: '#B0E0E6' },
      { name: 'Green', value: '#90EE90' },
      { name: 'Pink', value: '#FFB6C1' }
    ]
  }
};

/**
 * Freeze the config object to prevent accidental modifications
 * This is a best practice for configuration objects
 */
Object.freeze(CONFIG);

/**
 * For AI Learning Notes:
 * 
 * 1. ORGANIZATION: All constants in one place
 *    - Easy to find and modify
 *    - No magic numbers in code
 *    - Clear naming conventions
 * 
 * 2. GROUPING: Related settings grouped together
 *    - CANVAS settings together
 *    - HAMSTER settings together
 *    - Makes sense logically
 * 
 * 3. COMMENTS: Each value explained
 *    - What it controls
 *    - Units (pixels, frames, etc.)
 *    - Purpose
 * 
 * 4. IMMUTABILITY: Object.freeze() prevents changes
 *    - Config should not change during runtime
 *    - Prevents bugs from accidental modification
 *    - Makes code more predictable
 * 
 * 5. NAMING: UPPER_SNAKE_CASE for constants
 *    - Standard convention
 *    - Easy to identify as constants
 *    - Distinguishes from variables
 */
