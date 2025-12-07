# tests/integration/put-update-fragment.hurl
# Test PUT updates existing fragment

POST http://localhost:8080/v1/fragments
Content-Type: text/plain
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
```
Original
```

HTTP/1.1 201
[Captures]
url: header "Location"

PUT {{url}}
Content-Type: text/plain
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
```
Updated
```

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"

GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
body contains "Updated"
