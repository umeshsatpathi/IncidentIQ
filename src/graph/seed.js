export async function seedIncidentGraph(graph) {
  await graph.query(`
    MERGE (web:Service {name: "Web App"})
    SET web.id = "service-web"

    MERGE (checkout:Service {name: "Checkout Service"})
    SET checkout.id = "service-checkout"

    MERGE (payment:Service {name: "Payment Service"})
    SET payment.id = "service-payment"

    MERGE (web)-[:DEPENDS_ON]->(checkout)
    MERGE (checkout)-[:DEPENDS_ON]->(payment)
  `);

  await graph.query(`
    MATCH (payment:Service {id: "service-payment"})

    MERGE (deployment:Deployment {id: "deployment-payment-001"})
    SET deployment.version = "v2.4.1",
        deployment.timestamp = "2026-10-25T09:00:00Z"

    MERGE (payment)-[:DEPLOYED]->(deployment)
  `);

  // Add the incident and its alerts.
  await graph.query(`
    MERGE (incident:Incident {id: "inc-001"})
    SET incident.title = "Checkout failures after payment deployment",
        incident.status = "open",
        incident.startedAt = "2026-10-25T09:05:00Z"

    MERGE (paymentAlert:Alert {id: "alert-payment-001"})
    SET paymentAlert.service = "Payment Service",
        paymentAlert.type = "error_rate",
        paymentAlert.value = 0.18,
        paymentAlert.timestamp = "2026-10-25T09:05:00Z"

    MERGE (checkoutAlert:Alert {id: "alert-checkout-001"})
    SET checkoutAlert.service = "Checkout Service",
        checkoutAlert.type = "failure_rate",
        checkoutAlert.value = 0.12,
        checkoutAlert.timestamp = "2026-10-25T09:06:00Z"

    MERGE (incident)-[:OBSERVED_IN]->(paymentAlert)
    MERGE (incident)-[:OBSERVED_IN]->(checkoutAlert)
  `);

  await graph.query(`
    MERGE (deploymentEvidence:Evidence {id: "ev-deployment-001"})
    SET deploymentEvidence.type = "deployment",
        deploymentEvidence.description =
          "Payment Service was deployed as v2.4.1 at 09:00 UTC"

    MERGE (paymentEvidence:Evidence {id: "ev-payment-errors-001"})
    SET paymentEvidence.type = "alert",
        paymentEvidence.description =
          "Payment error rate reached 18% at 09:05 UTC"

    MERGE (checkoutEvidence:Evidence {id: "ev-checkout-failures-001"})
    SET checkoutEvidence.type = "alert",
        checkoutEvidence.description =
          "Checkout failure rate reached 12% at 09:06 UTC"

    MERGE (incident:Incident {id: "inc-001"})
    MERGE (incident)-[:HAS_EVIDENCE]->(deploymentEvidence)
    MERGE (incident)-[:HAS_EVIDENCE]->(paymentEvidence)
    MERGE (incident)-[:HAS_EVIDENCE]->(checkoutEvidence)
  `);

  console.log("IncidentIQ demo data seeded.");
}