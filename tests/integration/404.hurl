# 404 Test
# Request a route that does not exist

GET http://localhost:8080/nonexistent

# Only assert the HTTP status code
HTTP/1.1 404
