/**
 * Main Game Controller
 * 
 * This is the entry point and main game loop.
 * Coordinates all game systems and manages the update/render cycle.
 * 
 * For AI Learning:
 * - Shows game loop pattern (update/render)
 * - Demonstrates initialization sequence
 * - Illustrates state management
 * - RequestAnimationFrame usage
 */

class Game {
  constructor() {
    // Canvas setup
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set initial canvas size (will be adjusted for mobile)
    this.setupCanvas();
    
    // Game state
    this.isRunning = false;
    this.isPaused = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    
    // Game entities (will be initialized in init())
    this.hamsters = []; // Array of hamsters
    this.environment = null;
    this.renderer = null;
    this.interactionHandler = null;
    
    // Bind methods to preserve 'this' context
    this.gameLoop = this.gameLoop.bind(this);
    this.handleResize = Utils.debounce(this.handleResize.bind(this), 250);
    
    console.log('🎮 Game instance created');
  }

  /**
   * Setup canvas with responsive sizing
   */
  setupCanvas() {
    // Get available width (with padding)
    const availableWidth = window.innerWidth - 20;
    
    // Only scale down if screen is smaller than canvas
    // Don't scale up - keep original size on desktop
    if (availableWidth < CONFIG.CANVAS.WIDTH) {
      const scale = availableWidth / CONFIG.CANVAS.WIDTH;
      this.canvas.width = CONFIG.CANVAS.WIDTH;
      this.canvas.height = CONFIG.CANVAS.HEIGHT;
      this.canvas.style.width = availableWidth + 'px';
      this.canvas.style.height = (CONFIG.CANVAS.HEIGHT * scale) + 'px';
      console.log('📱 Canvas scaled for mobile:', scale.toFixed(2));
    } else {
      // Desktop - use full size
      this.canvas.width = CONFIG.CANVAS.WIDTH;
      this.canvas.height = CONFIG.CANVAS.HEIGHT;
      this.canvas.style.width = CONFIG.CANVAS.WIDTH + 'px';
      this.canvas.style.height = CONFIG.CANVAS.HEIGHT + 'px';
      console.log('🖥️ Canvas at full size');
    }
  }

  /**
   * Initialize the game
   * Creates all game entities and sets up event listeners
   */
  async init() {
    console.log('🚀 Initializing game...');
    
    try {
      // Create renderer
      this.renderer = new Renderer(this.ctx);
      console.log('✅ Renderer created');
      
      // Create environment (cage, items)
      this.environment = new Environment();
      console.log('✅ Environment created');
      
      // Create multiple hamsters (3 hamsters like online version)
      const hamsterColors = ['#D2691E', '#FFFFFF', '#808080']; // Brown, White, Gray
      const startPositions = [
        { x: 500, y: 450 },  // Main cage
        { x: 300, y: 225 },  // Upper left
        { x: 700, y: 525 }   // Lower right
      ];
      
      for (let i = 0; i < 3; i++) {
        const hamster = new Hamster(startPositions[i].x, startPositions[i].y);
        hamster.color = hamsterColors[i];
        this.hamsters.push(hamster);
      }
      console.log(`✅ ${this.hamsters.length} hamsters created`);
      
      // Create interaction handler
      this.interactionHandler = new InteractionHandler(
        this.canvas,
        this.hamsters, // Pass array of hamsters
        this.environment
      );
      console.log('✅ Interaction handler created');
      
      // Set up event listeners
      this.setupEventListeners();
      console.log('✅ Event listeners set up');
      
      // Initial render
      this.render();
      
      console.log('🎉 Game initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize game:', error);
      return false;
    }
  }

  /**
   * Set up event listeners for window events
   */
  setupEventListeners() {
    // Window resize
    window.addEventListener('resize', this.handleResize);
    
    // Visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
    
    // Keyboard shortcuts
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

  /**
   * Handle window resize
   * Adjusts canvas if needed (optional feature)
   */
  handleResize() {
    // For now, we keep fixed size
    // Could implement responsive sizing here
    console.log('📐 Window resized');
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) {
      console.warn('⚠️  Game is already running');
      return;
    }
    
    console.log('▶️  Starting game...');
    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    
    // Start the game loop
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Stop the game loop
   */
  stop() {
    console.log('⏹️  Stopping game...');
    this.isRunning = false;
    this.isPaused = false;
  }

  /**
   * Pause the game
   */
  pause() {
    if (!this.isRunning || this.isPaused) return;
    
    console.log('⏸️  Game paused');
    this.isPaused = true;
  }

  /**
   * Resume the game
   */
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    
    console.log('▶️  Game resumed');
    this.isPaused = false;
    this.lastFrameTime = performance.now(); // Reset time to avoid large delta
  }

