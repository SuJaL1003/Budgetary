# Entity-Relationship Diagram for Budgetary Project

This ER diagram represents the database schema for the Budgetary personal finance application. It shows the relationships between users and their financial data.

## Key Relationships:

- A User can have multiple Transactions (income/expense records)
- A User can set multiple Budgets for different categories and months
- A User can define multiple Categories for organizing transactions
- Transactions and Budgets reference Categories by name (string), while Categories are user-specific

## Entities and Attributes:

```mermaid
erDiagram
    User ||--o{ Transaction : "manages"
    User ||--o{ Budget : "sets"
    User ||--o{ Category : "defines"

    User {
        ObjectId _id PK
        string username "User's display name"
        string email UK "Unique email address"
        boolean isVerified "Email verification status"
        string verificationToken "Token for email verification"
        string resetPasswordToken "Token for password reset"
        date resetPasswordExpires "Expiration date for reset token"
        string password "Hashed password"
        string role "admin|user (default: user)"
        date createdAt "Auto-generated timestamp"
        date updatedAt "Auto-generated timestamp"
    }

    Transaction {
        ObjectId _id PK
        ObjectId user FK "Reference to User"
        string type "income|expense (required)"
        string category "Category name (required)"
        number amount "Transaction amount (required)"
        date date "Transaction date (default: now)"
        string note "Optional description"
        boolean isRecurring "Is this a recurring transaction?"
        string frequency "daily|weekly|monthly|null"
        date nextOccurrence "Next scheduled date for recurring"
        date createdAt "Auto-generated timestamp"
        date updatedAt "Auto-generated timestamp"
    }

    Budget {
        ObjectId _id PK
        ObjectId user FK "Reference to User"
        number catAmount "Budgeted amount for category (required)"
        string month "Budget month (e.g., '2024-01') (required)"
        number spent "Amount spent so far (default: 0)"
        boolean _notified "Has budget limit notification been sent?"
        string category "Category name (required)"
        date createdAt "Auto-generated timestamp"
        date updatedAt "Auto-generated timestamp"
    }

    Category {
        ObjectId _id PK
        string category "Category name (required, trimmed)"
        ObjectId user FK "Reference to User"
        string type "income|expense (required)"
        date createdAt "Auto-generated timestamp"
        date updatedAt "Auto-generated timestamp"
    }
```

## Notes:

- All entities use MongoDB ObjectId as primary keys
- Timestamps are automatically managed by Mongoose
- Foreign keys are MongoDB references to other documents
- Categories are user-specific and can be either income or expense types
- Transactions can be one-time or recurring with specified frequencies
- Budgets track spending against monthly category limits
