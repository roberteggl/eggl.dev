---
title: "From Commit to Cluster – My Talk at Cookie Talks & code:together"
date: "2025-11-17"
description: "A personal recap of my talk about building and operating Neuland’s self-hosted Kubernetes + GitOps infrastructure."
---

On November 5th, I had the chance to give a talk at our **Cookie Talks & code:together** event at Neuland Ingolstadt e.V. – and it was an incredible experience. More than **50 people** showed up, the room was packed, and the interest in self-hosted infrastructure and GitOps was much higher than I expected.

This blog post is a short recap from *my* perspective: how our setup works, why we built it, and what I tried to show on stage.

[![Robert giving a talk at Cookie Talks & code:together](/images/k3s.webp)](/images/k3s.webp)
## Why we moved away from a single VPS

When I joined Neuland, our entire infrastructure ran on a single VPS using Docker Compose.  
It worked… until it didn’t.

- No redundancy  
- No scaling  
- No automated deployments  
- High cost for low performance  

It became clear that we needed something more robust, transparent, and sustainable – something that could grow with us.

---

## Our new foundation: K3s + GitOps

Today, we run a **three-node K3s cluster** hosted on **Hetzner Cloud** across two locations (Nuremberg and Falkenstein).  
Everything is deployed and managed through **GitOps with FluxCD**.

What does that mean?

- Our desired cluster state lives fully in Git  
- Every change is done through a commit  
- Flux keeps the cluster in sync and fixes drift automatically  
- Deployments are reproducible, versioned, and transparent  
- No manual clicking, no hidden configuration

For a student-run association with limited resources, this combination of *simplicity, automation and control* is exactly what we needed.

---

## Storage, scaling & reliability

We use **Longhorn** for distributed storage, giving us:

- Replicated volumes  
- Automatic failover  
- Snapshots and backups (including S3 backups)  

This allows us to run applications reliably even if a node goes offline.

---

## Automated CI → GHCR → GitOps → Cluster

One of the key parts of my talk was how our **build & deploy pipeline** works:

1. A commit triggers GitHub Actions  
2. A Docker image is built and pushed to **GHCR**  
3. FluxCD detects the new tag via `ImageRepository`  
4. `ImageUpdateAutomation` updates the GitOps repo  
5. Flux applies the updated manifests  
6. Kubernetes rolls out the new version automatically  

In short:

**A single commit ends up as a running, updated service on our cluster - without manual steps.**

---

## What we run on the cluster

A few examples of what currently lives in our GitOps setup:

- **Neuland Next:** Web-App, API, Backend Services and more
- **Internal Tooling:** Uptime Kuma, Outline, Nextcloud and more
- **External Services:** Neuland Website, Campus Life Events and more

## Why Hetzner?

Several people asked this during the event.  
The answer is simple:

- Great performance for the price  
- German datacenters  
- Developer-friendly APIs  
- Perfect for small but serious Kubernetes setups  

And of course:  
They generously sponsor the servers powering our infrastructure. 🙌

---

## Community response

Seeing so many people interested in Kubernetes, GitOps, and self-hosting was genuinely motivating.  
A lot of attendees had never seen a self-hosted GitOps setup in action before, and the Q&A turned into a deep dive into automation, networking, and storage.

For me, this was the highlight of the evening.

---

Thanks again to everyone who came,
and special thanks to Hetzner for supporting our mission.

If you want to see the slides, architecture diagrams, or code examples, feel free to reach out!

– Robert
