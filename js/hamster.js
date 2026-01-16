/**
 * Hamster Entity
 * 
 * Represents the virtual hamster with movement, behavior, and needs.
 * 
 * For AI Learning:
 * - Object-oriented design pattern
 * - State machine for behaviors
 * - Autonomous AI movement
 * - Needs system (hunger, thirst, energy)
 */

class Hamster {
  constructor(x, y) {
    // Position
    this.x = x;
    this.y = y;
    
    // Velocity
    this.vx = 0;
    this.vy = 0;
    
    // Size
    this.width = CONFIG.HAMSTER.WIDTH;
    this.height = CONFIG.HAMSTER.HEIGHT;
    
    // Appearance
    this.color = CONFIG.HAMSTER.DEFAULT_COLOR;
    this.eyeColor = CONFIG.HAMSTER.EYE_COLOR;
    this.noseColor = CONFIG.HAMSTER.NOSE_COLOR;
    
    // Movement state
    this.direction = 0; // Angle in radians
    this.speed = 0;
    this.targetSpeed = CONFIG.HAMSTER.SPEED;
    
    // Behavior state
    this.state = 'idle'; // idle, walking, eating, drinking, sleeping
    this.stateTimer = 0;
    
    // Needs (0-100, higher = more need)
    this.hunger = 0;
    this.thirst = 0;
    this.tiredness = 0;
    this.happiness = 100;
    
    // Animation
    this.animationFrame = 0;
    this.animationSpeed = 0.1;
    
    // Facing direction (for sprite flip)
    this.facingRight = true;
    
    // Tube transition cooldown (prevents rapid bouncing)
    this.tubeCooldown = 0;
    
    console.log('🐹 Hamster created at', x, y);
  }

  /**
   * Update hamster state
   * 
   * @param {number} deltaTime - Time since last frame
   * @param {Environment} environment - Game environment
   */
  update(deltaTime, environment) {
    // Update needs
    this.updateNeeds(deltaTime);
    
    // Update behavior state
    this.updateBehavior(deltaTime, environment);
    
    // Update movement
    this.updateMovement(deltaTime);
    
    // Decrease tube cooldown
    if (this.tubeCooldown > 0) {
      this.tubeCooldown--;
    }
    
    // Keep within cage boundaries
    this.constrainToCage();
    
    // Update animation
    this.updateAnimation(deltaTime);
  }

  /**
   * Update hamster needs (hunger, thirst, tiredness)
   */
  updateNeeds(deltaTime) {
    // Increase needs over time
    this.hunger = Math.min(100, this.hunger + CONFIG.HAMSTER.HUNGER_RATE * deltaTime);
    this.thirst = Math.min(100, this.thirst + CONFIG.HAMSTER.THIRST_RATE * deltaTime);
    this.tiredness = Math.min(100, this.tiredness + CONFIG.HAMSTER.ENERGY_RATE * deltaTime);
    
    // Happiness decreases if needs are high
    const averageNeed = (this.hunger + this.thirst + this.tiredness) / 3;
    if (averageNeed > 50) {
      this.happiness = Math.max(0, this.happiness - 0.01 * deltaTime);
    } else {
      this.happiness = Math.min(100, this.happiness + 0.005 * deltaTime);
    }
  }

  /**
   * Update behavior state machine
   */
  updateBehavior(deltaTime, environment) {
    // Decrease state timer
    this.stateTimer = Math.max(0, this.stateTimer - deltaTime);
    
    // If timer expired, choose new behavior
    if (this.stateTimer <= 0) {
      this.chooseBehavior(environment);
    }
    
    // Execute current behavior
    switch (this.state) {
      case 'idle':
        this.behaviorIdle();
        break;
      case 'walking':
        this.behaviorWalking();
        break;
      case 'exploring':
        this.behaviorExploring();
        break;
      case 'eating':
        this.behaviorEating(environment);
        break;
      case 'drinking':
        this.behaviorDrinking(environment);
        break;
      case 'sleeping':
        this.behaviorSleeping();
        break;
      case 'playing':
        this.behaviorPlaying(environment);
        break;
      case 'hiding':
        this.behaviorHiding(environment);
        break;
    }
  }

