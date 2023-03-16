# **eriegz technical assessment**

## **Prerequisites:**

### Node.js dependencies:

Before you can run the application, ensure that you've installed all of the necessary Node.js dependencies:

- `nvm install 16.3.1`
- `npm i -g typescript ts-node`
- `npm i`
- `npm run build`

...or to automatically re-build when watched files change:

- `npm run build-dev`

### Third party services:

Next, this application talks to redis and Mongo servers. To spin up instances of these on your local machine, follow these steps:

- First, install [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - If you're on Windows, you may then need to [manually update WSL to version 2](https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)
- Then, pull and run both the [official redis Docker image](https://hub.docker.com/_/redis) and the [official mongo Docker image](https://hub.docker.com/_/mongo) by opening a terminal and running:
  - `docker pull redis`
  - `docker pull mongo`
- Finally, run the images via the following commands:
  - `docker run --name carewell-redis -p 6379:6379 -d redis`
  - `docker run --name carewell-mongo -p 27017:27017 -d mongo`

## **How to run:**

> Note: Ensure you've completed all of the "prerequisites" listed above first.

To run this application in "single execution mode" (i.e.: in production):

- ensure that your environment has the `NODE_ENV` env variable set to one of the following: `staging`, `preprod`, or `production`
- `npm run start`

...or to run it in "hot-reloading" mode (i.e.: for developers):

- `npm run dev`

> Note: the above will automatically pass `NODE_ENV=dev` to the application, which will point to Mongo and redis instances on localhost.

## **How to use:**

To try out the REST API, you can copy-paste any of the following cURL request examples into your terminal, or an application such as [Postman](https://www.postman.com/).

>Note: for any endpoints that require authentication, you'll need to hit the `/login` endpoint first, then use the `token` value that's passed back to you in the `Cookie` response header.

### Login endpoint:
________________

```
curl --location --request POST 'localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "YOUR_USERNAME_HERE",
    "password": "YOUR_PASSWORD_HERE"
}'
```

### User CRUD endpoints:
________________

**Create** user:

```
curl --location --request POST 'localhost:3000/api/user/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "YOUR_USERNAME_HERE",
    "password": "YOUR_PASSWORD_HERE"
}'
```

**Read** user:

```
curl --location --request GET 'localhost:3000/api/user/YOUR_USERNAME_HERE' \
--header 'Cookie: token=REPLACE_THIS_WITH_YOUR_VALID_JWT_TOKEN'
```

**Update** user:

```
curl --location --request PUT 'localhost:3000/api/user/YOUR_USERNAME_HERE' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=REPLACE_THIS_WITH_YOUR_VALID_JWT_TOKEN' \
--data-raw '{
    "password": "YOUR_PASSWORD_HERE"
}'
```

**Delete** user:

```
curl --location --request DELETE 'localhost:3000/api/user/YOUR_USERNAME_HERE' \
--header 'Cookie: token=REPLACE_THIS_WITH_YOUR_VALID_JWT_TOKEN'
```
