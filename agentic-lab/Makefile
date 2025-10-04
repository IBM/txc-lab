# Environment setup
setup:
	python3 -m venv .ve
	. .ve/bin/activate && pip install -r requirements.txt
	cp .env.example .env
	cd frontend && npm install
	

# Database initialization
init-db:
	. .ve/bin/activate && [ ! -f bobverse.db ] || mv -f bobverse.db bobverse.db.bak && python3 init_sqlite_db.py --auto-login

# Run backend tests
test-backend:
	. .ve/bin/activate && export APP_ENV=test && \
	export JWT_SECRET_KEY=test-jwt-secret-key && \
	export SECRET_KEY=test-secret-key && \
	python -m pytest -v ./tests

# Run backend only
backend:
	. .ve/bin/activate && uvicorn bobverse.app:app --host 0.0.0.0 --port 8000 --reload

# Run frontend only
frontend:
	PORT=30402 && cd frontend && npm start

# Run both backend and frontend
start:
	@echo "Starting backend and frontend..."
	@trap 'kill 0' INT; \
	. .ve/bin/activate && uvicorn bobverse.app:app --host 0.0.0.0 --port 8000 --reload & \
	PORT=30402 && cd frontend && npm start & \
	wait

# Clean the project (remove database and other generated files)
clean:
	@echo "Cleaning project..."
	rm -f bobverse.db
	rm -f test_bobverse.db
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .pytest_cache -exec rm -rf {} +
