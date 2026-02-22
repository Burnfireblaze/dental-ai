
  # AI-Assisted Dental Imaging App

  This is a code bundle for AI-Assisted Dental Imaging App. The original project is available at https://www.figma.com/design/ZwLzfCkdYxPyoJSkFUkped/AI-Assisted-Dental-Imaging-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## AI Inference Backend

  The FastAPI AI service lives in `backend/`.

  1. `cd backend`
  2. `python -m venv .venv && source .venv/bin/activate`
  3. `pip install -r requirements.txt`
  4. Place model weights in `backend/models`
  5. `uvicorn app.main:app --reload --port 8000`

  The frontend reads `VITE_AI_API_BASE_URL` from `.env` (default `http://localhost:8000`).

  Optional model overrides (environment variables):
  - `SEGMENTATION_MODEL_PATH`
  - `DETECTION_PRIMARY_MODEL_PATH`
  - `DETECTION_SECONDARY_MODEL_PATH`
  
