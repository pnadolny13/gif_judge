import os
import json
import boto3
from dynamo import DynamoDB

REQUEST_HANDLED = {"statusCode": 200}

def put_connection(connection_id):
    DynamoDB().put_item(
        "connections",
        {"id": connection_id, "game_id": "5d60c16e-9864-4f9e-a87f-55332a5f8f02"}
    )
    print("Connection saved to Dynamodb")

def delete_connection(connection_id):
    DynamoDB().delete_item(
        "connections",
        {"id": connection_id}
    )
    print("Connection deleted from Dynamodb")

def connection_manager(event, context):
    connection_id = event["requestContext"].get("connectionId")
    if event["requestContext"]["eventType"] == "CONNECT":
        print("Connect requested")
        put_connection(connection_id)
        # you might want to store the connection_id in a database of some sort
        return REQUEST_HANDLED
    elif event["requestContext"]["eventType"] == "DISCONNECT":
        print("Disconnect requested")
        delete_connection(connection_id)
        return REQUEST_HANDLED

def get_connections(game_id):
    return DynamoDB().get_items(
        "connections",
        {}
        # {"game_id": game_id}
    )

def handle_incoming_ws_message(event, context):
    """
    When a message comes in, just echo it back to the sender
    """
    print(event)
    body = event
    all_data = body.get("Records")[0].get("dynamodb")
    table_arn = body.get("Records")[0].get("eventSourceARN")
    new_data = all_data.get("NewImage")
    old_data = all_data.get("OldImage")
    game_id = all_data.get("Keys").get("id").get("S")
    print(game_id, table_arn, new_data, old_data)
    if "requestContext" in event:
        connection_id = event["requestContext"].get("connectionId")
        send_ws_message(connection_id, new_data)
    else:
        for connection_record in get_connections(game_id):
            send_ws_message(connection_record.get("id"), new_data)
    return REQUEST_HANDLED

def default_message(event, context):
    """
    Send back error when unrecognized WebSocket action is received.
    """
    print("Unrecognized WebSocket action received.")
    connection_id = event["requestContext"].get("connectionId")
    send_ws_message(connection_id, {'type':'invalidRequest', 'error':'Unrecognized WebSocket action received.'})
    return REQUEST_HANDLED

def _flatten(dict_obj):
    new_obj = {}
    for key, value in dict_obj.items():
        new_obj[key] = value.get(list(value.keys())[0])
    return new_obj

def send_ws_message(connection_id, body):
    # TODO: also pass through pydantic model
    flat_body = _flatten(body)
    body_str = json.dumps(flat_body)
    _send_to_connection(connection_id, body_str)

def _get_event_body(event):
    try:
        return json.loads(event)
    except ValueError:
        print("event body could not be JSON decoded.")
        return {}

def _send_to_connection(connection_id, data):
    endpoint = os.environ['WEBSOCKET_API_ENDPOINT']
    print(f"Posting message: {str(data)}")
    gatewayapi = boto3.client("apigatewaymanagementapi",
                                endpoint_url=endpoint)
    try:
        return gatewayapi.post_to_connection(ConnectionId=connection_id,
                                            Data=data.encode('utf-8'))
    except gatewayapi.meta.client.exceptions.GoneException as e:
        print(f"Connection {connection_id} Not Found: {e}")
        delete_connection(connection_id)
