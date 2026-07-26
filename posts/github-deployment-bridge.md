---
title: "Make GitHub Environments Mean Your Cluster Is Actually Live"
date: "2026-07-25"
description: "If you run Flux, GitHub Environments often show CI success, not cluster health. GitHub Deployment Bridge reports the real deploy status."
---

If you deploy with Flux and glance at GitHub Environments, ask yourself one question: does that green checkmark mean the cluster actually finished, or just that CI pushed an image?

For most GitOps setups, it is the latter. GitHub Actions marks the Deployment as successful when the pipeline succeeds. Flux is still reconciling. Pods might still be rolling. Health checks might still fail. The Environments page looks calm while production is mid-cutover.

That gap is what [GitHub Deployment Bridge](https://github.com/roberteggl/github-deployment-bridge) closes.

[![GitHub Deployment Bridge docs landing page](/images/github-deployment-bridge.webp)](https://deployment-bridge.eggl.dev/)

## The problem is not Flux or GitHub

Flux already knows when a `Kustomization` or `HelmRelease` starts, stalls, or becomes ready. GitHub already has a solid Environments UI with commit history, status, and per-environment context. Neither side talks to the other outside of Actions.

So teams either:

- Pretend “image pushed” equals “deployed”
- Skip Environments entirely
- Glue something together with webhooks and hope

None of those are good if you actually care whether production is healthy.

## What the bridge does

It watches Flux, derives status from real reconcile conditions, figures out which repo and commit the workload came from (OCI labels first), and reports Deployments as a GitHub App.

Lifecycle mirrors the cluster:

1. Reconcile starts → Deployment `in_progress`
2. Ready → `success`
3. Failed health check → `failure`

Important constraints by design:

- **Observe only.** It never mutates workloads or triggers deploys. Flux stays in charge.
- **Opt-in.** Annotate what you want reported. No noise from every chart in the cluster.
- **GitHub App auth.** Tight permissions: Deployments R/W, Contents read, Metadata read. No long-lived PATs.
- **Idempotent.** SQLite on a PVC remembers what was already reported, so Flux churn does not spam Deployments.

## Get it running

Bake identity into the image:

```dockerfile
LABEL org.opencontainers.image.source="https://github.com/example/backend" \
      org.opencontainers.image.revision="0123456789abcdef"
```

Opt the workload in:

```yaml
metadata:
  annotations:
    github-deployment-bridge.io/auto-report: "true"
```

That is enough for the bridge to open a Deployment on the right repo and walk it through `queued` → `in_progress` → `success` / `failure` as Flux reconciles.

Install via Helm ([Artifact Hub](https://artifacthub.io/packages/helm/github-deployment-bridge/github-deployment-bridge)), wire up a GitHub App, and your Environments page starts reflecting cluster reality instead of CI optimism.

Full setup: [deployment-bridge.eggl.dev](https://deployment-bridge.eggl.dev/)

## Why bother

GitOps only buys you truth if you report that truth somewhere people actually look. For a lot of teams, that place is GitHub Environments. If the status there still comes from Actions, you are looking at a preview of a deploy, not the deploy itself.

If you already run Flux, this is a small controller with a clear job: make GitHub show what the cluster did. Use it when you want Environments to mean “live and healthy,” not “pipeline finished.”

---

*Source: [github.com/roberteggl/github-deployment-bridge](https://github.com/roberteggl/github-deployment-bridge)*
