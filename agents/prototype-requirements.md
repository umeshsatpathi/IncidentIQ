# IncidentIQ Prototype Requirements

> **Purpose:** Build a working prototype of an AI-assisted incident investigation system.
>
> **Prototype principle:** Keep the first version small: one Node.js API, FalkorDB, a React UI, mock incident data, and one investigation workflow.

## 1. Prototype scope

- [ ] Create and view incidents.
- [ ] Display service dependencies.
- [ ] Show an incident timeline.
- [ ] Store and display alerts, deployments, logs, and evidence.
- [ ] Generate competing root-cause hypotheses.
- [ ] Link hypotheses to supporting evidence.
- [ ] Identify contradicting and missing evidence.
- [ ] Recommend safe next actions.
- [ ] Display the complete investigation in a web UI.

## 2. Prototype architecture

```text
React UI
   |
Express API
   |
FalkorDB
   |
AI provider or deterministic investigation engine
```

- [ ] Create the backend API with Node.js and Express.
- [ ] Use FalkorDB as the prototype data store.
- [ ] Add a React frontend using Vite.
- [ ] Add environment-based configuration with `dotenv`.
- [ ] Add request validation with Zod or an equivalent validator.
- [ ] Keep external integrations mocked during the first prototype.

## 3. Backend project structure

```text
src/
  server.js
  config/
    graph.js
  routes/
    incidents.js
    services.js
    investigation.js
  services/
    incidentService.js
    graphService.js
    investigationService.js
  data/
    seed.js
```

- [ ] Keep FalkorDB connection management in `src/config/graph.js`.
- [ ] Add service-related routes.
- [ ] Add incident-related routes.
- [ ] Add investigation-related routes.
- [ ] Add reusable graph query and business-logic services.
- [ ] Add a repeatable seed-data command.

## 4. FalkorDB graph model

### Nodes

- [ ] `Service`
- [ ] `Incident`
- [ ] `Alert`
- [ ] `Deployment`
- [ ] `LogEvent`
- [ ] `Evidence`
- [ ] `Hypothesis`
- [ ] `Action`

### Relationships

- [ ] `(Service)-[:DEPENDS_ON]->(Service)`
- [ ] `(Incident)-[:AFFECTS]->(Service)`
- [ ] `(Incident)-[:HAS_ALERT]->(Alert)`
- [ ] `(Incident)-[:HAS_DEPLOYMENT]->(Deployment)`
- [ ] `(Incident)-[:HAS_LOG]->(LogEvent)`
- [ ] `(Incident)-[:HAS_EVIDENCE]->(Evidence)`
- [ ] `(Incident)-[:HAS_HYPOTHESIS]->(Hypothesis)`
- [ ] `(Hypothesis)-[:SUPPORTED_BY]->(Evidence)`
- [ ] `(Hypothesis)-[:CONTRADICTED_BY]->(Evidence)`
- [ ] `(Hypothesis)-[:RECOMMENDS]->(Action)`

### Evidence provenance

Every evidence item should include:

- [ ] Stable evidence ID.
- [ ] Evidence type.
- [ ] Source.
- [ ] Service and environment.
- [ ] Event timestamp.
- [ ] Collection timestamp.
- [ ] Summary or payload.
- [ ] Reference to the originating event or mock integration.

## 5. Seed data

- [ ] Create `Web App`.
- [ ] Create `Checkout Service`.
- [ ] Create `Payment Service`.
- [ ] Connect `Web App -> Checkout Service -> Payment Service`.
- [ ] Create one sample production incident.
- [ ] Add at least two alerts.
- [ ] Add at least one recent deployment.
- [ ] Add representative log events.
- [ ] Add supporting and contradicting evidence.
- [ ] Verify all seed data can be queried from FalkorDB.

## 6. Incident management

Example incident shape:

```json
{
  "id": "INC-001",
  "title": "Checkout failures",
  "description": "Users cannot complete checkout",
  "severity": "SEV-1",
  "status": "investigating",
  "environment": "production",
  "startedAt": "2026-11-02T10:00:00Z"
}
```

- [ ] Create an incident.
- [ ] List incidents.
- [ ] Retrieve incident details.
- [ ] Update incident status.
- [ ] Update incident severity.
- [ ] Record affected services.
- [ ] Record incident start and end times.

## 7. Required API routes

- [ ] `GET /health`
- [ ] `GET /api/services`
- [ ] `POST /api/services`
- [ ] `GET /api/services/:id/dependencies`
- [ ] `GET /api/incidents`
- [ ] `POST /api/incidents`
- [ ] `GET /api/incidents/:id`
- [ ] `PATCH /api/incidents/:id`
- [ ] `GET /api/incidents/:id/timeline`
- [ ] `GET /api/incidents/:id/evidence`
- [ ] `GET /api/incidents/:id/hypotheses`
- [ ] `POST /api/incidents/:id/investigate`
- [ ] `POST /api/mock/deployments`
- [ ] `POST /api/mock/alerts`
- [ ] `POST /api/mock/logs`

## 8. Incident timeline

- [ ] Collect alerts, deployments, logs, and manual notes.
- [ ] Normalize events into a common shape.
- [ ] Order events by timestamp.
- [ ] Filter events by incident time range.
- [ ] Filter events by affected service.
- [ ] Display event type, source, service, and timestamp.
- [ ] Link each timeline item to its evidence record.

## 9. Mock integrations

### Mock deployment provider

