# Install

## Users

+ ansible/variables/users-list.json

This playbook will create general users necesary for the system to run. There are no special users (so far) necessary for ColaboFlow.

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/users.yml
```

## Init (files, etc)

+ ansible/variables/files-list.json
+ Path: `ansible/playbooks/init.yml`

This playbook will create general files and folders necesary for the system to run.

There are no special folders (so far) necessary for ColaboFlow.

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/init.yml
```

## Apps (apts)

+ ansible/variables/apts-list.json
+ Path: `ansible/playbooks/apts.yml`

This playbook installs apps via `apt` 

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/init.yml
```

There are no special packages (so far) necessary for ColaboFlow.

## Nginx

+ ansible/variables/nginx-list.json
+ Path: `ansible/playbooks/nginx.yml`

This playbook installs nginx and configures all hosts

There is a need for providing the API paths to the colaboflow services

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/nginx.yml
```

***NOTE***: If you are installing certificates (as you should :) ), you should install `certbot` support first:

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"], "active_tags": ["certificates"]}' playbooks/remote_builds.yml
```

TBD

## GITs

+ ansible/variables/gits-list.json

This playbook clones git repos to the remote hosts and sets the folders and files privileges

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/gits.yml
```

We need `colabo` repo cloned

```json
{
        "key": "colabo",
        "repo": "https://github.com/cha-OS/colabo/",
        "dest": "/var/repos/colabo",
        "depth": 1,
        "force": true,
        "recursive": true,
        "owner": "www-data",
        "group": "developers",
        "mode": "ug=rwX,o=rX,g+s"
    }
```

## Python

+ ansible/variables/python-list.json

This playbook builds python parts of the projects.

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/python.yml
```

```json
        // todo: could go into `requirements-colaboflow.txt`
        // install support for MongoDB
        {
            "key": "pymongo",
            "package": "pymongo",
            "type": "pip23",
            "_virtualenv": "/var/services/colabo-env-python"
        },
        // install ColaboFlow requirements
        {
            "key": "requirements-colaboflow",
            "type": "requirements23",
            "_virtualenv": "/var/services/colabo-env-python",
            "requirements": "../variables/requirements-colaboflow.txt"
        }
```

In the `requirements-colaboflow.txt` file, we have:

```txt
# pika
# grpcio
# grpcio-tools

rpyc
colabo.flow.audit==0.2.1
colabo.flow.go==0.2.1
```

## remote builds

+ ansible/variables/remote_builds-list.json

This playbook run different sorts of remote build, mainly focusing to non-standard scenarios, where we prefer direct commands to run instead ansible modules. Therefore, each item that is run is a build command

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/remote_builds.yml
```

We are interested in building:

+ python services
+ installing MongoDB

##  Local builds

+ ansible/variables/local_builds-list.json

This playbook clones git repos to the remote hosts and sets the folders and files privileges. We need it to build ColaboFlow dashboard.

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/local_builds.yml
```

```json
    {
        "key": "colaboflow-dashboard",
        "path": "../../../../../LitTerra/frontend/apps/colaboflow_dashboard/",
        "basehref": "/dashboard/",
        "hosts": [
            "litterra"
        ]
    }
```

## Transfers

+ ansible/variables/transfers.json

This playbook transfers local files/folders to remote hosts

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/transfers.yml
```

We have to transfer colaboflow dashboard frontend, frontend config, and backend config

```json
{
            "key": "colaboflow-dashboard-frontend",
            "src": "../../../../../LitTerra/src/frontend/apps/colaboflow_dashboard/dist/apps_colaboflow_dashboard/",
            "dest": "/var/www/colaboflow-dashboard-frontend/",
            "delete": false,
            "mode": "push",
            "recursive": true,
            "file_owner": "www-data",
            "file_group": "developers",
            "file_mode": "ug=rwX,o=rX,g+s",
            "file_state": "directory",
            "_tags": [
                "colaboflow"
            ],
            "hosts": [
                "_litterra"
            ]
        },
        {
            "key": "colaboflow-dashboard-frontend-config",
            "src": "../../files/frontend/global-server.js",
            "dest": "/var/www/colaboflow-dashboard-frontend/config/global.js",
            "delete": false,
            "mode": "push",
            "recursive": false,
            "file_owner": "www-data",
            "file_group": "developers",
            "file_mode": "ug=rwX,o=rX,g+s",
            "file_state": "file",
            "_tags": [
                "colaboflow"
            ],
            "hosts": [
                "_litterra"
            ]
        },
        {
            "key": "colaboflow-dashboard-backend-config",
            "src": "../../files/backend/global-server.js",
            "dest": "/var/repos/litterra/src/backend/apps/colaboflow_dashboard/dist/config/global.js",
            "dest_folder_create": "/var/repos/litterra/src/backend/apps/colaboflow_dashboard/dist/config/",
            "delete": false,
            "mode": "push",
            "recursive": false,
            "file_owner": "www-data",
            "file_group": "developers",
            "file_mode": "ug=rwX,o=rX,g+s",
            "file_state": "file",
            "_tags": [
                "colaboflow"
            ],
            "hosts": [
                "litterra"
            ]
        }
```

## Yarns

This playbook installs remote npm packages with `yarn`

```sh
ansible-playbook -i variables/hosts.yaml -e 'ansible_ssh_user=orchestrator' --private-key ~/.ssh/orchestration-iaas-no.pem --extra-vars '{"active_hosts_groups": ["litterra"]}' playbooks/yarns.yml
```

```json
{
            "key": "s-colaboflow-audit",
            "name": "",
            "global": false,
            "path": "/var/repos/colabo/src/services/services/colaboflow-audit",
            "production": false,
            "state": "present",
            "hosts": [
                "services",
                "litterra"
            ]
        },
        {
            "key": "s-colaboflow-go",
            "name": "",
            "global": false,
            "path": "/var/repos/colabo/src/services/services/colaboflow-go",
            "production": false,
            "state": "present",
            "hosts": [
                "services",
                "litterra"
            ]
        }
```

## Database

TBD

## Services

This playbook creates, registers and starts all necessary system services (with SystemD)

