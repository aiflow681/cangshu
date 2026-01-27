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
    
    console.log('🎮 Game instance created');
  }

  // 设置画布
  setupCanvas() {
    const availableWidth = window.innerWidth - 20;
    
    if (availableWidth < CONFIG.CANVAS.WIDTH) {
      const scale = availableWidth / CONFIG.CANVAS.WIDTH;
      this.canvas.width = CONFIG.CANVAS.WIDTH;
      this.canvas.height = CONFIG.CANVAS.HEIGHT;
      this.canvas.style.width = availableWidth + 'px';
      this.canvas.style.height = (CONFIG.CANVAS.HEIGHT * scale) + 'px';
      console.log('📱 Canvas scaled for mobile:', scale.toFixed(2));
    } else {
      this.canvas.width = CONFIG.CANVAS.WIDTH;
      this.canvas.height = CONFIG.CANVAS.HEIGHT;
      this.canvas.style.width = CONFIG.CANVAS.WIDTH + 'px';
      this.canvas.style.height = CONFIG.CANVAS.HEIGHT + 'px';
      console.log('🖥️ Canvas at full size');
    }
  }

  // 初始化游戏
  async init() {
    console.log('🚀 Initializing game...');
    
    try {
      this.renderer = new Renderer(this.ctx);
      console.log('✅ Renderer created');
      
      this.environment = new Environment();
      console.log('✅ Environment created');
      
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
      console.log(`✅ ${this.hamsters.length} hamsters created`);
      
      this.interactionHandler = new InteractionHandler(this.canvas, this.hamsters, this.environment);
      console.log('✅ Interaction handler created');
      
      this.setupEventListeners();
      console.log('✅ Event listeners set up');
      
      this.render();
      
      console.log('🎉 Game initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize game:', error);
      return false;
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
    console.log('📐 Window resized');
  }

  start() {
    if (this.isRunning) {
      console.warn('⚠️  Game is already running');
      return;
    }
    
    console.log('▶️  Starting game...');
    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  stop() {
    console.log('⏹️  Stopping game...');
    this.isRunning = false;
    this.isPaused = false;
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    console.log('⏸️  Game paused');
    this.isPaused = true;
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;
    console.log('▶️  Game resumed');
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
    console.log('🔄 Resetting game...');
    this.hamsters.forEach(hamster => hamster.reset());
    this.environment.reset();
    this.render();
    console.log('✅ Game reset complete');
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
    
    this.renderer.renderUI(this.hamsters[0], this.environment);
    
    if (CONFIG.GAME.DEBUG_MODE) {
      this.renderer.renderDebug(this.fps, this.hamsters[0]);
    }
    
    if (this.isPaused) {
      this.renderer.renderPauseOverlay();
    }
  }

  destroy() {
    console.log('🗑️  Destroying game...');
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    if (this.interactionHandler) {
      this.interactionHandler.destroy();
    }
    console.log('✅ Game destroyed');
  }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', async () => {
  console.log('📄 DOM loaded, initializing game...');
  
  const game = new Game();
  const success = await game.init();
  
  if (success) {
    game.start();
    window.game = game;
    console.log('🎮 Game is running! Press SPACE to pause, R to reset');
  } else {
    console.error('❌ Failed to start game');
  }
});
