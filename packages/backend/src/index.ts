/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { metricsServiceRef } from '@backstage/backend-plugin-api/alpha';

const noop = () => {};
const noopObservable = { addCallback: noop, removeCallback: noop };

const backend = createBackend();

// @backstage/backend-defaults@0.15.x does not yet ship a metricsServiceFactory,
// but catalog-backend@3.x and scaffolder-backend@3.x require it. Register a
// no-op factory so the backend can start; replace with a real OpenTelemetry
// implementation when metrics collection is needed.
backend.add(
  createServiceFactory({
    service: metricsServiceRef,
    deps: {},
    async factory() {
      return {
        createCounter: () => ({ add: noop }),
        createUpDownCounter: () => ({ add: noop }),
        createHistogram: () => ({ record: noop }),
        createGauge: () => ({ record: noop }),
        createObservableCounter: () => noopObservable,
        createObservableUpDownCounter: () => noopObservable,
        createObservableGauge: () => noopObservable,
      };
    },
  }),
);

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));
backend.add(import('@roadiehq/scaffolder-backend-module-http-request'));

// techdocs
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// See https://backstage.io/docs/integrations/github/discovery
backend.add(import('@backstage/plugin-catalog-backend-module-github'));
// See https://backstage.io/docs/integrations/gitlab/discovery
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab'));

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend'));

// argocd
// See https://github.com/RoadieHQ/roadie-backstage-plugins/tree/main/plugins/backend/backstage-plugin-argo-cd-backend
backend.add(import('@roadiehq/backstage-plugin-argo-cd-backend'));

// dynatrace
// See https://github.com/Dynatrace/backstage-plugin
backend.add(import('@dynatrace/backstage-plugin-dql-backend'));

// notifications
backend.add(import('@internal/plugin-notifications-backend'));

backend.start();
