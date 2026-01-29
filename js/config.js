// 游戏配置文件
const CONFIG = {
  // 画布设置
  CANVAS: {
    WIDTH: 1000,
    HEIGHT: 700,
    BACKGROUND: '#F5E6D3'
  },

  // 笼子设置
  CAGE: {
    WIDTH: 700,
    HEIGHT: 500,
    X: 50,
    Y: 50,
    BORDER_COLOR: '#8B4513',
    BORDER_WIDTH: 3,
    FLOOR_COLOR: '#DEB887',
    BEDDING_COLOR: '#F4A460'
  },

  // 仓鼠设置
  HAMSTER: {
    WIDTH: 30,
    HEIGHT: 22,
    SPEED: 2,
    MAX_SPEED: 3,
    ACCELERATION: 0.12,
    FRICTION: 0.96,
    DIRECTION_CHANGE_CHANCE: 0.02,
    IDLE_CHANCE: 0.01,
    IDLE_DURATION: 60,
    HUNGER_RATE: 0.008,
    THIRST_RATE: 0.007,
    ENERGY_RATE: 0.002,
    DEFAULT_COLOR: '#D2691E',
    EYE_COLOR: '#000000',
    NOSE_COLOR: '#FFB6C1'
  },

  // 食物碗设置
  FOOD_BOWL: {
    X: 270,
    Y: 520,
    WIDTH: 80,
    HEIGHT: 40,
    COLOR: '#4169E1',
    FOOD_COLOR: '#FFD700',
    MAX_FOOD: 100,
    FEED_AMOUNT: 30,
    EAT_AMOUNT: 0.05
  },

  // 水瓶设置
  WATER_BOTTLE: {
    X: 750,
    Y: 180,
    WIDTH: 40,
    HEIGHT: 100,
    COLOR: '#87CEEB',
    WATER_COLOR: '#4682B4',
    MAX_WATER: 100,
    FILL_AMOUNT: 40,
    DRINK_AMOUNT: 0.05
  },

  // 跑轮设置
  WHEEL: {
    X: 700,
    Y: 525,
    RADIUS: 50,
    COLOR: '#FF6347',
    SPOKE_COLOR: '#8B0000',
    SPOKES: 8,
    ROTATION_SPEED: 0.1
  },

  // 隧道设置
  TUNNEL: {
    X: 300,
    Y: 225,
    WIDTH: 80,
    HEIGHT: 40,
    COLOR: '#CD853F',
    ENTRANCE_COLOR: '#8B4513',
    ENTRANCE_RADIUS: 20
  },

  // 语言设置
  LANGUAGE: 'zh',
  
  LABELS: {
    en: {
      HUNGER: 'Hunger',
      THIRST: 'Thirst',
      ENERGY: 'Energy',
      HAPPY: 'Happy',
      PAUSED: 'PAUSED',
      PRESS_SPACE: 'Press SPACE to resume',
      FOOD_ADDED: '🍽️ Food added!',
      WATER_FILLED: '💧 Water filled!',
      PET_HAMSTER: '❤️ Pet!'
    },
    zh: {
      HUNGER: '饥饿',
      THIRST: '口渴',
      ENERGY: '精力',
      HAPPY: '快乐',
      PAUSED: '已暂停',
      PRESS_SPACE: '按空格键继续',
      FOOD_ADDED: '🍽️ 已添加食物！',
      WATER_FILLED: '💧 已加水！',
      PET_HAMSTER: '❤️ 快乐值+15！'
    }
  },

  // UI设置
  UI: {
    BUTTON_WIDTH: 100,
    BUTTON_HEIGHT: 40,
    BUTTON_MARGIN: 10,
    BUTTON_COLOR: '#4CAF50',
    BUTTON_HOVER_COLOR: '#45a049',
    BUTTON_TEXT_COLOR: '#FFFFFF',
    FONT: '16px Arial',
    BAR_WIDTH: 150,
    BAR_HEIGHT: 20,
    BAR_X: 10,
    BAR_Y_START: 10,
    BAR_SPACING: 30
  },

  // 游戏循环设置
  GAME: {
    TARGET_FPS: 60,
    UPDATE_INTERVAL: 1000 / 60,
    DEBUG_MODE: false
  },

  // 物理设置
  PHYSICS: {
    GRAVITY: 0,
    COLLISION_PADDING: 5
  },

  // 自定义选项
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

// 冻结配置对象防止意外修改
Object.freeze(CONFIG);