  /**
   * Toggle pause state
   */
  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Reset the game to initial state
   */
  reset() {
    console.log('🔄 Resetting game...');
    
    // Reset all hamsters
    this.hamsters.forEach(hamster => hamster.reset());
    
    // Reset environment
    this.environment.reset();
    
    // Render
    this.render();
    
    console.log('✅ Game reset complete');
  }

  /**
   * Main game loop
   * This is called every frame by requestAnimationFrame
   * 
   * @param {number} currentTime - Current timestamp from requestAnimationFrame
   */
  gameLoop(currentTime) {
    // Continue loop if game is running
    if (this.isRunning) {
      requestAnimationFrame(this.gameLoop);
    }
    
    // Calculate delta time (time since last frame)
    this.deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Calculate FPS
    this.fps = 1000 / this.deltaTime;
    
    // Skip update if paused, but still render
    if (!this.isPaused) {
      this.update(this.deltaTime);
    }
    
    this.render();
  }

  /**
   * Update game state
   * Called every frame when not paused
   * 
   * @param {number} deltaTime - Time since last frame in milliseconds
   */
  update(deltaTime) {
    // Update all hamsters
    this.hamsters.forEach(hamster => {
      hamster.update(deltaTime, this.environment);
    });
    
    // Update environment (animated objects)
    this.environment.update(deltaTime, this.hamsters[0]); // Use first hamster for wheel
    
    // Update interaction handler
    this.interactionHandler.update(deltaTime);
  }

  /**
   * Render the game
   * Called every frame, even when paused
   */
  render() {
    // Clear canvas
    this.renderer.clear(CONFIG.CANVAS.BACKGROUND);
    
    // Render environment (cage, items)
    this.renderer.renderEnvironment(this.environment);
    
    // Render all hamsters
    this.hamsters.forEach(hamster => {
      this.renderer.renderHamster(hamster);
    });
    
    // Render UI (status bars, buttons) - use first hamster
    this.renderer.renderUI(this.hamsters[0], this.environment);
    
    // Render debug info if enabled
    if (CONFIG.GAME.DEBUG_MODE) {
      this.renderer.renderDebug(this.fps, this.hamsters[0]);
    }
    
    // Render pause overlay if paused
    if (this.isPaused) {
      this.renderer.renderPauseOverlay();
    }
  }

  /**
   * Clean up resources
   * Called when game is destroyed
   */
  destroy() {
    console.log('🗑️  Destroying game...');
    
    // Stop game loop
    this.stop();
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    
    // Clean up interaction handler
    if (this.interactionHandler) {
      this.interactionHandler.destroy();
    }
    
    console.log('✅ Game destroyed');
  }
}

/**
 * Initialize and start the game when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('📄 DOM loaded, initializing game...');
  
  // Create game instance
  const game = new Game();
  
  // Initialize game
  const success = await game.init();
  
  if (success) {
    // Start game loop
    game.start();
    
    // Make game accessible globally for debugging
    window.game = game;
    
    console.log('🎮 Game is running! Press SPACE to pause, R to reset');
  } else {
    console.error('❌ Failed to start game');
  }
});

/**
 * For AI Learning Notes:
 * 
 * 1. GAME LOOP PATTERN:
 *    - requestAnimationFrame for smooth 60fps
 *    - Separate update() and render() methods
 *    - Delta time for frame-independent movement
 *    - Standard game development pattern
 * 
 * 2. INITIALIZATION SEQUENCE:
 *    - Create canvas and context
 *    - Initialize game entities in order
 *    - Set up event listeners
 *    - Start game loop
 * 
 * 3. STATE MANAGEMENT:
 *    - isRunning: Game loop active
 *    - isPaused: Updates stopped but rendering continues
 *    - Clear separation of concerns
 * 
 * 4. EVENT HANDLING:
 *    - Window resize
 *    - Visibility change (tab switching)
 *    - Keyboard shortcuts
 *    - Proper cleanup
 * 
 * 5. ERROR HANDLING:
 *    - Try-catch in initialization
 *    - Console logging for debugging
 *    - Graceful failure
 * 
 * 6. PERFORMANCE:
 *    - requestAnimationFrame (browser-optimized)
 *    - Delta time calculation
 *    - FPS tracking
 *    - Debounced resize handler
 */
