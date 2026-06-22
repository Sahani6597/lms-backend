
- Azure Kubernetes Service (AKS)
- Terraform Infrastructure as Code
- Azure DevOps CI/CD
- GitHub Actions
- Azure Container Registry
- Azure Monitor
- Microsoft Entra ID
- Azure Key Vault

The platform supports **1000+ concurrent users** with automated scaling and secure application delivery.

---

# 🏗️ Architecture

```
                Users
                  |
                  |
          Azure Load Balancer
                  |
                  |
          Azure Kubernetes Service
                  |
        -----------------------
        |                     |
    LMS Pods             API Services
        |
        |
 Azure Container Registry
        |
        |
 CI/CD Pipeline
(Azure DevOps + GitHub Actions)


Infrastructure:
Terraform
    |
    |
Azure Resources
```

---

# 🛠️ Technology Stack

## Cloud Platform

- Microsoft Azure
- Azure Kubernetes Service (AKS)
- Azure Load Balancer
- Virtual Machine Scale Sets

## DevOps

- Azure DevOps Pipelines
- GitHub Actions
- Docker
- Kubernetes
- Azure Container Registry (ACR)

## Infrastructure as Code

- Terraform

## Security

- Microsoft Entra ID (Azure AD)
- Azure Key Vault
- Role-Based Access Control (RBAC)

## Monitoring

- Azure Monitor
- Log Analytics
- Action Groups

---
