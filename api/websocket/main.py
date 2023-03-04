import os
import json
import boto3

REQUEST_HANDLED = {"statusCode": 200}


def connection_manager(event, context):
    connection_id = event["requestContext"].get("connectionId")
    if event["requestContext"]["eventType"] == "CONNECT":
        print("Connect requested")
        # you might want to store the connection_id in a database of some sort
        return REQUEST_HANDLED
    elif event["requestContext"]["eventType"] == "DISCONNECT":
        print("Disconnect requested")
        return REQUEST_HANDLED

def handle_incoming_ws_message(event, context):
    """
    When a message comes in, just echo it back to the sender
    """
    body = _get_event_body(event)
    body['type'] = 'echoReply'
    connection_id = event["requestContext"].get("connectionId")
    send_ws_message(connection_id, body)
    return REQUEST_HANDLED

def default_message(event, context):
    """
    Send back error when unrecognized WebSocket action is received.
    """
    print("Unrecognized WebSocket action received.")
    connection_id = event["requestContext"].get("connectionId")
    send_ws_message(connection_id, {'type':'invalidRequest', 'error':'Unrecognized WebSocket action received.'})
    return REQUEST_HANDLED

def send_ws_message(connection_id, body):
    if not isinstance(body, str):
        body = json.dumps(body)
    _send_to_connection(connection_id, body)

def _get_event_body(event):
    try:
        return json.loads(event.get("body", ""))
    except ValueError:
        print("event body could not be JSON decoded.")
        return {}

def _send_to_connection(connection_id, data):
    endpoint = os.environ['WEBSOCKET_API_ENDPOINT']
    gatewayapi = boto3.client("apigatewaymanagementapi",
                              endpoint_url=endpoint)
    return gatewayapi.post_to_connection(ConnectionId=connection_id,
                                         Data=data.encode('utf-8'))
