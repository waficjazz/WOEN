import os
import argparse
import yaml
import json
import requests
from prettytable import PrettyTable
from jsonschema import validate




SERVER =  os.environ.get('SERVER', 'http://localhost:5001')
ACCESS_TOKEN = os.environ.get('ACCESS_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoid2FmIiwiaWF0IjoxNjgwMjc0MjAxLCJleHAiOjMxNzIyNDcxNjYwMX0.iS8SD0DiyMIPAsZwcNQ87iRvV5YejCV2j9D5iJ8rReQ')
PROJECT_ID = os.environ.get('PROJECT_ID', '2')



def validate_yaml(yaml_file_path, schema_file_path):
    with open(yaml_file_path) as yaml_file, open(schema_file_path) as schema_file:
        yaml_data = yaml.safe_load(yaml_file)
        schema = yaml.safe_load(schema_file)

    validate(instance=yaml_data, schema=schema)
    print(f"{yaml_file_path} is valid according to {schema_file_path}")


def parse_yaml(file_path):
    print("entered parse_yaml")
    with open(file_path, 'r') as f:
        data = yaml.safe_load(f)
    print(file_path)
    print(data)

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

    if hasattr(args, 'template_command'):
        if args.template_command == 'list':
            list_templates()

        elif args.template_command == 'validate':
            validate_yaml(args.filename, 'schema.json')

    
    

if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='PROG', description='Description of your program')
    subparsers = parser.add_subparsers(help='sub-command help')

    parser_list = subparsers.add_parser('list', help='list workflows or templates')
    parser_list.add_argument('list_args', help='list workflows or templates', choices=['workflows', 'templates'])

    parser_template = subparsers.add_parser('template', help='template-related commands')
    template_subparsers = parser_template.add_subparsers(help='sub-command help')

    parser_template_list = template_subparsers.add_parser('list', help='list templates')
    parser_template_list.set_defaults(template_command='list')

    parser_template_validate = template_subparsers.add_parser('validate', help='validate a template')
    parser_template_validate.set_defaults(template_command='validate')
    parser_template_validate.add_argument('filename', help='template filename')



    # parser.set_defaults(func=lambda x: parser.print_help())

    args = parser.parse_args()

    # args.func(args)

    main(args)