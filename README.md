# Cloud-Native 3-Tier Application Deployment on AWS EKS

An end-to-end DevOps project that deploys an eFootball tournament application using Docker, Jenkins CI/CD, Amazon ECR, Amazon EKS, Kubernetes, Prometheus, and Grafana.

The project demonstrates how a code change can move from GitHub to a running application on Kubernetes through an automated Jenkins pipeline.

---

## Project Overview

The application follows a 3-tier architecture:

- **Frontend**: React/Vite application served through Nginx
- **Backend**: Node.js and Express REST API
- **Database**: MySQL with persistent storage
- **CI/CD**: Jenkins builds images, pushes them to Amazon ECR, and deploys updates to Amazon EKS
- **Monitoring**: Prometheus collects metrics and Grafana visualizes application and cluster health

---

## Architecture

```text
Developer
   │
   │ Git Push
   ▼
GitHub Repository
   │
   ▼
Jenkins Pipeline
   │
   ├── Build Backend Docker Image
   ├── Build Frontend Docker Image
   ├── Push Images to Amazon ECR
   └── Deploy Updated Images to Amazon EKS
            │
            ▼
      Amazon EKS Cluster
            │
     ┌──────┼───────────────┐
     ▼      ▼               ▼
Frontend  Backend          MySQL
Service   Service          PVC
   │        │
   └────────┘
       │
       ▼
AWS LoadBalancer
       │
       ▼
Application Users

Prometheus ──> Kubernetes Metrics ──> Grafana Dashboard
```

---

## Technologies Used

| Category | Tools / Services |
|---|---|
| Source Control | Git, GitHub |
| CI/CD | Jenkins |
| Containerization | Docker, Docker Compose |
| Cloud | AWS |
| Container Registry | Amazon ECR |
| Kubernetes Platform | Amazon EKS |
| Kubernetes Resources | Deployment, Service, Secret, PVC |
| Database | MySQL |
| Monitoring | Prometheus, Grafana |
| Infrastructure as Code | Terraform |
| Operating System / Shell | Linux, Git Bash |

---

## Repository Structure

```text
cloud-native-3tier-app/
├── app/
│   └── efootball25/
│       ├── backend/                 # Node.js backend source code and Dockerfile
│       ├── frontend/                # React/Vite frontend source code and Dockerfile
│       └── docker-compose.yml        # Local Docker Compose deployment
│
├── docker/                           # Docker-related configuration files
├── docs/
│   └── screenshots/                  # Project screenshots used in this README
│
├── jenkins/                          # Jenkins Docker image / setup files
│
├── kubernetes/
│   ├── backend.yaml                  # Backend Deployment and Service
│   ├── frontend.yaml                 # Frontend Deployment and LoadBalancer Service
│   └── mysql.yaml                    # MySQL Deployment, Service, Secret, and PVC
│
├── monitoring/                       # Monitoring-related configuration files
├── terraform/                        # Terraform infrastructure files
│
├── Jenkinsfile                       # Docker Hub + EC2 deployment pipeline
├── Jenkinsfile.ec2                   # Jenkins pipeline for ECR and EKS deployment
├── README.md
└── .gitignore
```

---

## Application Components

### Frontend

- Built using React and Vite
- Served using Nginx inside a Docker container
- Exposed to users through a Kubernetes `LoadBalancer` Service
- Uses Nginx reverse proxy configuration to forward API requests to the backend service

### Backend

- Built using Node.js and Express
- Exposes REST API endpoints
- Connects to MySQL using Kubernetes service discovery
- Uses Kubernetes Secret for database password configuration

### Database

- MySQL runs inside Kubernetes
- Database data is stored using a PersistentVolumeClaim
- Amazon EBS CSI driver provisions persistent storage in EKS

---

## CI/CD Pipeline

The Jenkins pipeline performs the following stages:

```text
1. Checkout source code from GitHub
2. Authenticate Jenkins with Amazon ECR
3. Build backend Docker image
4. Build frontend Docker image
5. Push backend image to Amazon ECR
6. Push frontend image to Amazon ECR
7. Update Kubernetes deployments in Amazon EKS
8. Verify pods and services
```

The EKS deployment pipeline uses image version tags so that Kubernetes performs a rolling update when a new image is deployed.

---

## Kubernetes Deployment

The application is deployed in the default namespace.

### Workloads

| Component | Kubernetes Resource | Replicas | Exposure |
|---|---|---:|---|
| Frontend | Deployment | 1 | LoadBalancer Service |
| Backend | Deployment | 1 | ClusterIP Service |
| MySQL | Deployment | 1 | ClusterIP Service + PVC |

### Storage

MySQL uses a PersistentVolumeClaim:

```text
PVC Name: mysql-pvc
Storage Size: 5Gi
Access Mode: ReadWriteOnce
Storage Class: gp2
```

---

## Monitoring

Prometheus and Grafana were deployed in the `monitoring` namespace.

### Prometheus

Prometheus collects Kubernetes metrics using:

- Node Exporter
- kube-state-metrics
- Prometheus server

### Grafana Dashboard

A custom Grafana dashboard was created to monitor the application:

- Backend available replicas
- Frontend available replicas
- Total application pods running
- MySQL pod running status

---

## Screenshots

### Application Running Through AWS LoadBalancer

![Application UI](docs/screenshots/application-ui.png)

### Kubernetes Pods, Services, and Persistent Storage

![Kubernetes Resources](docs/screenshots/kubernetes-resources.png)

### Jenkins CI/CD Pipeline Success

![Jenkins Pipeline Success](docs/screenshots/jenkins-pipeline-success.png)

### Grafana Application Monitoring Dashboard

![Grafana Dashboard](docs/screenshots/grafana-dashboard.png)

### AWS LoadBalancer Service

![EKS LoadBalancer](docs/screenshots/eks-loadbalancer.png)

---

## Useful Commands

### Verify Kubernetes Workloads

```bash
kubectl get pods
kubectl get svc
kubectl get pvc
```

### Verify Monitoring Components

```bash
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

### Check Jenkins Pipeline Deployment

```bash
kubectl describe deployment backend
kubectl describe deployment frontend
```

---

## Cost Optimization and Cleanup

Amazon EKS, worker nodes, LoadBalancers, EBS volumes, and NAT gateways can generate charges. After project validation, the EKS cluster was deleted to avoid unnecessary AWS cost.

```bash
eksctl delete cluster --name efootball25-eks --region ap-south-1
```

Verify that no EKS cluster remains:

```bash
aws eks list-clusters --region ap-south-1
```

Expected result:

```json
{
  "clusters": []
}
```

---

## Key Learning Outcomes

- Containerized a multi-tier application using Docker
- Created CI/CD pipelines using Jenkins
- Used Amazon ECR as a private container registry
- Deployed a 3-tier application on Amazon EKS
- Configured Kubernetes Services, Secrets, Deployments, and PVC
- Implemented rolling deployments using Kubernetes
- Configured Prometheus and Grafana for monitoring
- Understood AWS resource cleanup and cost optimization

---

## Author

**Tanmoy Das**

GitHub: [TanmoyDas02](https://github.com/TanmoyDas02)