  /**
   * Choose next behavior based on needs and random chance
   */
  chooseBehavior(environment) {
    // High priority: satisfy urgent needs (lowered thresholds from 70 to 40)
    if (this.hunger > 40 && environment?.foodBowl?.hasFood()) {
      this.setState('eating', 3000);
      return;
    }
    
    if (this.thirst > 40 && environment?.waterBottle?.hasWater()) {
      this.setState('drinking', 3000);
      return;
    }
    
    if (this.tiredness > 60) {
      this.setState('sleeping', 5000);
      return;
    }
    
    // Medium priority: use wheel if energetic
    if (this.tiredness < 30 && Math.random() < 0.15 && environment?.wheel) {
      this.setState('playing', Utils.random(3000, 6000));
      return;
    }
    
    // Low priority: hide in tunnel occasionally
    if (Math.random() < 0.1 && environment?.tunnel) {
      this.setState('hiding', Utils.random(4000, 8000));
      return;
    }
    
    // Explore other cages through tubes (20% chance, reduced from 30%)
    if (Math.random() < 0.2) {
      this.setState('exploring', Utils.random(3000, 7000));
      this.chooseRandomTubeDestination();
      return;
    }
    
    // Random behavior
    const rand = Math.random();
    
    if (rand < 0.3) {
      // 30% chance to walk
      this.setState('walking', Utils.random(2000, 5000));
      this.chooseRandomDirection();
    } else if (rand < 0.5) {
      // 20% chance to idle
      this.setState('idle', Utils.random(1000, 3000));
    } else {
      // 50% chance to continue walking
      this.setState('walking', Utils.random(2000, 5000));
      this.chooseRandomDirection();
    }
  }

  /**
   * Set behavior state
   */
  setState(state, duration) {
    this.state = state;
    this.stateTimer = duration;
  }

  /**
   * Behavior: Idle (standing still)
   */
  behaviorIdle() {
    // Slow down to stop
    this.targetSpeed = 0;
  }

  /**
   * Behavior: Walking around
   */
  behaviorWalking() {
    this.targetSpeed = CONFIG.HAMSTER.SPEED;
    
    // Occasionally change direction slightly
    if (Math.random() < CONFIG.HAMSTER.DIRECTION_CHANGE_CHANCE) {
      this.direction += Utils.random(-0.5, 0.5);
    }
  }

