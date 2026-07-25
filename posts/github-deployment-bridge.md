---
title: "I Wanted GitHub Deployments for Flux, So I Built a Bridge"
date: "2026-07-25"
description: "GitHub has a nice Environments UI. Flux deploys my apps. Neither talks to the other. That annoyed me enough to write a controller."
---

GitHub has this Environments page that shows what is deployed where, for which commit, and whether the last attempt succeeded. I kept looking at it and thinking: *that is exactly what I want for my Flux-managed clusters*.

The catch: outside of GitHub Actions, nothing feeds that UI from the cluster. Flux happily reconciles `Kustomization`s and `HelmRelease`s all day. GitHub Deployments stay empty. Two systems that should be related, connected by nothing.

So I built [GitHub Deployment Bridge](https://github.com/roberteggl/github-deployment-bridge).

[![GitHub Deployment Bridge docs landing page](/images/github-deployment-bridge.webp)](https://roberteggl.github.io/github-deployment-bridge/)

## The itch

In GitHub Actions, creating a Deployment is easy. There are actions for it, the API is right there, and the Environments page lights up. For a GitOps cluster the story is different:

- Flux already knows when a reconcile starts, stalls, or finishes
- The cluster already has the image and (if you bake labels properly) the commit
- GitHub already has the Environments UI

And that was it. No Flux controller, no Helm chart, no "official" way to say "this commit is now live in production because the cluster said so." I searched. I found nothing that did this.

I did not want another orchestrator. I already have Flux for that. I wanted a reporter.

## What "native support" would have looked like

Ideally Flux (or GitHub) would just expose this:

1. Reconcile starts → Deployment `in_progress`
2. Ready → `success`
3. Failed health check → `failure`
4. Tie it to the right repo and commit automatically

That does not exist. The Deployments API is generic and fine. The missing piece is something that watches Flux and speaks GitHub without turning your cluster into a CI runner.

## What I ended up shipping

A small Go controller. It watches Flux resources, derives a phase from conditions, discovers workload images from inventory, reads OCI labels (no layer pulls), and posts Deployments as a GitHub App.

A few choices I cared about:

- **Observe only.** It never mutates workloads or triggers deploys. Flux remains the source of truth.
- **Opt-in.** Workloads need `github-deployment-bridge.io/auto-report=true`. No surprise spam on every random chart in the cluster.
- **OCI labels first.** `org.opencontainers.image.source` and `.revision` already answer "which repo, which commit?" Annotations can override when you need an exception.
- **GitHub App, not a PAT.** Permissions stay tight: Deployments R/W, Contents read, Metadata read.
- **Idempotent.** SQLite on a PVC remembers what was already reported so Flux reconcile churn does not create duplicate Deployments.

In practice the app side is tiny. Bake identity into the image, opt the workload in:

```dockerfile
LABEL org.opencontainers.image.source="https://github.com/example/backend" \
      org.opencontainers.image.revision="0123456789abcdef"
```

```yaml
metadata:
  annotations:
    github-deployment-bridge.io/auto-report: "true"
```

That is enough for the bridge to open a Deployment on the right repo and walk it through `queued` → `in_progress` → `success` / `failure` as Flux reconciles.

Docs live here: [roberteggl.github.io/github-deployment-bridge](https://roberteggl.github.io/github-deployment-bridge/). The chart is on [Artifact Hub](https://artifacthub.io/packages/helm/github-deployment-bridge/github-deployment-bridge).

## Was it overkill?

Probably a little. I could have kept posting Deployment statuses from Actions and accepted that "deployed" means "image was pushed," not "Flux finished and the pods are healthy."

But that is the whole point of GitOps for me: the cluster is what actually happened. If GitHub's Environments page is going to show status, I want that status to come from the cluster.

Also, writing a focused controller is fun in a way that another Actions workflow is not.

## What I learned (again)

1. **Nice platform features are useless without an integration path.** GitHub Deployments are polished. Flux is polished. The gap between them is still DIY.
2. **Reporter ≠ orchestrator.** Keeping that boundary clear made the design much simpler.
3. **Standard labels beat bespoke config databases.** If your images already carry OCI source/revision, you barely need per-app mapping.
4. **Ship the boring parts.** Helm chart, metrics, Cosign, Artifact Hub, future-me will thank present-me.

If you run Flux and stare at empty GitHub Environments the way I did, maybe this helps. If not, at least I scratched my own itch, which is how most of my side projects start anyway.

---

*Source: [github.com/roberteggl/github-deployment-bridge](https://github.com/roberteggl/github-deployment-bridge)*