- [ ] Accept service name, version, commit, and deployment time.
- [ ] Store the deployment in FalkorDB.
- [ ] Link the deployment to the affected service.

### Mock monitoring provider

- [ ] Accept alert name, service, severity, and start time.
- [ ] Store the alert in FalkorDB.
- [ ] Link the alert to the incident and affected service.

### Mock logs

- [ ] Accept service, message, severity, and timestamp.
- [ ] Store log evidence in FalkorDB.
- [ ] Make logs searchable by incident and service.

## 10. Investigation workflow

- [ ] Load the incident context.
- [ ] Find affected services.
- [ ] Traverse the relevant dependency graph.
- [ ] Find recent deployments.
- [ ] Find related alerts.
- [ ] Find relevant logs and evidence.
- [ ] Build a time-bounded investigation context.
- [ ] Generate at least two competing hypotheses.
- [ ] Score each hypothesis.
- [ ] Attach supporting evidence IDs.
- [ ] Attach contradicting evidence IDs.
- [ ] List missing evidence.
- [ ] Recommend safe next actions.
- [ ] Save the investigation result.

## 11. Initial deterministic investigation rules

Implement these rules before connecting an AI model:

- [ ] Increase deployment hypothesis confidence when a deployment happened shortly before an alert.
- [ ] Increase confidence when the deployment affected the alerted service.
- [ ] Increase confidence when error logs began after the deployment.
- [ ] Decrease confidence when contradicting evidence predates the deployment.
- [ ] Identify missing evidence when no deployment, alert, or log data exists.
- [ ] Require every conclusion to reference at least one evidence item.

## 12. AI investigation integration

- [ ] Add an AI provider adapter behind a service interface.
- [ ] Send only the incident context and retrieved evidence to the model.
- [ ] Require structured JSON output.
- [ ] Require multiple hypotheses.
- [ ] Require confidence scores.
- [ ] Require supporting evidence IDs.
- [ ] Require contradicting evidence IDs.
- [ ] Require missing information.
- [ ] Require recommended next actions.
- [ ] Reject or flag evidence IDs that do not exist.
- [ ] Prevent unsupported claims from being presented as facts.
- [ ] Keep deterministic validation after the AI response.

Expected output shape:

```json
{
  "incidentId": "INC-001",
  "hypotheses": [
    {
      "title": "Recent Checkout Service deployment caused failures",
      "confidence": 0.87,
      "supportingEvidence": ["DEPLOYMENT-001", "ALERT-001"],
      "contradictingEvidence": [],
      "missingEvidence": ["Release error comparison"],
      "nextActions": [
        "Compare error rates before and after deployment",
        "Review the release changes",
        "Consider rollback only after approval"
      ]
    }
  ]
}
```

## 13. Frontend pages

### Dashboard

- [ ] Display active incidents.
- [ ] Display severity and status.
- [ ] Display affected services.
- [ ] Display investigation status.

### Incident details

- [ ] Display incident summary.
- [ ] Display timeline.
- [ ] Display dependency graph.
- [ ] Display evidence.
- [ ] Display hypotheses and confidence.
- [ ] Display contradicting evidence.
- [ ] Display missing evidence.
- [ ] Display recommended actions.
- [ ] Add an `Investigate Incident` button.

### Service graph

- [ ] Display all services.
- [ ] Display dependencies.
- [ ] Display recent deployments.
- [ ] Display active alerts.

## 14. Safety and prototype boundaries

- [ ] Keep recommendations read-only.
- [ ] Require explicit human approval for remediation.
- [ ] Do not implement automatic rollback.
- [ ] Do not allow the AI to execute production commands.
- [ ] Validate all incoming mock integration payloads.
- [ ] Avoid storing secrets in graph data.
- [ ] Log investigation failures explicitly.

## 15. Testing and verification

- [ ] Test FalkorDB connection and shutdown.
- [ ] Test graph seed data.
- [ ] Test service dependency queries.
- [ ] Test incident creation and retrieval.
- [ ] Test timeline ordering.
- [ ] Test evidence linking.
- [ ] Test hypothesis scoring rules.
- [ ] Test invalid API input.
- [ ] Test investigation output validation.
- [ ] Test the complete create-incident-to-investigation flow.
- [ ] Verify `/health` returns HTTP 200.
- [ ] Verify `/api/services` returns the dependency graph.
- [ ] Verify `/api/incidents/:id/investigate` returns evidence-linked hypotheses.

## 16. Explicitly out of scope for the prototype

- [ ] PostgreSQL.
- [ ] User authentication.
- [ ] Billing.
- [ ] Multi-tenancy.
- [ ] Kafka or another production event bus.
- [ ] Kubernetes deployment.
- [ ] Full-text log indexing.
- [ ] Real-time streaming.
- [ ] Automatic remediation.
- [ ] Multiple AI providers.
- [ ] Production compliance certifications.

## 17. Prototype completion checklist

- [ ] A developer can seed the sample graph.
- [ ] A developer can create an incident.
- [ ] A developer can add alerts, logs, and deployments.
- [ ] The system displays a chronological timeline.
- [ ] The system displays the affected service graph.
- [ ] The system generates competing hypotheses.
- [ ] Every hypothesis links to evidence.
- [ ] The system identifies contradictions or missing evidence.
- [ ] The system recommends safe next actions.
- [ ] The complete investigation is visible in the UI.
- [ ] Setup and run instructions are documented.
