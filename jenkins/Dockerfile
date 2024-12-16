## Build > docker build -t jenkins_python ./
## Run   > docker run -v /home/jenkins/jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -d jenkins_python

FROM jenkins/jenkins:lts

USER root
RUN apt-get update && apt-get install -y python3 python3-yaml sudo apt-transport-https ca-certificates curl gnupg2 software-properties-common maven
RUN install -m 0755 -d /etc/apt/keyrings && curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && chmod a+r /etc/apt/keyrings/docker.asc

RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update && apt-get install -y docker-ce

RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers
USER jenkins

