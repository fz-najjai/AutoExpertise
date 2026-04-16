```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email UK
        string phone
        string password
        enum role
        boolean is_validated
        string city
        timestamp email_verified_at
    }

    EXPERT_PROFILES {
        bigint id PK
        bigint user_id FK
        string specialty
        decimal price
        text bio
    }

    AVAILABILITIES {
        bigint id PK
        bigint expert_id FK
        datetime start_time
        datetime end_time
        boolean is_booked
    }

    APPOINTMENTS {
        bigint id PK
        string reference UK
        bigint client_id FK
        bigint expert_id FK
        datetime scheduled_at
        text problem_description
    }

    USERS ||--o| EXPERT_PROFILES : has
    USERS ||--o{ AVAILABILITIES : defines
    USERS ||--o{ APPOINTMENTS : client
    USERS ||--o{ APPOINTMENTS : expert