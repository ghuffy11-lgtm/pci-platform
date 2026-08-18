# ADR-0003 — Model-Agnostic AI Architecture

**Status:** Accepted  
**Date:** 2026-08-18  
**Owner:** PCI Architecture

## Context

AI models and runtimes are changing rapidly. PCI must not become structurally dependent on one model family or inference runtime.

## Decision

AI capability is exposed through PCI abstractions and contracts. Models, inference runtimes, embeddings, rerankers, and providers are replaceable implementation components.

## Initial Runtime

The first local inference environment may use Ollama because it is practical for the target hardware and familiar operational environment. This is an implementation decision, not a platform identity.

## Consequences

Model evaluation becomes an explicit operational concern. Model-specific features may be supported through optional capability detection rather than leaking into core business logic.
