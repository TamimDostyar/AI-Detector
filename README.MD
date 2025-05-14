# AI Text Detector

A tool for detecting whether text was written by AI or humans using machine learning techniques.

## ⚠️ IMPORTANT: Disk Space Issues Detected

Your system is critically low on disk space (100% used with only 129MB free). This is causing Docker I/O errors.

Before trying to build or run this project:

1. **Free up disk space**:
   - Empty your trash
   - Remove Docker images: `docker system prune -af --volumes`
   - Clean Homebrew cache: `brew cleanup -s`
   - Clean pip cache: `pip cache purge`
   - Check large files: `find ~ -type f -size +100M | xargs du -h | sort -rh | head -20`
   - Check large directories: `du -h ~/* | sort -rh | head -10`

2. **After freeing space**:
   - Restart Docker Desktop completely
   - Try building again with a simpler configuration

## Setup

### Using Docker (Recommended)

1. Install Docker and Docker Compose
2. Clone this repository
3. Run the application:

```bash
docker-compose up
```

4. Access Jupyter Lab at http://localhost:8888

### Local Installation

1. Clone this repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run Jupyter Lab:

```bash
jupyter lab
```

## Project Structure

- `/notebooks`: Jupyter notebooks for exploratory data analysis and model development
- `/data`: Data storage for datasets 

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
