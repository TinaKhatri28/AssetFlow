# AssetFlow — Architecture

## The AssetFlow Architecture: A Strict Modular Monolith

We chose to build AssetFlow as a **Modular Monolith**. We explicitly avoided microservices because, at this scale, microservices introduce unnecessary network latency, complex deployments, and distributed database headaches. 

Instead, we built a single deployable FastAPI backend that is *internally* partitioned with strict boundaries. If we ever need to scale out to microservices in the future, our codebase is already perfectly shaped to do so.

Here is how we organized it:

### 1. Domain-Driven Modules (`app/modules/`)
Instead of dumping all our routes into one folder and all our database queries into another, we grouped our code by **business domain**. Every feature we built (`users`, `categories`, `departments`, `assets`, `allocations`) is its own isolated folder. 

Each module strictly owns its own data. For example, if the `allocations` module needs to change an asset's status, it is **not** allowed to query the `assets` database table directly. It must ask the `assets/service.py` to do it. This enforces strict boundaries.

### 2. Strict 4-Tier Layering
Inside every single module, we enforce a strict top-to-bottom data flow. A request must pass through these layers in exact order:

1. **`routes.py` (The API Layer):** Only handles HTTP. It receives the JSON, validates it using Pydantic, and immediately passes it down. It contains **zero business logic**.
2. **`service.py` (The Brains):** This is where the business rules live (e.g., checking if a laptop is already allocated, enforcing the State Machine). It orchestrates the work, but it does not write raw SQL.
3. **`repository.py` (The Database Layer):** Contains all the SQLAlchemy database queries. It executes the SQL, but makes no business decisions.
4. **`models.py` (The Schema):** The SQLAlchemy classes that define what the database tables look like.

### 3. Separation of Infrastructure (`app/core/` and `app/db/`)
We kept all global, cross-cutting concerns entirely separate from the business logic:
* **`app/core/`**: Holds our security (JWT token generation, Password hashing) and configuration settings.
* **`app/db/`**: Manages the actual PostgreSQL connection pool and the base setup for our ORM.

### Why this matters
By forcing every feature into this predictable `Routes → Service → Repository` pattern, our codebase is completely standardized. A new developer can look at how we built the `assets` module and instantly understand how the `allocations` module works without having to read the code, making the system incredibly scalable as the team grows!
