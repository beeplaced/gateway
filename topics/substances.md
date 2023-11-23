# Chemical Substance Data API Documentation

## Table of Contents
- [Chemical Substance Data API Documentation](#chemical-substance-data-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
    - [Retrieve Basic Chemical Information](#retrieve-basic-chemical-information)
    - [Retrieve Detailed Chemical Information](#retrieve-detailed-chemical-information)
  - [Request Examples](#request-examples)
    - [Retrieve Basic Chemical Information](#retrieve-basic-chemical-information-1)
    - [Response Examples](#response-examples)
  - [Retrieve Basic Chemical Information (200 OK)](#retrieve-basic-chemical-information-200-ok)
  - [Retrieve Detailed Chemical Information (200 OK)](#retrieve-detailed-chemical-information-200-ok)
    - [Error Handling](#error-handling)
    - [Rate Limiting](#rate-limiting)
    - [Getting Started](#getting-started)
  - [Acceptance Criteria](#acceptance-criteria)
    - [Scenario 1: Retrieve Basic Chemical Information](#scenario-1-retrieve-basic-chemical-information)
    - [Scenario 2: Retrieve Detailed Chemical Information](#scenario-2-retrieve-detailed-chemical-information)
  - [Request Examples](#request-examples-1)

## Introduction
Welcome to the Chemical Substance Data API documentation. This API allows you to retrieve chemical substance information for updating your chemical database. The API provides access to basic and detailed data about chemical substances.

## Authentication
To access the API, you need to obtain an API key and access credentials. Contact our support team to request API access.

## Endpoints

### Retrieve Basic Chemical Information
- **Endpoint:** `/chemicals/{chemical_id}`
- **HTTP Method:** GET
- **Description:** Retrieve basic information about a chemical substance by its `chemical_id`.

### Retrieve Detailed Chemical Information
- **Endpoint:** `/chemicals/{chemical_id}/details`
- **HTTP Method:** GET
- **Description:** Retrieve detailed information about a chemical substance by its `chemical_id`.

## Request Examples
Here are examples of how to make requests to the API:

### Retrieve Basic Chemical Information
```http
GET /chemicals/12345
```

### Response Examples
Here are examples of API responses:

## Retrieve Basic Chemical Information (200 OK)
```
{
  "name": "Example Chemical",
  "formula": "C6H12O6",
  "molecular_weight": 180.16,
  "cas_number": "50-99-7",
  "iupac_name": "D-Glucose"
}
```

## Retrieve Detailed Chemical Information (200 OK)
```
{
  "structural_formula": "O=C(C)[C@@H](O)[C@H](O)[C@H](O)[C@H](O)CO",
  "physical_properties": {
    "melting_point": "146-150°C",
    "boiling_point": "376.1°C",
    "density": "1.54 g/cm³"
  },
  "hazard_classification": "Hazardous to the aquatic environment (Acute Category 1)",
  "safety_data": {
    "handling_instructions": "Use gloves when handling.",
    "first_aid_measures": "In case of contact with eyes, rinse immediately with plenty of water."
  },
  "synonyms": ["D-Glucose", "Dextrose"],
  "regulatory_compliance": "Complies with REACH regulations."
}

```

### Error Handling
The API returns appropriate error responses for invalid or missing data. Refer to the error handling documentation for details on error codes and messages.

### Rate Limiting
To prevent abuse, the API enforces rate limiting. Refer to the rate limiting documentation for details on rate limits.

### Getting Started
To get started with the API, follow these steps:

Obtain API access credentials.
Review the authentication process.
Explore the available endpoints and their functionality.
Use the provided examples to make your first requests.
Contact
If you have any questions or need assistance, please contact our support team at support@example.com.


## Acceptance Criteria

### Scenario 1: Retrieve Basic Chemical Information
- Given that I have a valid API key and access credentials,
- When I make a GET request to the endpoint `/chemicals/{chemical_id}`,
- Then the API should return the basic information of the chemical substance associated with the provided `chemical_id`, including its:
  - Name
  - Chemical formula
  - Molecular weight
  - CAS (Chemical Abstracts Service) number
  - IUPAC (International Union of Pure and Applied Chemistry) name

### Scenario 2: Retrieve Detailed Chemical Information
- Given that I have a valid API key and access credentials,
- When I make a GET request to the endpoint `/chemicals/{chemical_id}/details`,
- Then the API should return detailed information about the chemical substance associated with the provided `chemical_id`, including:
  - Structural formula (in a format such as SMILES or InChI)
  - Physical properties (e.g., melting point, boiling point, density)
  - Hazardous properties (e.g., GHS hazard classification)
  - Safety data (e.g., handling instructions, first aid measures)
  - Synonyms and common names
  - Regulatory compliance information (e.g., REACH, OSHA requirements)

## Request Examples
Here are examples of how to make requests to the API: