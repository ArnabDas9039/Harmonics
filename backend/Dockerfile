FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# RUN python manage.py migrate
RUN python manage.py collectstatic --noinput

# Expose the port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "backend.asgi:application", "--host", "0.0.0.0", "--port", "8080"]