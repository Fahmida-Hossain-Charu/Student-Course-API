# Test Cases

Execution command: `npm test`

Recorded result: **4 test suites passed, 16 tests passed, 0 failed**. The results below come from the actual local run; no server or Postman session was required.

| ID | Level | Input/action | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| APP-01 | Integration | `GET /` | 200; health body; generated request ID header | Matched expected response and header | Pass |
| APP-02 | Integration | `GET /` with `X-Request-ID: lab-test-123` | 200; same request ID returned | Returned `lab-test-123` | Pass |
| APP-03 | Integration | `POST /students` with malformed JSON | 400 Problem Details response | Returned 400 with `Malformed JSON` details | Pass |
| APP-04 | Integration | `GET /missing` | 404 Problem Details response | Returned endpoint-not-found details | Pass |
| STU-01 | Integration lifecycle | POST, list, retrieve, PUT, PATCH, DELETE, retrieve/list again | 201/200/200/200/200/204/404/200; bodies and state change correctly | Every status, body, header, and final empty state matched | Pass |
| STU-02 | Integration | Empty name/department and invalid email | 422 with a message for each invalid field | Returned all three field messages | Pass |
| STU-03 | Integration | PUT with only name; PATCH with only name | PUT 422 for missing fields; PATCH 200 preserving other fields | Matched expected full/partial behavior | Pass |
| STU-04 | Integration | Create `ayesha@example.com`, then `AYESHA@EXAMPLE.COM` | Second POST returns 409 | Returned 409 conflict | Pass |
| STU-05 | Integration | `GET /students/999` | 404 student Problem Details | Returned 404 | Pass |
| STU-06 | Integration | Create in one app instance; list from a fresh instance | Fresh instance returns an empty list | Returned `[]` | Pass |
| CRS-01 | Integration lifecycle | POST, list, retrieve, PUT, PATCH, DELETE, retrieve/list again | 201/200/200/200/200/204/404/200; bodies and state change correctly | Every status, body, header, and final empty state matched | Pass |
| CRS-02 | Integration | Empty name/code and non-positive credits | 422 with a message for each invalid field | Returned all three field messages | Pass |
| CRS-03 | Integration | PUT with only name; empty PATCH | Both return 422 with relevant messages | Matched expected validation | Pass |
| CRS-04 | Integration | Create lowercase `cse-410`, then duplicate `CSE-410` | Normalize first code; second POST returns 409 | Returned `CSE-410`, then 409 | Pass |
| CRS-05 | Integration | `DELETE /courses/999` | 404 course Problem Details | Returned 404 | Pass |
| SVC-01 | Unit | Call `StudentService.create` directly with padded/mixed-case values, then duplicate email | Trim fields, lowercase email, store resource, reject duplicate | Normalized/stored resource and threw conflict | Pass |

## Lifecycle coverage

`STU-01` and `CRS-01` each use one real Express application instance through Supertest. They exercise the JSON middleware, router/controller, service, repository, response headers, stored state, and centralized error handler without mocking those components. Other integration tests use fresh application instances for isolation.
