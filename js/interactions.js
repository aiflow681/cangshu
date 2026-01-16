/**
 * Interaction Handler
 * 
 * Manages user input (mouse clicks, touch) and interactions with game objects.
 * 
 * For AI Learning:
 * - Event handling patterns
 * - Click detection
 * - User feedback
 */

class InteractionHandler {
  constructor(canvas, hamsters, environment) {
    this.canvas = canvas;
    this.hamsters = hamsters; // Array of hamsters
    this.environment = environment;
    
    // Mouse/touch state
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    
    // Bind event handlers
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    
    // Add event listeners
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    
    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
      this.handleClick(e);
    });
    
    console.log('🖱️ Interaction handler created');
  }

  /**
   * Update interaction handler
   */
  update(deltaTime) {
    // Could add hover effects, tooltips, etc.
  }

  /**
   * Handle mouse move
   */
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    
    // Update cursor based on what's under mouse
    this.updateCursor();
  }

  /**
   * Handle mouse down
   */
  handleMouseDown(e) {
    this.isMouseDown = true;
  }

  /**
   * Handle mouse up
   */
  handleMouseUp(e) {
    this.isMouseDown = false;
  }

  /**
   * Handle click events
   */
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    console.log('🖱️ Click at', Math.round(clickX), Math.round(clickY));
    
    // Get labels based on language
    const lang = CONFIG.LANGUAGE;
    const labels = CONFIG.LABELS[lang];
    
    // Check if clicked on food bowl
    if (this.isPointInBounds(clickX, clickY, this.environment.foodBowl.getBounds())) {
      this.environment.foodBowl.feed();
      this.showFeedback(labels.FOOD_ADDED, clickX, clickY);
      return;
    }
    
    // Check if clicked on water bottle
    if (this.isPointInBounds(clickX, clickY, this.environment.waterBottle.getBounds())) {
      this.environment.waterBottle.fill();
      this.showFeedback(labels.WATER_FILLED, clickX, clickY);
      return;
    }
    
    // Check if clicked on hamster (any hamster)
    for (let hamster of this.hamsters) {
      if (this.isPointInBounds(clickX, clickY, hamster.getBounds())) {
        this.petHamster(hamster);
        this.showFeedback('❤️ Pet!', clickX, clickY);
        return;
      }
    }
  }

  /**
   * Check if point is inside bounds
   */
  isPointInBounds(x, y, bounds) {
    return x >= bounds.x &&
           x <= bounds.x + bounds.width &&
           y >= bounds.y &&
           y <= bounds.y + bounds.height;
  }

  /**
   * Pet the hamster (increases happiness)
   */
  petHamster(hamster) {
    hamster.happiness = Math.min(100, hamster.happiness + 5);
    console.log('❤️ Hamster petted! Happiness:', Math.round(hamster.happiness));
  }

  /**
   * Show visual feedback for interaction
   */
  showFeedback(text, x, y) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = text;
    feedback.style.position = 'fixed';
    feedback.style.left = x + 'px';
    feedback.style.top = y + 'px';
    feedback.style.color = '#4CAF50';
    feedback.style.fontWeight = 'bold';
    feedback.style.fontSize = '20px';
    feedback.style.pointerEvents = 'none';
    feedback.style.animation = 'fadeOut 1s forwards';
    feedback.style.zIndex = '1000';
    
    document.body.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 1000);
  }

  /**
   * Update cursor based on hover
   */
  updateCursor() {
    let cursor = 'default';
    
    // Check if hovering over interactive objects
    if (this.isPointInBounds(this.mouseX, this.mouseY, this.environment.foodBowl.getBounds()) ||
        this.isPointInBounds(this.mouseX, this.mouseY, this.environment.waterBottle.getBounds())) {
      cursor = 'pointer';
    }
    
    // Check if hovering over any hamster
    for (let hamster of this.hamsters) {
      if (this.isPointInBounds(this.mouseX, this.mouseY, hamster.getBounds())) {
        cursor = 'pointer';
        break;
      }
    }
    
    this.canvas.style.cursor = cursor;
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    this.canvas.removeEventListener('click', this.handleClick);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    
    console.log('🗑️ Interaction handler destroyed');
  }
}

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;
document.head.appendChild(style);

/**
 * For AI Learning Notes:
 * 
 * 1. EVENT HANDLING:
 *    - Mouse and touch events
 *    - Event binding with proper 'this' context
 *    - Event cleanup on destroy
 * 
 * 2. CLICK DETECTION:
 *    - Point-in-rectangle collision
 *    - Multiple clickable objects
 *    - Priority handling
 * 
 * 3. USER FEEDBACK:
 *    - Visual feedback (floating text)
 *    - Cursor changes on hover
 *    - Console logging
 * 
 * 4. TOUCH SUPPORT:
 *    - Touch events for mobile
 *    - Prevent default behavior
 *    - Unified handling with mouse
 */
