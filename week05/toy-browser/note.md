## resoponse

HTTP/1.1 200 OK      status line
Content-Type: text/html         headers
...
\r\n
\r\n
2                           body
OK
0


resoponseParser

WAIT_STATUS_LINE
WAIT_STATUS_LINE_END
WAIT_HEADER_NAME
WAIT_HEADER_SPACE
WAIT_HEADER_VALUE
WAIT_HEADER_LINE_END
WAIT_HEADER_BLOCK
WAIT_HEADER_BLOCK_END
WAIT_BODY


bodyParse
WAIT_LENGTH
WAIT_LENGTH_LINE_END
WAIT_CONTENT
WAIT_CONTENT_END
