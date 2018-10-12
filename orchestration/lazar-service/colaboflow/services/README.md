# Info

`ColaboFlowServiceWorker` is a class that handles services (workers) and opens them to other colaboflow local or remote consumers

# Config

Config file is a JSON file, that is stored in the same folder as a main python script. For the convenience we have provided an example config file in this folder: `config-server-example.json`.

You have to **rename** it to `config-server.json` and **move** it to the same folder with your main script.

# Example

We have also provided a simple client of this class: `colaboflow_service_demo.py`.

It helps you to understand how you can wrap your own code/service into Colabo.Space and more precisely, ColaboFlow ecosystem.