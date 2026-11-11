FROM node:20-bookworm-slim

# Install Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Configure Python environment
COPY requirements.txt ./

RUN python3 -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --no-cache-dir -r requirements.txt

# Verify Python installation
RUN python --version && pip --version

# Copy application
COPY . .

# Verify required files
RUN test -f /app/server.js \
    && test -f /app/predict.py \
    && test -f /app/heart_disease_model.pkl \
    && test -f /app/index.html

EXPOSE 10000

CMD ["node", "server.js"]