import os
import requests
from prettytable import PrettyTable
from jsonschema import validate

SERVER =  os.environ.get('SERVER', 'http://localhost:5001')
ACCESS_TOKEN = os.environ.get('ACCESS_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoid2FmIiwiaWF0IjoxNjgwMjc0MjAxLCJleHAiOjMxNzIyNDcxNjYwMX0.iS8SD0DiyMIPAsZwcNQ87iRvV5YejCV2j9D5iJ8rReQ')
PROJECT_ID = os.environ.get('PROJECT_ID', '2')




def list_templates():
    url = SERVER + '/api/v1/workflow/all/templates/' + PROJECT_ID
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {ACCESS_TOKEN}'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
    except requests.exceptions.HTTPError as error:
        print(f'Error: {error}')
        return None

    json_data = response.json()

    table = PrettyTable(['NAME'])
    table.border = False
    table.align = 'l'
    for obj in json_data:
        row = [obj['name']]
        table.add_row(row)

    print(table)