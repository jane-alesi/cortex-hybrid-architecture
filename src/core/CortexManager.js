/**
 * CortexManager - Main orchestration for Cortex Hybrid Architecture
 * Revolutionary AGI Memory Management System
 * 
 * @author Jane Alesi <ja@satware.ai>
 * @version 3.0.0
 * @license MIT
 */

const L0Bootstrap = require('./L0Bootstrap');
const L1Repository = require('./L1Repository');
const EntityManager = require('./EntityManager');
const LRUCache = require('../cache/LRUCache');
const HealthMonitor = require('../utils/HealthMonitor');

class CortexManager {
  constructor(config = {}) {
    this.config = {
      l0MaxSize: config.l0MaxSize || '5MB',
      l1Repository: config.l1Repository || 'jane-alesi/private-mw',
      cacheStrategy: config.cacheStrategy || 'LRU',
      cacheSize: config.cacheSize || 100,
      compression: config.compression || 'gzip',
      backupInterval: config.backupInterval || '1h',
      ...config
    };

    this.l0Bootstrap = new L0Bootstrap(this.config);
    this.l1Repository = new L1Repository(this.config);
    this.entityManager = new EntityManager(this.config);
    this.cache = new LRUCache(this.config.cacheSize);
    this.healthMonitor = new HealthMonitor(this.config);
    
    this.initialized = false;
    this.performance = {
      memoryReduction: 0,
      speedImprovement: 0,
      compressionRatio: 0,
      entitiesTransferred: 0
    };
  }

  /**
   * Initialize Cortex Hybrid Architecture
   * Implements the revolutionary L0/L1 bootstrap protocol
   */
  async initialize() {
    const startTime = Date.now();
    
    try {
      // Phase 1: L0 Bootstrap Protocol
      console.log('🧠 Initializing Cortex Hybrid Architecture v3.0...');
      await this.l0Bootstrap.initialize();
      
      // Phase 2: L1 Repository Connection
      console.log('🔗 Connecting to L1 Repository...');
      await this.l1Repository.connect();
      
      // Phase 3: Entity Manager Setup
      console.log('📊 Setting up Entity Manager...');
      await this.entityManager.initialize(this.l0Bootstrap, this.l1Repository);
      
      // Phase 4: Performance Monitoring
      console.log('📈 Starting Health Monitor...');
      await this.healthMonitor.start();
      
      const initTime = Date.now() - startTime;
      this.performance.speedImprovement = this.calculateSpeedImprovement(initTime);
      
      this.initialized = true;
      console.log(`✅ Cortex initialized in ${initTime}ms (${this.performance.speedImprovement}x faster)`);
      
      return {
        success: true,
        initializationTime: initTime,
        performance: this.performance,
        status: 'READY'
      };
    } catch (error) {
      console.error('❌ Cortex initialization failed:', error);
      throw new Error(`Cortex initialization failed: ${error.message}`);
    }
  }

  /**
   * Get entity with lazy loading and intelligent caching
   * Implements the revolutionary hybrid memory access pattern
   */
  async getEntity(entityName) {
    if (!this.initialized) {
      throw new Error('Cortex not initialized. Call initialize() first.');
    }

    // Check L0 Bootstrap for lightweight reference
    const lightweightRef = await this.l0Bootstrap.getLightweightReference(entityName);
    
    if (!lightweightRef) {
      throw new Error(`Entity '${entityName}' not found in L0 Bootstrap`);
    }

    // Check cache first
    const cacheKey = `entity:${entityName}`;
    if (this.cache.has(cacheKey)) {
      this.healthMonitor.recordCacheHit();
      return this.cache.get(cacheKey);
    }

    // Lazy load from L1 Repository
    const fullEntity = await this.l1Repository.getEntity(lightweightRef.fileReference);
    
    // Cache for future access
    this.cache.set(cacheKey, fullEntity);
    this.healthMonitor.recordCacheMiss();
    
    return fullEntity;
  }

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics() {
    return {
      ...this.performance,
      cacheStats: this.cache.getStats(),
      healthMetrics: this.healthMonitor.getMetrics(),
      l0Size: this.l0Bootstrap.getSize(),
      l1Size: this.l1Repository.getSize(),
      timestamp: new Date().toISOString()
    };
  }

  // Private helper methods
  calculateSpeedImprovement(initTime) {
    const baselineTime = 3000; // 3 seconds baseline
    return Math.round(baselineTime / initTime * 10) / 10;
  }
}

module.exports = CortexManager;