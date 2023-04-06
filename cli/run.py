import os
import argparse
import yaml
import json
import requests
from prettytable import PrettyTable



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

    table = PrettyTable(['NAME', 'STATUS'])
    table.border = False
    table.align = 'l'
    for obj in json_data:
        row = [obj['name'], obj['status']]
        table.add_row(row)

    print(table)


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



def main(args):
    if hasattr(args, 'list_args') and args.list_args == 'list':
        list_workflows()

    if hasattr(args, 'templates_args') and args.templates_args == 'list':
        list_templates()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='PROG' , description='Description of your program')
    # parser.add_argument('list',help='Filepath of the YAML file to process' )
    subparsers = parser.add_subparsers(help='sub-command help')

    parser_list = subparsers.add_parser('list', help='a help'  )
    parser_list.add_argument('list_args', help='a help' , action='store_const' , const='list')

    parser_template = subparsers.add_parser('template', help='a help')
    parser_template.add_argument('templates_args', help='a help' , choices=['list'])

    
    parser.set_defaults(func=lambda x: parser.print_help())

    args = parser.parse_args()

    args.func(args)

    main(args)