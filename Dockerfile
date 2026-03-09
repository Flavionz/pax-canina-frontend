FROM ubuntu:latest
LABEL authors="flavi"

ENTRYPOINT ["top", "-b"]
