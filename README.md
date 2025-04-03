[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Release](https://github.com/KatharinaSick/backstage-playground/actions/workflows/release.yaml/badge.svg)](https://github.com/KatharinaSick/backstage-playground/actions/workflows/release.yaml)

# Backstage Playground

This is a very minimalistic [Backstage](https://backstage.io) instance that can be used for testing or demoing
Backstage.

## Development

To start the app, run:

```sh
yarn install
yarn dev
```

You can start the back- and frontend separately by running `yarn start-backend` and `yarn start`.

Note that not all plugins are configured in the development configuration.

## Deployment

This repository contains the source code for a simple Backstage demo application. This app is built into a container
image that can be deployed to e.g. Kubernetes (see the [official docs](https://backstage.io/docs/deployment/docker) for
more details).

In addition to that, it contains [manifests](./deployment) for the most basic Kubernetes deployment
possible ([official docs](https://backstage.io/docs/deployment/k8s)). Those can be used to deploy this Backstage
instance to your Kubernetes cluster.

### Configuration

#### Software Catalog

The Software Catalog is configured to read from the [examples](./examples) directory if you are running a local
instance. For the production instance those files will be ignored and Backstage will read from GitHub and/or GitLab.

**GitHub Configuration**

- Configure the GitHub organization you would like to read from at `catalog.providers.github` in
  the [Backstage configuration](./deployment/config.yaml).
- Set your GitHub token in the [Backstage secret](./deployment/secrets.yaml)

**GitLab Configuration**

- Configure the GitLab host you would like to read from at `integrations.gitlab` in
  the [Backstage configuration](./deployment/config.yaml).
- Set the GitLab host you would like to read from at `catalog.providers.gitlab` in
  the [Backstage configuration](./deployment/config.yaml).
- Set your GitLab token in the [Backstage secret](./deployment/secrets.yaml)

> You can also use multiple GitLab hosts, but you'll need to make sure to add a token for each instance to
> the [Backstage secret](./deployment/secrets.yaml).

#### Scaffolder (Software Templates)

The scaffolder is configured out of the box. You just need to create a template and register it in the Backstage UI. You
can take a look at the [example template](./examples/template/template.yaml) and
the [official documentation](https://backstage.io/docs/features/software-templates/writing-templates) for more details.

#### TechDocs

The [TechDocs](https://backstage.io/docs/features/techdocs/getting-started/) plugin is configured to build, store and
read documentation locally. This means adding documentation should work out of the box.
See [the official docs](https://backstage.io/docs/features/techdocs/creating-and-publishing) for more information on how
to create documentation.

#### Kubernetes

With the [Kubernetes integration](https://backstage.io/docs/features/kubernetes/) developers can view information about
their deployments directly from within Backstage.

**Configuration**

The Kubernetes plugin is installed but not yet configured.
See https://backstage.io/docs/features/kubernetes/configuration/

**Usage**

To display Kubernetes entities as part of an Backstage entity, you just need to set the corresponding annotation. See
the [official documentation](https://backstage.io/docs/features/kubernetes/configuration/#surfacing-your-kubernetes-components-as-part-of-an-entity)
for more details.

#### ArgoCD

The [ArgoCD plugin](https://roadie.io/backstage/plugins/argo-cd/) shows information about ArgoCD applications.

**Configuration**

- Configure your ArgoCD host & instance name at `argocd` in the [Backstage configuration](./deployment/config.yaml).
- Set your ArgoCD token in the [Backstage secret](./deployment/secrets.yaml)

**Usage**

Add either the `argocd/app-name` or `argocd/app-selector` annotation to your `catalog-info.yaml`.

```yaml
metadata:
  annotations:
    argocd/app-name: <your-app-name>
    argocd/app-selector: <app-selector>
```

#### Notifications

The local notifications plugin allows you to send and display notifications/messages in the Backstage playground
instance.

**Configuration**

You don't need any changes in the Backstage configuration. Notifications are enabled and shown in the menu by default.

**Usage**

- To create a notification, send a `POST` request to `<your-backend-url>/api/notifications` with this payload:

```
{
  "message": "Your notification", # The text of your notifications
  "channel": "team-1", # The channel to send the notification to. Don't use whitespaces.'
  "origin": "sender" # Where the notification is coming from
}
```

- After sending a notification you should see it in the Backstage UI when navigating to "Notifications" in the menu.

#### Dynatrace

The [Dynatrace plugin](https://github.com/Dynatrace/backstage-plugin) fetches information from Dynatrace.

**Configuration**

- Configure your Dynatrace tenant at `dynatrace` in the [Backstage configuration](./deployment/config.yaml).
- Set `DYNATRACE_ACCOUNT_URN`, `DYNATRACE_CLIENT_ID` and `DYNATRACE_CLIENT_SECRET` in the [Backstage secret](./deployment/secrets.yaml)

**Usage**

See [docs](https://github.com/Dynatrace/backstage-plugin?tab=readme-ov-file#getting-started)