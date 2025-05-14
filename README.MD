# AI Text Detector

A web application for detecting whether text was written by AI or humans using machine learning models.

## Features

- Paste text or upload files for analysis
- Advanced ML model combines statistical and deep learning approaches
- Beautiful, responsive UI for all device sizes
- Real-time text analysis with confidence scores

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

### Option 1: Using Docker (Recommended)

1. Install Docker and Docker Compose
2. Clone this repository
3. Run the application:

```bash
docker-compose up
```

4. Access the web app at http://localhost:5000

### Option 2: Local Installation

1. Clone this repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask app:

```bash
python app.py
```

4. Access the web app at http://localhost:5000

## How It Works

The AI Text Detector uses a hybrid approach that combines:

1. Statistical ML model using TF-IDF features
2. Deep learning model based on neural networks
3. Combined probability scoring for optimal accuracy

## Project Structure

- `app.py`: Flask web application 
- `/templates`: HTML templates for the web interface
- `/notebooks`: Jupyter notebooks used for model development
- Model files:
  - `dl_model.keras`: Deep learning model
  - `stat_model.joblib`: Statistical model
  - `tfidf_vectorizer.joblib`: Text vectorizer
  - `tokenizer.pkl`: Text tokenizer

## Usage

1. Open the web application in your browser
2. Either paste text into the text area or upload a text file
3. Click "Analyze Text" to process
4. View the detection results showing whether the text was likely written by a human or AI

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
