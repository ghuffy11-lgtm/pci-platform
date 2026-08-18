# PCI Supply-Chain Security

## Objective

Reduce the risk introduced by third-party dependencies, container images, build tools, models, plugins, and deployment artifacts.

## Requirements

- Pin or constrain production dependencies.
- Generate software inventories/SBOMs where practical.
- Verify container image provenance and scan for known vulnerabilities.
- Review third-party licenses before distribution.
- Keep build and runtime images minimal.
- Separate development and production credentials.
- Prefer reproducible builds.
- Record the source and version of AI models used in production.
- Treat model files and plugins as supply-chain artifacts.
- Establish a patch and vulnerability response process.

## AI-Specific Controls

Model weights, tool plugins, prompts, and agent packages are untrusted supply-chain inputs until evaluated and approved. A model must not gain additional execution authority merely because it is installed locally.
