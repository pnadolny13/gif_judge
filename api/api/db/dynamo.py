import os

import boto3
from boto3.dynamodb.conditions import Key


class DynamoDB:
    
    def __init__(self):
        self.dynamodb = self._get_session().resource('dynamodb')

    def _get_session(self):
        return boto3.Session(
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SAWS_SECRET_ACCESS_KEYECRET"],
            region_name="us-east-1"
        )

    def put_item(self, table_name: str, content: dict):
        table = self.dynamodb.Table(table_name)      
        return table.put_item(Item=content)

    def get_item(self, table_name: str, filter: dict):
        table = self.dynamodb.Table(table_name)      
        resp = table.get_item(Key=filter)
        if 'Item' in resp:
            return resp['Item']

    def get_items(self, table_name: str, filter: dict):
        table = self.dynamodb.Table(table_name)      
        resp = table.get_item(Key=filter)
        if 'Item' in resp:
            return resp['Item']

    def update_item(self, table_name: str, key: dict, expression: str, attrb_vals: dict):
        table = self.dynamodb.Table(table_name)      
        resp = table.update_item(
            Key=key,
            UpdateExpression=expression,
            ExpressionAttributeValues=attrb_vals,
            ReturnValues="ALL_NEW"
        )
        return resp
