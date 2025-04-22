const { spawn } = require("child_process");
const path = require("path");

class PythonBridge {
  constructor() {
    this.pythonProcess = null;
    this.isRunning = false;
    this.port = 5000;
  }

  start() {
    if (this.isRunning) return;

    // Use system Python in development, bundled Python in production
    const pythonPath = "python";
    const scriptPath = path.join(__dirname, "../python/api.py");

    this.pythonProcess = spawn(pythonPath, [scriptPath], {
      env: { ...process.env, PORT: this.port.toString() }
    });

    this.pythonProcess.stdout.on("data", (data) => {
      console.log(`Python stdout: ${data}`);
    });

    this.pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    this.pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      this.isRunning = false;
    });

    this.isRunning = true;
  }

  stop() {
    if (!this.isRunning) return;
    if (this.pythonProcess) {
      if (process.platform === "win32") {
        this.pythonProcess.kill();
      } else {
        // Kill the entire process group on POSIX
        try {
          process.kill(-this.pythonProcess.pid, "SIGTERM");
        } catch (e) {
          this.pythonProcess.kill();
        }
      }
    }
    this.isRunning = false;
  }
}

module.exports = new PythonBridge();
