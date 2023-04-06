import os
import argparse
import yaml
import json
import requests



SERVER =  os.environ.get('SERVER', 'http://localhost:5001')
ACCESS_TOKEN = os.environ.get('ACCESS_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoid2FmIiwiaWF0IjoxNjgwMjc0MjAxLCJleHAiOjMxNzIyNDcxNjYwMX0.iS8SD0DiyMIPAsZwcNQ87iRvV5YejCV2j9D5iJ8rReQ')
PROJECT_ID = os.environ.get('PROJECT_ID', '2')


def list_workflows():
    url = SERVER + '/api/v1/workflow/all/' + PROJECT_ID
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
    return json_data


def main(args):
    print(list_workflows())

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Description of your program')
    parser.add_argument('filepath',nargs="?", help='Filepath of the YAML file to process' )
    args = parser.parse_args()

    main(args)