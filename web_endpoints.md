# Mayura Weight Scale — Web Dashboard API Reference

> **Base URL:** `https://aviation-rolling-why-expired.trycloudflare.com`
> 
> **Authentication:** All requests must include the `X-API-Key` header.

```
X-API-Key: 3469454584544589548954^%@&&^#@^#**^@^%#$%@#$@##
```

---

## 1. List Patient Records (Paginated + Filtered)

**Endpoint:** `GET /api/patient-impedance/`

Use this to power the **History / Dashboard table view** in the web app. Returns a lightweight list of records without the heavy AI JSON blob.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `start_date` | `YYYY-MM-DD` | No | Today | Filter records from this date |
| `end_date` | `YYYY-MM-DD` | No | Today | Filter records up to this date |
| `patient_uhid` | `string` | No | — | Filter by Patient UHID |
| `phone_number` | `string` | No | — | Filter by Phone Number |
| `username` | `string` | No | — | Filter by username |
| `gender` | `string` | No | — | Filter by gender (`Male` / `Female`) |
| `limit` | `integer` | No | `100` | Number of records per page |
| `offset` | `integer` | No | `0` | Skip N records (for pagination) |

### Example Requests

```
# Get all records for today (default behavior)
GET /api/patient-impedance/

# Get records for a specific date range
GET /api/patient-impedance/?start_date=2026-04-01&end_date=2026-04-22

# Search by patient UHID
GET /api/patient-impedance/?patient_uhid=123456

# Paginate - page 2 (100 records per page)
GET /api/patient-impedance/?limit=100&offset=100

# Combined filter + pagination
GET /api/patient-impedance/?start_date=2026-04-22&limit=20&offset=0
```

### Response (200 OK)

```json
{
  "status": "success",
  "data": [
    {
      "patient_full_body_impedance_id": "4001e7c8-0544-45f5-9808-c0cf331616c1",
      "patient_uhid": "123456",
      "username": "John Doe",
      "phone_number": "7013240357",
      "gender": "Male",
      "age": 23,
      "height": 173,
      "weight_kg": 63.05,
      "dob": "2002-04-08",
      "sex": 1,
      "processing_status": "completed",
      "created_at": "2026-04-22T09:06:54.466463Z"
    }
  ],
  "pagination": {
    "limit": 100,
    "offset": 0
  }
}
```

> **Note:** `ai_response_data` is intentionally excluded from this endpoint to keep the list view fast. Use Endpoint #2 to fetch the full AI body composition details for a specific record.

---

## 2. Get Single Patient Record (Full AI Detail)

**Endpoint:** `GET /api/patient-impedance/{record_id}`

Use this to power the **Patient Detail / Report Page** in the web app. Returns the complete record including all 30+ AI-computed body composition metrics.

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `record_id` | `UUID string` | The `patient_full_body_impedance_id` from the list view |

### Example Request

```
GET /api/patient-impedance/4001e7c8-0544-45f5-9808-c0cf331616c1
```

### Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "patient_full_body_impedance_id": "4001e7c8-0544-45f5-9808-c0cf331616c1",
    "patient_uhid": "123456",
    "username": "John Doe",
    "phone_number": "7013240357",
    "gender": "Male",
    "age": 23,
    "height": 173,
    "weight_kg": 63.05,
    "dob": "2002-04-08",
    "processing_status": "completed",
    "created_at": "2026-04-22T09:06:54.466463Z",
    "ai_response_data": {
      "code": 200,
      "msg": "Success",
      "data": {
        "lefuBodyData": [
          { "bodyParamName": "BMI (Body Mass Index)", "currentValue": 21.0 },
          { "bodyParamName": "Body Fat Rate", "currentValue": 18.5 },
          { "bodyParamName": "Skeletal Muscle Mass", "currentValue": 26.9 },
          { "bodyParamName": "Visceral Fat Grade", "currentValue": 4.0 },
          { "bodyParamName": "Basal Metabolic Rate", "currentValue": 1620.0 },
          { "bodyParamName": "Body Water Rate", "currentValue": 62.5 },
          { "bodyParamName": "Subcutaneous Fat Rate", "currentValue": 16.2 },
          { "bodyParamName": "Protein Rate", "currentValue": 17.8 }
        ]
      }
    }
  }
}
```

### Response (404 Not Found)

```json
{
  "detail": "Record not found"
}
```

---

## 3. Health Check

**Endpoint:** `GET /api/health`

Use this on the web app startup or dashboard to verify backend connectivity status.

### Example Request

```
GET /api/health
```

### Response (200 OK)

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

## Notes for Web Developer

- **Default Date Behaviour**: If you don't pass any date filters to endpoint #1, it automatically returns only **today's records**. To show all-time history, always pass explicit `start_date` and `end_date`.
- **Pagination Logic**: Use `limit` and `offset` together. For page 1: `offset=0`, page 2: `offset=limit`, page 3: `offset=limit*2`, etc.
- **Status Values**: `processing_status` can be `"pending"` (AI still processing) or `"completed"` (AI data is ready).
- **Record Detail Navigation**: In your list table, on row click, navigate to the detail page using `patient_full_body_impedance_id` as the route param.
