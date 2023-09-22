# beth-stack

## Setup

1. **Clone and install**
   
    ```bash
    gh repo clone NTAK666/try-bun
    cd try-bun
    bun install
    ```

2. **Create a database with Turso**

    Head over to the [Turso website](https://turso.tech/), register or login to your user, and follow the instructions to create a database on the edge.
    
    Take note of the authentication token and database URL.

    You may use the CLI:
    ```bash
        turso auth login # login to Turso
        turso create # create a database. note the URL
        turso db tokens create database_name # create a token for the database. note the token
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` to configure all environment variables, using the values from the previous step.

4. **Run**

    ```bash
    bun run src/index.ts
    ```

---

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
