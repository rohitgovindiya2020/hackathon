#!/bin/bash

echo "🧹 Cleaning up ports 3000 and 8000..."

# Kill process on port 8000 (Backend)
if lsof -t -i:8000 >/dev/null; then
    echo "Killing process on port 8000..."
    lsof -t -i:8000 | xargs kill -9
    echo "✅ Port 8000 is now free."
else
    echo "✅ Port 8000 was already free."
fi

# Kill process on port 3000 (Frontend)
if lsof -t -i:3000 >/dev/null; then
    echo "Killing process on port 3000..."
    lsof -t -i:3000 | xargs kill -9
    echo "✅ Port 3000 is now free."
else
    echo "✅ Port 3000 was already free."
fi

echo "------------------------------------------------"
echo "🎉 Ports are clean! You can now start your servers:"
echo "1. Backend: php artisan serve --host=0.0.0.0 --port=8000"
echo "2. Frontend: npm start"
