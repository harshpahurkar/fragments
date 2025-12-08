# tests/integration/fragment-tags.hurl
# Test 1: Create fragment with tags
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
X-Tags: work, important, draft
```
Fragment with tags
```
HTTP/1.1 201
[Captures]
work_fragment_url: header "Location"
[Asserts]
jsonpath "$.fragment.tags" count == 3
jsonpath "$.fragment.tags[0]" == "work"
jsonpath "$.fragment.tags[1]" == "important"
jsonpath "$.fragment.tags[2]" == "draft"

# Test 2: Create another fragment with different tags
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
X-Tags: personal, notes
```
Personal fragment
```
HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.tags" count == 2
jsonpath "$.fragment.tags[0]" == "personal"

# Test 3: Get all fragments with expand to see tags
GET http://localhost:8080/v1/fragments?expand=1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" count >= 2
jsonpath "$.fragments[*].tags" exists

# Test 4: Filter fragments by tag 'work'
GET http://localhost:8080/v1/fragments?expand=1&tag=work
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" count >= 1
jsonpath "$.fragments[0].tags" includes "work"

# Test 5: Update fragment tags via PUT
PUT {{work_fragment_url}}
Content-Type: text/plain
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
X-Tags: completed, archived
```
Updated content with new tags
```
HTTP/1.1 200
[Asserts]
jsonpath "$.fragment.tags" count == 2
jsonpath "$.fragment.tags[0]" == "completed"
jsonpath "$.fragment.tags[1]" == "archived"
