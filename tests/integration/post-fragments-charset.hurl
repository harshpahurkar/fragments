# POST with Content-Type that includes a charset parameter
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`This is a UTF-8 fragment`

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
# Accept either 'text/plain' or 'text/plain; charset=utf-8' depending on server implementation
jsonpath "$.fragment.type" matches "^text\/plain(.*)?$"
jsonpath "$.fragment.size" isNumber

[Captures]
url: header "Location"

# GET the fragment back
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" matches "^text\/plain(.*)?$"
body contains "This is a UTF-8 fragment"
