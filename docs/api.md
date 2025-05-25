# API Reference: Decision Insight Analyzer

## Overview
This document describes the main API endpoints and data models used in the application.

---

## Endpoints

### POST /api/decisions
- **Description:** Create a new decision entry
- **Request Body:**
  ```json
  {
    "situation_text": "Describe the situation...",
    "decision_text": "Describe your decision...",
    "reasoning_text": "Describe your reasoning..."
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "situation_text": "...",
    "decision_text": "...",
    "reasoning_text": "...",
    "status": "draft|finalized",
    "created_at": "timestamp",
    "analysis_result": {
      "category": "string",
      "explanation": "string",
      "cognitiveDistortions": ["string", ...],
      "missedAlternatives": ["string", ...]
    }
  }
  ```

### GET /api/decisions/[id]
- **Description:** Get a decision by ID
- **Response:** Same as above

### PATCH /api/decisions/[id]
- **Description:** Update a decision
- **Request Body:** Partial fields to update

### GET /api/user-decisions
- **Description:** List all decisions for the authenticated user

### GET /api/user-decisions/summary
- **Description:** Get a summary of user decisions

---

## Data Models

### Decision
- `id`: uuid
- `user_id`: uuid
- `situation_text`: string
- `decision_text`: string
- `reasoning_text`: string
- `status`: string (default: 'draft')
- `created_at`: timestamp
- `analysis_result`: object (see below)

#### analysis_result (AI Analysis Result)
- `category`: string — The type or category of decision (e.g., "Personal", "Work", "Health").
- `explanation`: string — AI-generated explanation or feedback about the decision and reasoning.
- `cognitiveDistortions`: string[] — List of cognitive distortions detected in the reasoning (e.g., "All-or-Nothing Thinking", "Catastrophizing").
- `missedAlternatives`: string[] — List of alternative options or perspectives the user may have missed.

---
For more details, see the [README](../README.md) or contact the development team. 