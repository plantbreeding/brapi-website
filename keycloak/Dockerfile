# Build with : docker build -t brapicoordinatorselby/brapi-keycloak ./
# run with : docker run --name brapi-keycloak -p 8443:8443 -e KC_DB_URL=jdbc:postgresql://postgres:5432/brapi --network=brapi_net -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=change_me brapicoordinatorselby/brapi-keycloak:latest start --optimized

FROM quay.io/keycloak/keycloak:latest as builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

# Add the provider JAR file to the providers directory
ADD --chown=keycloak:keycloak providers/keycloak-orcid-1.2.0.jar /opt/keycloak/providers/keycloak-orcid-1.2.0.jar
ADD --chown=keycloak:keycloak themes/brapi-theme /opt/keycloak/themes/brapi-theme

WORKDIR /opt/keycloak
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]