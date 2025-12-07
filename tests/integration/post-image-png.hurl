# tests/integration/post-image-png.hurl
# Test POST PNG image

POST http://localhost:8080/v1/fragments
Content-Type: image/png
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==;

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "image/png"
jsonpath "$.fragment.size" > 0
