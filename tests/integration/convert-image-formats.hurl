# tests/integration/convert-image-formats.hurl
# Test image format conversions

POST http://localhost:8080/v1/fragments
Content-Type: image/png
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==;

HTTP/1.1 201
[Captures]
id: jsonpath "$.fragment.id"

GET http://localhost:8080/v1/fragments/{{id}}.jpg
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
header "Content-Type" contains "image/jpeg"

GET http://localhost:8080/v1/fragments/{{id}}.webp
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
header "Content-Type" contains "image/webp"
