# AkabandoFarms: Your Guide to a Sustainable Farming App

## Project Overview

- **Demo Video:** Watch a walkthrough of AkabandoFarms on [YouTube](https://youtu.be/GMghTVNDxxw).
- **Docker Hub:** Find the official container image at [Docker Hub](https://hub.docker.com/r/jniyitegek/akabandofarms).

AkabandoFarms is a web application designed to help Rwandan farmers make informed decisions. By providing localized weather forecasts, farming tips, and crop-specific advice, the app empowers users to plan agricultural activities more effectively. Farmers select their district and crop to receive tailored weather alerts and recommendations on whether a crop is suitable for their area. The app is easily deployed using Docker, ensuring portability and scalability.

### Core Features

- **Localized Weather Data:** Fetches live weather data for selected districts.
- **Crop-Specific Advice:** Provides farming tips and weather-adapted recommendations for chosen crops.
- **User Interaction:** Allows users to select their district and crop to receive relevant information.
- **Robustness:** Includes graceful error handling for API outages or invalid responses.

---

## 1. Getting Started

To get started with AkabandoFarms, you'll need the following prerequisites installed on your machine.

### Prerequisites

- **Docker:** Used for building and running the application container.
- **Docker Compose:** Required for orchestrating the multi-container lab environment.
- **curl:** A command-line tool for making HTTP requests (useful for testing).

### Local Setup & Usage

To run the application on your local machine, follow these steps:

#### Clone the Repository

```bash
git clone https://github.com/jniyitegek/akabandofarms.git
cd akabandofarms
```

#### Build the Docker Image

```bash
docker build -t jniyitegek/akabandofarms:v1 .
```
This command creates the Docker image for the application and tags it as `jniyitegek/akabandofarms:v1`.

#### Run the Container

```bash
docker run -p 8080:8080 jniyitegek/akabandofarms:v1
```
This command starts the container and maps your computer's port 8080 to the application's internal port 8080.

#### Access the Application

Open your web browser and go to [http://localhost:8080](http://localhost:8080) to view the application. Alternatively, you can use curl to test the connection:

```bash
curl http://localhost:8080
```

---

## 2. Deployment with the Web Infrastructure Lab

This section guides you through deploying AkabandoFarms on a three-container lab environment (`web-01`, `web-02`, `lb-01`). This setup demonstrates a scalable, load-balanced deployment.

### Lab Environment

The deployment relies on a specific `docker-compose.yaml` file to orchestrate the containers. A modified version is included in this repository.

#### Start the Lab Environment

Ensure you have the `web_infra_lab` setup configured and its `docker-compose.yaml` file is updated as shown below. Navigate to the directory containing that file and bring up the containers:

```bash
# From your web_infra_lab directory
docker compose up -d
```

#### Verify Deployment

Your application should now be running on both `web-01` and `web-02`. Check the status of the containers:

```bash
docker compose ps
```

### Load Balancer Configuration (on lb-01)

The load balancer (`lb-01`) needs to be configured to route traffic to the two application instances.

#### Access the Load Balancer

SSH into the `lb-01` container:

```bash
ssh ubuntu@localhost -p 2210
```

#### Install HAProxy

```bash
sudo apt update && sudo apt install -y haproxy
```

#### Edit the HAProxy Configuration File

Use `sudo nano /etc/haproxy/haproxy.cfg` to edit the configuration. Example setup:

```
frontend http-in
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
    http-response set-header X-Served-By %[srv_name]
```

#### Reload HAProxy

Use HAProxy's dedicated reload command:

```bash
sudo haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg
```

---

## 3. Final Verification

To confirm the load balancer is working and distributing traffic, use curl from your host machine:

```bash
# Run this command multiple times
curl -I http://localhost:8082
```

The output should include an `X-Served-By` header that alternates between `web01` and `web02`, confirming successful deployment.

---

## 4. Troubleshooting & Credits

### Common Issues

- **"Port is already allocated":** A service may already be running on the port. Stop the old service (`sudo systemctl stop nginx`) or use a different port mapping.
- **"Command not found":** The lab uses a minimal Ubuntu image. If a command like `systemctl` is missing, use a direct alternative (e.g., `haproxy -sf ...`).

### Dependencies & Credits

- **Docker & Docker Compose:** Containerization and orchestration.
- **HAProxy:** Load balancing.
- **OpenWeatherMap API:** Used for weather data. [API Documentation](https://openweathermap.org/api)

A special thank you to the creators of these APIs and tools for making this project possible.