/**
 * Renderer
 * 
 * Handles all canvas drawing operations.
 * Separates rendering logic from game logic.
 * 
 * For AI Learning:
 * - Canvas API usage
 * - Rendering patterns
 * - Visual feedback
 */

class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Clear the canvas
   */
  clear(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
  }

  /**
   * Render the environment (cage, items)
   */
  renderEnvironment(environment) {
    // Draw cage
    this.drawCage();
    
    // Draw items (if environment has them)
    if (environment?.foodBowl) {
      this.drawFoodBowl(environment.foodBowl);
    }
    if (environment?.waterBottle) {
      this.drawWaterBottle(environment.waterBottle);
    }
    if (environment?.tunnel) {
      this.drawTunnel(environment.tunnel);
    }
    if (environment?.wheel) {
      this.drawWheel(environment.wheel);
    }
  }

  /**
   * Draw the cage
   */
  drawCage() {
    const ctx = this.ctx;
    
    // Centered, compact layout with margins
    // Main cage (center)
    this.drawSingleCage(350, 350, 300, 200);
    
    // Upper left cage
    this.drawSingleCage(200, 150, 200, 150);
    
    // Upper right cage
    this.drawSingleCage(600, 150, 200, 150);
    
    // Lower left cage
    this.drawSingleCage(200, 450, 200, 150);
    
    // Lower right cage
    this.drawSingleCage(600, 450, 200, 150);
    
    // Draw connecting tubes
    this.drawTubes();
  }
  
  /**
   * Draw a single cage section
   */
  drawSingleCage(x, y, width, height) {
    const ctx = this.ctx;
    
    // Draw floor/bedding
    ctx.fillStyle = CONFIG.CAGE.BEDDING_COLOR;
    ctx.fillRect(x, y + height - 30, width, 30);
    
    // Draw cage border
    ctx.strokeStyle = CONFIG.CAGE.BORDER_COLOR;
    ctx.lineWidth = CONFIG.CAGE.BORDER_WIDTH;
    ctx.strokeRect(x, y, width, height);
  }
  
  /**
   * Draw connecting tubes between cages
   */
  drawTubes() {
    const ctx = this.ctx;
    
    // Main to upper left
    this.drawTube(350, 400, 350, 300, 30, '#87CEEB');
    
    // Main to upper right
    this.drawTube(650, 400, 650, 300, 30, '#87CEEB');
    
    // Main to lower left
    this.drawTube(350, 550, 350, 600, 30, '#90EE90');
    
    // Main to lower right
    this.drawTube(650, 550, 650, 600, 30, '#90EE90');
    
    // Upper left to upper right (horizontal)
    this.drawTube(400, 225, 600, 225, 30, '#FFB6C1');
    
    // Lower left to lower right (horizontal)
    this.drawTube(400, 525, 600, 525, 30, '#DDA0DD');
  }
  
  /**
   * Draw a single tube
   */
  drawTube(x1, y1, x2, y2, width, color) {
    const ctx = this.ctx;
    
    // Calculate angle
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    
    // Tube body
    ctx.fillStyle = color;
    ctx.fillRect(0, -width/2, length, width);
    
    // Tube stripes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    for (let i = 0; i < length; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, -width/2);
      ctx.lineTo(i, width/2);
      ctx.stroke();
    }
    
    // Tube entrance (left)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Tube exit (right)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(length, 0, width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Draw food bowl
   */
  drawFoodBowl(bowl) {
    const ctx = this.ctx;
    
    // Bowl body
    ctx.fillStyle = CONFIG.FOOD_BOWL.COLOR;
    ctx.beginPath();
    ctx.ellipse(bowl.x, bowl.y, bowl.width / 2, bowl.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bowl rim (darker)
    ctx.strokeStyle = '#2E5090';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(bowl.x, bowl.y - bowl.height / 3, bowl.width / 2, bowl.height / 6, 0, 0, Math.PI);
    ctx.stroke();
    
    // Food inside (if any)
    if (bowl.foodLevel > 0) {
      const foodHeight = (bowl.foodLevel / bowl.maxFood) * bowl.height / 2;
      ctx.fillStyle = CONFIG.FOOD_BOWL.FOOD_COLOR;
      ctx.beginPath();
      ctx.ellipse(
        bowl.x, 
        bowl.y - bowl.height / 4 + (bowl.height / 4 - foodHeight / 2), 
        bowl.width / 3, 
        foodHeight / 2, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }
    
    // Food level text (positioned to the left of the bowl)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.strokeText(Math.round(bowl.foodLevel) + '%', bowl.x - bowl.width / 2 - 5, bowl.y + 5);
    ctx.fillText(Math.round(bowl.foodLevel) + '%', bowl.x - bowl.width / 2 - 5, bowl.y + 5);
  }

  /**
   * Draw water bottle
   */
  drawWaterBottle(bottle) {
    const ctx = this.ctx;
    
    // Bottle body
    ctx.fillStyle = CONFIG.WATER_BOTTLE.COLOR;
    ctx.fillRect(
      bottle.x - bottle.width / 2,
      bottle.y - bottle.height / 2,
      bottle.width,
      bottle.height
    );
    
    // Bottle cap
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(
      bottle.x - bottle.width / 2 - 2,
      bottle.y - bottle.height / 2 - 8,
      bottle.width + 4,
      8
    );
    
    // Water inside
    if (bottle.waterLevel > 0) {
      const waterHeight = (bottle.waterLevel / bottle.maxWater) * bottle.height;
      ctx.fillStyle = CONFIG.WATER_BOTTLE.WATER_COLOR;
      ctx.fillRect(
        bottle.x - bottle.width / 2 + 2,
        bottle.y + bottle.height / 2 - waterHeight,
        bottle.width - 4,
        waterHeight - 2
      );
    }
    
    // Spout
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bottle.x, bottle.y + bottle.height / 2 + 5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Water level text (positioned to the right of the bottle)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.strokeText(Math.round(bottle.waterLevel) + '%', bottle.x + bottle.width / 2 + 5, bottle.y + 5);
    ctx.fillText(Math.round(bottle.waterLevel) + '%', bottle.x + bottle.width / 2 + 5, bottle.y + 5);
  }

  /**
   * Draw exercise wheel
   */
  drawWheel(wheel) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.translate(wheel.x, wheel.y);
    
    // Outer rim
    ctx.strokeStyle = CONFIG.WHEEL.COLOR;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, wheel.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner rim
    ctx.strokeStyle = CONFIG.WHEEL.SPOKE_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, wheel.radius - 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Spokes (rotating)
    ctx.rotate(wheel.rotation);
    ctx.strokeStyle = CONFIG.WHEEL.SPOKE_COLOR;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < CONFIG.WHEEL.SPOKES; i++) {
      const angle = (Math.PI * 2 / CONFIG.WHEEL.SPOKES) * i;
      const x1 = Math.cos(angle) * 10;
      const y1 = Math.sin(angle) * 10;
      const x2 = Math.cos(angle) * (wheel.radius - 15);
      const y2 = Math.sin(angle) * (wheel.radius - 15);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Center hub
    ctx.fillStyle = CONFIG.WHEEL.SPOKE_COLOR;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Status indicator
    if (wheel.isHamsterOn) {
      ctx.fillStyle = '#32CD32';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏃 Running!', wheel.x, wheel.y - wheel.radius - 10);
    }
  }

  /**
   * Draw tunnel/hideout
   */
  drawTunnel(tunnel) {
    const ctx = this.ctx;
    
    // Tunnel body (cylinder shape)
    ctx.fillStyle = CONFIG.TUNNEL.COLOR;
    ctx.fillRect(
      tunnel.x - tunnel.width / 2,
      tunnel.y - tunnel.height / 2,
      tunnel.width,
      tunnel.height
    );
    
    // Left entrance (dark circle)
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(
      tunnel.x - tunnel.width / 2,
      tunnel.y,
      CONFIG.TUNNEL.ENTRANCE_RADIUS,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Left entrance opening (darker)
    ctx.fillStyle = '#1a6b1a';
    ctx.beginPath();
    ctx.arc(
      tunnel.x - tunnel.width / 2,
      tunnel.y,
      CONFIG.TUNNEL.ENTRANCE_RADIUS - 5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Right entrance (dark circle)
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(
      tunnel.x + tunnel.width / 2,
      tunnel.y,
      CONFIG.TUNNEL.ENTRANCE_RADIUS,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Right entrance opening (darker)
    ctx.fillStyle = '#1a6b1a';
    ctx.beginPath();
    ctx.arc(
      tunnel.x + tunnel.width / 2,
      tunnel.y,
      CONFIG.TUNNEL.ENTRANCE_RADIUS - 5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Stripes on tunnel
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const x = tunnel.x - tunnel.width / 2 + (tunnel.width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, tunnel.y - tunnel.height / 2);
      ctx.lineTo(x, tunnel.y + tunnel.height / 2);
      ctx.stroke();
    }
    
    // Status indicator
    if (tunnel.hamsterInside) {
      ctx.fillStyle = '#FF69B4';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('😴 Hiding...', tunnel.x, tunnel.y - tunnel.height);
    }
  }

  /**
   * Render the hamster
   */
  renderHamster(hamster) {
    const ctx = this.ctx;
    
    // If hamster is hiding in tunnel, make it semi-transparent
    const isHiding = hamster.state === 'hiding';
    if (isHiding) {
      ctx.globalAlpha = 0.3;
    }
    
    ctx.save();
    
    // Translate to hamster position
    ctx.translate(hamster.x, hamster.y);
    
    // Flip horizontally if facing left
    if (!hamster.facingRight) {
      ctx.scale(-1, 1);
    }
    
    // Draw body (oval)
    ctx.fillStyle = hamster.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, hamster.width / 2, hamster.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw ears
    ctx.fillStyle = hamster.color;
    ctx.beginPath();
    ctx.arc(-hamster.width / 3, -hamster.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hamster.width / 3, -hamster.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eyes
    ctx.fillStyle = hamster.eyeColor;
    ctx.beginPath();
    ctx.arc(-hamster.width / 4, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hamster.width / 4, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw nose
    ctx.fillStyle = hamster.noseColor;
    ctx.beginPath();
    ctx.arc(0, 5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw feet (simple circles, animated)
    if (hamster.speed > 0.5) {
      const bounce = Math.sin(hamster.animationFrame) * 3;
      ctx.fillStyle = hamster.color;
      ctx.beginPath();
      ctx.arc(-hamster.width / 3, hamster.height / 2 + bounce, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hamster.width / 3, hamster.height / 2 - bounce, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    
    // Reset alpha
    ctx.globalAlpha = 1.0;
    
    // Draw state indicator (for debugging)
    if (CONFIG.GAME.DEBUG_MODE) {
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(hamster.state, hamster.x, hamster.y - 30);
    }
  }

  /**
   * Render UI elements
   */
  renderUI(hamster, environment) {
    const ctx = this.ctx;
    
    // Get labels based on language
    const lang = CONFIG.LANGUAGE;
    const labels = CONFIG.LABELS[lang];
    
    // Draw needs bars
    this.drawNeedsBar(labels.HUNGER, hamster.hunger, 10, 10, '#FF6347');
    this.drawNeedsBar(labels.THIRST, hamster.thirst, 10, 40, '#4682B4');
    this.drawNeedsBar(labels.ENERGY, 100 - hamster.tiredness, 10, 70, '#FFD700');
    this.drawNeedsBar(labels.HAPPY, hamster.happiness, 10, 100, '#32CD32');
    
    // Draw FPS
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('FPS: ' + Math.round(window.game?.fps || 0), CONFIG.CANVAS.WIDTH - 10, 20);
  }

  /**
   * Draw a needs bar
   */
  drawNeedsBar(label, value, x, y, color) {
    const ctx = this.ctx;
    const barWidth = 120;
    const barHeight = 16;
    
    // Label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y + 12);
    
    // Background
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x + 60, y, barWidth, barHeight);
    
    // Foreground (value)
    ctx.fillStyle = color;
    ctx.fillRect(x + 60, y, (barWidth * value) / 100, barHeight);
    
    // Border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 60, y, barWidth, barHeight);
  }

  /**
   * Render debug information
   */
  renderDebug(fps, hamster) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, CONFIG.CANVAS.HEIGHT - 100, 200, 90);
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${Math.round(fps)}`, 20, CONFIG.CANVAS.HEIGHT - 80);
    ctx.fillText(`Pos: ${Math.round(hamster.x)}, ${Math.round(hamster.y)}`, 20, CONFIG.CANVAS.HEIGHT - 65);
    ctx.fillText(`Speed: ${hamster.speed.toFixed(2)}`, 20, CONFIG.CANVAS.HEIGHT - 50);
    ctx.fillText(`State: ${hamster.state}`, 20, CONFIG.CANVAS.HEIGHT - 35);
    ctx.fillText(`Hunger: ${Math.round(hamster.hunger)}`, 20, CONFIG.CANVAS.HEIGHT - 20);
  }

  /**
   * Render pause overlay
   */
  renderPauseOverlay() {
    const ctx = this.ctx;
    const lang = CONFIG.LANGUAGE;
    const labels = CONFIG.LABELS[lang];
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    
    // Pause text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(labels.PAUSED, CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2);
    
    ctx.font = '20px Arial';
    ctx.fillText(labels.PRESS_SPACE, CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2 + 40);
  }
}

/**
 * For AI Learning Notes:
 * 
 * 1. SEPARATION OF CONCERNS:
 *    - Renderer only draws, doesn't update state
 *    - Game logic separate from rendering
 *    - Clean architecture
 * 
 * 2. CANVAS API:
 *    - fillRect, strokeRect for rectangles
 *    - arc for circles
 *    - ellipse for ovals
 *    - save/restore for transformations
 * 
 * 3. TRANSFORMATIONS:
 *    - translate() to move origin
 *    - scale() to flip sprite
 *    - Proper save/restore usage
 * 
 * 4. UI RENDERING:
 *    - Status bars
 *    - Text rendering
 *    - Debug information
 */
