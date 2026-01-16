/**
 * Environment
 * 
 * Manages the cage and all interactive objects (food bowl, water bottle, toys).
 * 
 * For AI Learning:
 * - Object composition pattern
 * - Interactive game objects
 * - Resource management
 */

class Environment {
  constructor() {
    // Create interactive objects
    this.foodBowl = new FoodBowl();
    this.waterBottle = new WaterBottle();
    this.wheel = new ExerciseWheel();
    this.tunnel = new Tunnel();
    
    console.log('🏠 Environment created');
  }

  /**
   * Update environment objects
   */
  update(deltaTime, hamster) {
    this.foodBowl.update(deltaTime);
    this.waterBottle.update(deltaTime);
    this.wheel.update(deltaTime, hamster);
    this.tunnel.update(deltaTime, hamster);
  }

  /**
   * Reset environment to initial state
   */
  reset() {
    this.foodBowl.reset();
    this.waterBottle.reset();
    this.wheel.reset();
    this.tunnel.reset();
    console.log('🔄 Environment reset');
  }
}

/**
 * Food Bowl
 * Interactive object that hamster can eat from
 */
class FoodBowl {
  constructor() {
    this.x = CONFIG.FOOD_BOWL.X;
    this.y = CONFIG.FOOD_BOWL.Y;
    this.width = CONFIG.FOOD_BOWL.WIDTH;
    this.height = CONFIG.FOOD_BOWL.HEIGHT;
    this.foodLevel = CONFIG.FOOD_BOWL.MAX_FOOD;
    this.maxFood = CONFIG.FOOD_BOWL.MAX_FOOD;
  }

  /**
   * Update food bowl
   */
  update(deltaTime) {
    // Food could decay over time (optional)
  }

  /**
   * Add food to bowl
   */
  feed() {
    this.foodLevel = Math.min(this.maxFood, this.foodLevel + CONFIG.FOOD_BOWL.FEED_AMOUNT);
    console.log('🍽️ Food added, level:', Math.round(this.foodLevel));
  }

  /**
   * Hamster eats from bowl
   * @returns {boolean} True if food was consumed
   */
  eat() {
    if (this.foodLevel > 0) {
      this.foodLevel = Math.max(0, this.foodLevel - CONFIG.FOOD_BOWL.EAT_AMOUNT);
      return true;
    }
    return false;
  }

  /**
   * Check if bowl has food
   */
  hasFood() {
    return this.foodLevel > 10;
  }

  /**
   * Reset to full
   */
  reset() {
    this.foodLevel = this.maxFood;
  }

  /**
   * Get bounding box for click detection
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
 * Water Bottle
 * Interactive object that hamster can drink from
 */
class WaterBottle {
  constructor() {
    this.x = CONFIG.WATER_BOTTLE.X;
    this.y = CONFIG.WATER_BOTTLE.Y;
    this.width = CONFIG.WATER_BOTTLE.WIDTH;
    this.height = CONFIG.WATER_BOTTLE.HEIGHT;
    this.waterLevel = CONFIG.WATER_BOTTLE.MAX_WATER;
    this.maxWater = CONFIG.WATER_BOTTLE.MAX_WATER;
  }

  /**
   * Update water bottle
   */
  update(deltaTime) {
    // Water could evaporate over time (optional)
  }

  /**
   * Fill water bottle
   */
  fill() {
    this.waterLevel = Math.min(this.maxWater, this.waterLevel + CONFIG.WATER_BOTTLE.FILL_AMOUNT);
    console.log('💧 Water filled, level:', Math.round(this.waterLevel));
  }

  /**
   * Hamster drinks from bottle
   * @returns {boolean} True if water was consumed
   */
  drink() {
    if (this.waterLevel > 0) {
      this.waterLevel = Math.max(0, this.waterLevel - CONFIG.WATER_BOTTLE.DRINK_AMOUNT);
      return true;
    }
    return false;
  }

  /**
   * Check if bottle has water
   */
  hasWater() {
    return this.waterLevel > 10;
  }

  /**
   * Reset to full
   */
  reset() {
    this.waterLevel = this.maxWater;
  }

  /**
   * Get bounding box for click detection
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
 * 1. COMPOSITION PATTERN:
 *    - Environment contains multiple objects
 *    - Each object is independent
 *    - Easy to add new objects
 * 
 * 2. RESOURCE MANAGEMENT:
 *    - Food/water levels
 *    - Consumption and replenishment
 *    - Max capacity limits
 * 
 * 3. INTERACTIVE OBJECTS:
 *    - Click detection via getBounds()
 *    - State changes (feed, fill)
 *    - Feedback to game logic
 * 
 * 4. ENCAPSULATION:
 *    - Each object manages own state
 *    - Clear public interface
 *    - Internal logic hidden
 */

/**
 * Exercise Wheel
 * Interactive toy that hamster can run on
 */
class ExerciseWheel {
  constructor() {
    this.x = CONFIG.WHEEL.X;
    this.y = CONFIG.WHEEL.Y;
    this.radius = CONFIG.WHEEL.RADIUS;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.isHamsterOn = false;
  }

  /**
   * Update wheel rotation
   */
  update(deltaTime, hamster) {
    // Check if hamster is on the wheel
    const distance = Utils.distance(hamster.x, hamster.y, this.x, this.y);
    this.isHamsterOn = distance < this.radius;
    
    // Spin wheel if hamster is on it
    if (this.isHamsterOn && hamster.speed > 0.5) {
      this.rotationSpeed = CONFIG.WHEEL.ROTATION_SPEED * hamster.speed;
      
      // Reduce hamster tiredness when exercising
      hamster.tiredness = Math.max(0, hamster.tiredness - 0.02);
      hamster.happiness = Math.min(100, hamster.happiness + 0.01);
    } else {
      // Slow down wheel
      this.rotationSpeed *= 0.95;
    }
    
    // Update rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation > Math.PI * 2) {
      this.rotation -= Math.PI * 2;
    }
  }

  /**
   * Reset wheel
   */
  reset() {
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.isHamsterOn = false;
  }

  /**
   * Get bounding box for collision detection
   */
  getBounds() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }

  /**
   * Check if point is inside wheel (circular collision)
   */
  containsPoint(x, y) {
    return Utils.distance(x, y, this.x, this.y) <= this.radius;
  }
}

/**
 * Tunnel/Hideout
 * A place where hamster can hide and rest
 */
class Tunnel {
  constructor() {
    this.x = CONFIG.TUNNEL.X;
    this.y = CONFIG.TUNNEL.Y;
    this.width = CONFIG.TUNNEL.WIDTH;
    this.height = CONFIG.TUNNEL.HEIGHT;
    this.hamsterInside = false;
    this.hideTimer = 0;
  }

  /**
   * Update tunnel state
   */
  update(deltaTime, hamster) {
    // Check if hamster is inside tunnel
    const distance = Utils.distance(hamster.x, hamster.y, this.x, this.y);
    
    if (distance < this.width / 2 && hamster.state === 'hiding') {
      this.hamsterInside = true;
      this.hideTimer += deltaTime;
      
      // Hamster is hidden, reduce stress and increase happiness
      hamster.happiness = Math.min(100, hamster.happiness + 0.02);
      
      // Keep hamster centered in tunnel
      hamster.x = this.x;
      hamster.y = this.y;
      hamster.speed = 0;
    } else {
      this.hamsterInside = false;
    }
  }

  /**
   * Reset tunnel
   */
  reset() {
    this.hamsterInside = false;
    this.hideTimer = 0;
  }

  /**
   * Get bounding box
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
