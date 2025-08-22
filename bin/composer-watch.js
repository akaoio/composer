#!/usr/bin/env node

/**
 * Composer Watch Service
 * Can run as a systemd service or standalone daemon
 */

const { Composer } = require('../dist/index.js')
const path = require('path')
const fs = require('fs')

// Parse command line arguments
const args = process.argv.slice(2)
const configPath = args.find(arg => !arg.startsWith('--')) || 'composer.config.js'
const daemonMode = args.includes('--daemon')
const pidFile = args.find(arg => arg.startsWith('--pid='))?.split('=')[1] || '/tmp/composer-watch.pid'
const logFile = args.find(arg => arg.startsWith('--log='))?.split('=')[1]

// Setup logging
const log = (message) => {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}`
  
  if (logFile) {
    fs.appendFileSync(logFile, logMessage + '\n')
  } else {
    console.log(logMessage)
  }
}

const error = (message) => {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ERROR: ${message}`
  
  if (logFile) {
    fs.appendFileSync(logFile, logMessage + '\n')
  } else {
    console.error(logMessage)
  }
}

// Write PID file for systemd
if (daemonMode) {
  fs.writeFileSync(pidFile, process.pid.toString())
  log(`Started composer-watch service with PID ${process.pid}`)
}

// Handle signals for graceful shutdown
let composer = null

const shutdown = (signal) => {
  log(`Received ${signal}, shutting down gracefully...`)
  
  if (composer) {
    composer.stop()
  }
  
  if (daemonMode && fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile)
  }
  
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGHUP', () => {
  log('Received SIGHUP, reloading configuration...')
  if (composer) {
    composer.stop()
    startWatcher()
  }
})

// Main watcher function
async function startWatcher() {
  try {
    // Load configuration
    const configFullPath = path.resolve(configPath)
    
    if (!fs.existsSync(configFullPath)) {
      error(`Config file not found: ${configFullPath}`)
      process.exit(1)
    }
    
    log(`Loading configuration from ${configFullPath}`)
    
    // Clear require cache for config reload
    delete require.cache[configFullPath]
    const config = require(configFullPath)
    
    // Create composer instance
    composer = new Composer({
      dataPath: config.dataPath || './data',
      templatesPath: config.templatesPath || './templates',
      outputPath: config.outputPath || './output',
      particlesPath: config.particlesPath,
      componentsPath: config.componentsPath,
      documentsPath: config.documentsPath,
      debounceMs: config.debounceMs || 1000
    })
    
    // Initial build
    log('Performing initial build...')
    const outputs = await composer.render()
    log(`Initial build complete: ${outputs.size} documents generated`)
    
    // Start watching
    composer.watch((outputs) => {
      log(`Rebuild complete: ${outputs.size} documents generated`)
      
      // Optional: Send notification or trigger webhook
      if (config.onRebuild) {
        try {
          config.onRebuild(outputs)
        } catch (err) {
          error(`Error in onRebuild callback: ${err.message}`)
        }
      }
    })
    
    log('Watch service started successfully')
    
    // Keep the process alive
    if (daemonMode) {
      // In daemon mode, just wait for signals
      setInterval(() => {
        // Heartbeat - can be used for health checks
        if (fs.existsSync(pidFile)) {
          fs.utimesSync(pidFile, new Date(), new Date())
        }
      }, 30000) // Update PID file timestamp every 30 seconds
    }
    
  } catch (err) {
    error(`Failed to start watcher: ${err.message}`)
    process.exit(1)
  }
}

// Start the service
startWatcher()

// Health check endpoint (optional)
if (args.includes('--health-check')) {
  const http = require('http')
  const port = args.find(arg => arg.startsWith('--port='))?.split('=')[1] || 3001
  
  http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        status: 'healthy',
        pid: process.pid,
        uptime: process.uptime(),
        watching: composer ? true : false
      }))
    } else {
      res.writeHead(404)
      res.end()
    }
  }).listen(port, () => {
    log(`Health check endpoint available at http://localhost:${port}/health`)
  })
}