  /**
   * Behavior: Exploring - seeking tubes to visit other cages
   */
  behaviorExploring() {
    if (!this.tubeTarget) {
      this.chooseRandomTubeDestination();
    }
    
    // Move towards tube entrance
    const dx = this.tubeTarget.x - this.x;
    const dy = this.tubeTarget.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 30) {
      this.direction = Math.atan2(dy, dx);
      this.targetSpeed = CONFIG.HAMSTER.SPEED;
    } else {
      // Reached tube area, switch to walking
      this.setState('walking', Utils.random(2000, 4000));
      this.chooseRandomDirection();
    }
  }

  /**
   * Choose a random tube entrance to explore
   */
  chooseRandomTubeDestination() {
    const tubes = [
      { x: 350, y: 325, name: 'main-to-upper-left' },
      { x: 650, y: 325, name: 'main-to-upper-right' },
      { x: 350, y: 550, name: 'main-to-lower-left' },
      { x: 650, y: 550, name: 'main-to-lower-right' },
      { x: 400, y: 225, name: 'upper-left-to-upper-right' },
      { x: 400, y: 525, name: 'lower-left-to-lower-right' }
    ];
    
    this.tubeTarget = tubes[Math.floor(Math.random() * tubes.length)];
  }

  /**
   * Behavior: Eating from food bowl
   */
  behaviorEating(environment) {
    // Move towards food bowl
    if (environment?.foodBowl) {
      const bowl = environment.foodBowl;
      const dx = bowl.x - this.x;
      const dy = bowl.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 50) {
        // Move towards bowl
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        // At bowl, eat
        this.targetSpeed = 0;
        if (bowl.eat()) {
          this.hunger = Math.max(0, this.hunger - 0.5);
        }
      }
    }
  }

  /**
   * Behavior: Drinking from water bottle
   */
  behaviorDrinking(environment) {
    // Similar to eating
    if (environment?.waterBottle) {
      const bottle = environment.waterBottle;
      const dx = bottle.x - this.x;
      const dy = bottle.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 50) {
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        this.targetSpeed = 0;
        if (bottle.drink()) {
          this.thirst = Math.max(0, this.thirst - 0.3);
        }
      }
    }
  }

  /**
   * Behavior: Sleeping
   */
  behaviorSleeping() {
    this.targetSpeed = 0;
    this.tiredness = Math.max(0, this.tiredness - 0.05);
  }

  /**
   * Behavior: Playing on wheel
   */
  behaviorPlaying(environment) {
    if (environment?.wheel) {
      const wheel = environment.wheel;
      const dx = wheel.x - this.x;
      const dy = wheel.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > wheel.radius - 10) {
        // Move towards wheel
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        // On wheel, run in circle
        this.targetSpeed = CONFIG.HAMSTER.SPEED * 1.5;
        this.direction += 0.1; // Run in circle
        
        // Keep hamster on wheel perimeter
        const angle = Math.atan2(this.y - wheel.y, this.x - wheel.x);
        this.x = wheel.x + Math.cos(angle) * (wheel.radius - 20);
        this.y = wheel.y + Math.sin(angle) * (wheel.radius - 20);
      }
    }
  }

  /**
   * Behavior: Hiding in tunnel
   */
  behaviorHiding(environment) {
    if (environment?.tunnel) {
      const tunnel = environment.tunnel;
      const dx = tunnel.x - this.x;
      const dy = tunnel.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 30) {
        // Move towards tunnel
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        // Inside tunnel, stay still
        this.targetSpeed = 0;
        this.x = tunnel.x;
        this.y = tunnel.y;
      }
    }
  }

  /**
   * Choose a random direction to walk
   */
  chooseRandomDirection() {
    this.direction = Utils.random(0, Math.PI * 2);
  }

  /**
   * Update movement based on velocity
   */
  updateMovement(deltaTime) {
    // Smoothly accelerate/decelerate to target speed
    const speedDiff = this.targetSpeed - this.speed;
    this.speed += speedDiff * CONFIG.HAMSTER.ACCELERATION;
    
    // Apply friction
    this.speed *= CONFIG.HAMSTER.FRICTION;
    
    // Calculate velocity from direction and speed
    this.vx = Math.cos(this.direction) * this.speed;
    this.vy = Math.sin(this.direction) * this.speed;
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Update facing direction
    if (Math.abs(this.vx) > 0.1) {
      this.facingRight = this.vx > 0;
    }
  }

  /**
   * Keep hamster within cage boundaries (multiple cages)
   */
  /**
   * Keep hamster within cage boundaries (5 compact cages)
   */
  constrainToCage() {
    // First check if in a tube transition - if so, skip boundary checks
    if (this.checkTubeTransitions()) {
      return; // Tube transition handled, skip boundary constraints
    }
    
    // Determine which cage hamster is in based on position
    let minX, maxX, minY, maxY;
    let cageName = 'main';
    
    // Main cage (center) - 350,350 to 650,550
    if (this.x >= 330 && this.x <= 670 && this.y >= 330 && this.y <= 570) {
      minX = 350 + this.width / 2;
      maxX = 650 - this.width / 2;
      minY = 350 + this.height / 2;
      maxY = 550 - this.height / 2;
      cageName = 'main';
    }
    // Upper left - 200,150 to 400,300
    else if (this.x >= 180 && this.x <= 420 && this.y >= 130 && this.y <= 320) {
      minX = 200 + this.width / 2;
      maxX = 400 - this.width / 2;
      minY = 150 + this.height / 2;
      maxY = 300 - this.height / 2;
      cageName = 'upper-left';
    }
    // Upper right - 600,150 to 800,300
    else if (this.x >= 580 && this.x <= 820 && this.y >= 130 && this.y <= 320) {
      minX = 600 + this.width / 2;
      maxX = 800 - this.width / 2;
      minY = 150 + this.height / 2;
      maxY = 300 - this.height / 2;
      cageName = 'upper-right';
    }
    // Lower left - 200,450 to 400,600
    else if (this.x >= 180 && this.x <= 420 && this.y >= 430 && this.y <= 620) {
      minX = 200 + this.width / 2;
      maxX = 400 - this.width / 2;
      minY = 450 + this.height / 2;
      maxY = 600 - this.height / 2;
      cageName = 'lower-left';
    }
    // Lower right - 600,450 to 800,600
    else if (this.x >= 580 && this.x <= 820 && this.y >= 430 && this.y <= 620) {
      minX = 600 + this.width / 2;
      maxX = 800 - this.width / 2;
      minY = 450 + this.height / 2;
      maxY = 600 - this.height / 2;
      cageName = 'lower-right';
    }
    // If outside all cages, teleport to main cage
    else {
      this.x = 500;
      this.y = 450;
      return;
    }
    
    // Bounce off walls (but not in tube zones)
    if (this.x < minX) {
      this.x = minX;
      this.direction = Math.PI - this.direction;
    }
    if (this.x > maxX) {
      this.x = maxX;
      this.direction = Math.PI - this.direction;
    }
    if (this.y < minY) {
      this.y = minY;
      this.direction = -this.direction;
    }
    if (this.y > maxY) {
      this.y = maxY;
      this.direction = -this.direction;
    }
  }
  
  /**
   * Check if hamster is in a tube and handle transitions
   * Returns true if a transition occurred (to skip boundary checks)
   */
  checkTubeTransitions() {
    // Skip if on cooldown (prevents rapid bouncing)
    if (this.tubeCooldown > 0) {
      return false;
    }
    
    const tubeWidth = 60;  // Wider detection zone
    const tubeHeight = 60;
    let transitioned = false;
    
    // Vertical tubes - Main to Upper Left
    if (this.x >= 320 && this.x <= 380 && this.y >= 300 && this.y <= 360) {
      if (this.y < 330) {
        // Going up to upper left
        this.x = 350;
        this.y = 280;  // Further into destination cage
        this.direction = -Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED; // Maintain speed
        this.tubeCooldown = 30; // 0.5 second cooldown at 60fps
        transitioned = true;
      } else if (this.y > 330) {
        // Coming down from upper left
        this.x = 350;
        this.y = 370;  // Further into destination cage
        this.direction = Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
    }
    
    // Vertical tubes - Main to Upper Right
    if (this.x >= 620 && this.x <= 680 && this.y >= 300 && this.y <= 360) {
      if (this.y < 330) {
        // Going up to upper right
        this.x = 650;
        this.y = 280;
        this.direction = -Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      } else if (this.y > 330) {
        // Coming down from upper right
        this.x = 650;
        this.y = 370;
        this.direction = Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
    }
    
    // Vertical tubes - Main to Lower Left
    if (this.x >= 320 && this.x <= 380 && this.y >= 530 && this.y <= 590) {
      if (this.y > 560) {
        // Going down to lower left
        this.x = 350;
        this.y = 470;
        this.direction = Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      } else if (this.y < 560) {
        // Coming up from lower left
        this.x = 350;
        this.y = 530;
        this.direction = -Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
    }
    
    // Vertical tubes - Main to Lower Right
    if (this.x >= 620 && this.x <= 680 && this.y >= 530 && this.y <= 590) {
      if (this.y > 560) {
        // Going down to lower right
        this.x = 650;
        this.y = 470;
        this.direction = Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      } else if (this.y < 560) {
        // Coming up from lower right
        this.x = 650;
        this.y = 530;
        this.direction = -Math.PI / 2;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
    }
    
    // Horizontal tube - Upper cages (wider zone)
    if (this.y >= 195 && this.y <= 255) {
      if (this.x >= 380 && this.x <= 420 && this.x < 400) {
        // Left side, go right
        this.x = 620;  // Further into destination
        this.y = 225;
        this.direction = 0;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
      else if (this.x >= 580 && this.x <= 620 && this.x > 600) {
        // Right side, go left
        this.x = 380;  // Further into destination
        this.y = 225;
        this.direction = Math.PI;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
    }
    
    // Horizontal tube - Lower cages (wider zone)
    if (this.y >= 495 && this.y <= 555) {
      if (this.x >= 380 && this.x <= 420 && this.x < 400) {
        // Left side, go right
        this.x = 620;  // Further into destination
        this.y = 525;
        this.direction = 0;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
      else if (this.x >= 580 && this.x <= 620 && this.x > 600) {
        // Right side, go left
        this.x = 380;  // Further into destination
        this.y = 525;
        this.direction = Math.PI;
        this.speed = CONFIG.HAMSTER.SPEED;
        this.tubeCooldown = 30;
        transitioned = true;
      }
    }
    
    return transitioned;
  }

  /**
   * Update animation frame
   */
  updateAnimation(deltaTime) {
    if (this.speed > 0.5) {
      this.animationFrame += this.animationSpeed * deltaTime / 16;
      if (this.animationFrame > 4) {
        this.animationFrame = 0;
      }
    } else {
      this.animationFrame = 0;
    }
  }

  /**
   * Reset hamster to initial state
   */
  reset() {
    this.x = 500; // Center of main cage
    this.y = 450; // Main cage center
    this.vx = 0;
    this.vy = 0;
    this.speed = 0;
    this.hunger = 0;
    this.thirst = 0;
    this.tiredness = 0;
    this.happiness = 100;
    this.state = 'idle';
    this.stateTimer = 1000;
    
    console.log('🔄 Hamster reset');
  }

  /**
   * Get hamster bounding box for collision detection
   */
  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

/**
 * For AI Learning Notes:
 * 
 * 1. STATE MACHINE PATTERN:
 *    - Different behaviors (idle, walking, eating, etc.)
 *    - State transitions based on conditions
 *    - Timer-based state duration
 * 
 * 2. AUTONOMOUS AI:
 *    - Hamster makes own decisions
 *    - Based on needs (hunger, thirst)
 *    - Random behavior for variety
 * 
 * 3. SMOOTH MOVEMENT:
 *    - Acceleration/deceleration
 *    - Friction for natural slowdown
 *    - Direction-based velocity
 * 
 * 4. BOUNDARY COLLISION:
 *    - Constrain to cage
 *    - Bounce off walls
 *    - Reflection physics
 * 
 * 5. NEEDS SYSTEM:
 *    - Gradual increase over time
 *    - Affects behavior choices
 *    - Happiness based on needs
 */
