# import `ColaboKnalledgeMongo` class from the local (notice: `.`) file `knalledge_mongo`
from .knalledge_mongo import ColaboKnalledgeMongo

# provide the `ColaboKnalledgeMongo` class directly importavle from the `knalledge` namespace
__all__ = ['ColaboKnalledgeMongo'];
