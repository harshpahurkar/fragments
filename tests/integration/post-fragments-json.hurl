# POST a JSON fragment and GET it back
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"message":"hello","count":1}`

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" isNumber
[Captures]
url: header "Location"

# GET the fragment we just created
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" matches "^application/json"
jsonpath "$.message" == "hello"
jsonpath "$.count" == 1
