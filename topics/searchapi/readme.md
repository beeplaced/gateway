# Chemical Substance Search API Documentation

Welcome to the Chemical Substance Search API documentation. This API allows you to search for chemical substances in our database by CAS (Chemical Abstracts Service) number. The API is designed to return exactly one result that matches the provided CAS number.

## Authentication

To use the API, you need to obtain an API key and access credentials. Contact our support team to request API access.

## Endpoint

### Search for Chemical Substance by CAS Number

- **Endpoint:** `/chemicals/search`
- **HTTP Method:** GET
- **Description:** Search for a chemical substance in our database by CAS number. The API is designed to return exactly one result based on the provided CAS number.

#### Request Parameters

- `cas_number` (string, required): The CAS number of the chemical substance you want to search for.

#### Example Request

```http
GET /chemicals/search?cas_number=123-45-6
```
# Chemical Substance Search API Documentation

Welcome to the Chemical Substance Search API documentation. This API allows you to search for chemical substances in our database by CAS (Chemical Abstracts Service) number. The API is designed to return exactly one result that matches the provided CAS number.

## Authentication

To use the API, you need to obtain an API key and access credentials. Contact our support team to request API access.

## Endpoint

### Search for Chemical Substance by CAS Number

- **Endpoint:** `/chemicals/search`
- **HTTP Method:** GET
- **Description:** Search for a chemical substance in our database by CAS number. The API is designed to return exactly one result based on the provided CAS number.

#### Request Parameters

- `cas_number` (string, required): The CAS number of the chemical substance you want to search for.

#### Example Request

```http
GET /chemicals/search?cas_number=123-45-6
```

### Response
If a single match is found, the API will return a JSON object with the details of the matched chemical substance.
If multiple matches are found, the API will return the first match and include a message indicating that multiple matches were found.

**Single Match (200 OK)**
```json
{
  "name": "Chemical A",
  "cas_number": "123-45-6",
  "molecular_weight": 100.0
}
```

**Multiple Matches (200 OK)**
```json
{
  "message": "Multiple matches found. Returning the first match.",
  "result": {
    "name": "Chemical A",
    "cas_number": "123-45-6",
    "molecular_weight": 100.0
  }
}

```

### Error Handling
If the provided CAS number is not found in the database, the API will return an error response (e.g., HTTP 404 Not Found) with a message indicating that no match was found.

### Usage
Obtain API access credentials.
Make a GET request to the /chemicals/search endpoint, providing the cas_number parameter.
Check the API response for the result or error message.

### Contact
If you have any questions or need assistance, please contact our support team at support@example.com.