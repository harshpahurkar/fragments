# tests/integration/convert-markdown-html.hurl
# Test markdown to HTML conversion

POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
```
# Title
```

HTTP/1.1 201
[Captures]
id: jsonpath "$.fragment.id"

GET http://localhost:8080/v1/fragments/{{id}}.html
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
header "Content-Type" contains "text/html"
body contains "<h1>Title</h1>"
