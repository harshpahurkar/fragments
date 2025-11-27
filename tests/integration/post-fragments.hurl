# Authenticated POST to /v1/fragments (text/plain)
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" matches "^text/plain(.*)?$"
jsonpath "$.fragment.size" == 19

[Captures]
url: header "Location"

# GET the fragment we just created
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" matches "^text/plain"
header "Content-Length" == "19"
body == "This is a fragment!"
