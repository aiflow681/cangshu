// 游戏主类
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    
    this.isRunning = false;
    this.isPaused = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    
    this.hamsters = [];
    this.environment = null;
    this.renderer = null;
    this.interactionHandler = null;
    
    this.gameLoop = this.gameLoop.bind(this);
    this.handleResize = Utils.debounce(this.handleResize.bind(this), 250);
  }

  // 设置画布
  setupCanvas() {
    // 留出头部和其他UI的空间
    const paddingX = 20;
    const paddingY = 160; 
    
    const availableWidth = window.innerWidth - paddingX;
    const availableHeight = window.innerHeight - paddingY;
    
    const scaleX = availableWidth / CONFIG.CANVAS.WIDTH;
    const scaleY = availableHeight / CONFIG.CANVAS.HEIGHT;
    
    const scale = Math.min(scaleX, scaleY, 1);
    
    this.canvas.width = CONFIG.CANVAS.WIDTH;
    this.canvas.height = CONFIG.CANVAS.HEIGHT;
    
    this.canvas.style.width = (CONFIG.CANVAS.WIDTH * scale) + 'px';
    this.canvas.style.height = (CONFIG.CANVAS.HEIGHT * scale) + 'px';
  }

  // 初始化游戏
  async init() {
    
    try {
      this.renderer = new Renderer(this.ctx);
      
      this.environment = new Environment();
      
      // 创建3只仓鼠
      const hamsterColors = ['#D2691E', '#FFFFFF', '#808080'];
      const startPositions = [
        { x: 500, y: 450 },
        { x: 300, y: 225 },
        { x: 700, y: 525 }
      ];
      
      for (let i = 0; i < 3; i++) {
        const hamster = new Hamster(startPositions[i].x, startPositions[i].y, startPositions[i]);
        hamster.color = hamsterColors[i];
        this.hamsters.push(hamster);
      }
      
      this.interactionHandler = new InteractionHandler(this.canvas, this.hamsters, this.environment);
      
      this.setupEventListeners();
      
      this.render();
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // 添加食物
  addFood() {
    if (this.environment && this.environment.foodBowl) {
      this.environment.foodBowl.feed();
      // 在屏幕中心显示反馈
      if (this.interactionHandler) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const labels = CONFIG?.LABELS?.[CONFIG?.LANGUAGE || 'zh'] || { FOOD_ADDED: 'Food Added' };
        this.interactionHandler.showFeedback(labels.FOOD_ADDED, cx, cy);
      }
    }
  }

  // 添加水
  addWater() {
    if (this.environment && this.environment.waterBottle) {
      this.environment.waterBottle.fill();
      // 在屏幕中心显示反馈
      if (this.interactionHandler) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const labels = CONFIG?.LABELS?.[CONFIG?.LANGUAGE || 'zh'] || { WATER_FILLED: 'Water Filled' };
        this.interactionHandler.showFeedback(labels.WATER_FILLED, cx, cy);
      }
    }
  }

  // 设置事件监听
  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        this.togglePause();
      }
      if (e.key === 'r' || e.key === 'R') {
        this.reset();
      }
    });
  }

  handleResize() {
    this.setupCanvas();
    if (this.renderer) {
      this.render();
    }
  }

  start() {
    if (this.isRunning) {
      return;
    }
    
    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  reset() {
    this.hamsters.forEach(hamster => hamster.reset());
    this.environment.reset();
    this.render();
  }

  // 游戏主循环
  gameLoop(currentTime) {
    if (this.isRunning) {
      requestAnimationFrame(this.gameLoop);
    }
    
    this.deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    this.fps = 1000 / this.deltaTime;
    
    if (!this.isPaused) {
      this.update(this.deltaTime);
    }
    
    this.render();
  }

  // 更新游戏状态
  update(deltaTime) {
    this.hamsters.forEach(hamster => {
      hamster.update(deltaTime, this.environment);
    });
    
    this.environment.update(deltaTime, this.hamsters[0]);
    this.interactionHandler.update(deltaTime);
  }

  // 渲染游戏
  render() {
    this.renderer.clear(CONFIG.CANVAS.BACKGROUND);
    this.renderer.renderEnvironment(this.environment);
    
    this.hamsters.forEach(hamster => {
      this.renderer.renderHamster(hamster);
    });
    
    // 传入所有仓鼠，显示平均状态
    this.renderer.renderUI(this.hamsters, this.environment);
    
    if (CONFIG.GAME.DEBUG_MODE) {
      this.renderer.renderDebug(this.fps, this.hamsters[0]);
    }
    
    if (this.isPaused) {
      this.renderer.renderPauseOverlay();
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    if (this.interactionHandler) {
      this.interactionHandler.destroy();
    }
  }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', async () => {
  
  const game = new Game();
  const success = await game.init();
  
  if (success) {
    game.start();
    window.game = game;
  } else {
    // Failed to start game
  }
});
