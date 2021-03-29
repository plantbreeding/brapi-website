FROM jenkins/jenkins:lts

USER root
RUN apt-get update && apt-get install -y python3 python3-pip python3-yaml sudo apt-transport-https ca-certificates curl gnupg2 software-properties-common maven
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
RUN apt-get update && apt-get install -y docker-ce

RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers
USER jenkins