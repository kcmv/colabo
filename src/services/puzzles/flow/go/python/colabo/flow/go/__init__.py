# NOTE: In general we should be carefull with importing additional modules in __init__.py because 
# they are imported any time any module or sub-module is required
# import `ColaboFlowGo` class from the local (notice: `.`) file `colaboflow_go`
from .colaboflow_go import ColaboFlowGo

# provide the `ColaboFlowGo` class directly importable from the `audit` namespace
__all__ = ['ColaboFlowGo']
