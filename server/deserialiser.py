import numpy as np
import pandas as pd
from keras import Sequential
from keras.layers import Dense, Input

from sparx import (
    KMeansClusterer,
    AgglomerativeClusterer,
    LocalMerger,
    GlobalMerger,
    JSONVisualizer,
    Framework,
    endtoend,
)


def sparx_request_deserialiser(json):
    """Deserialise the request json into a dataset, model and config."""
    jdataset = json["dataset"]
    dataset = deserialise_dataset(jdataset["xData"], jdataset["yData"], jdataset["xHeaders"], jdataset["yHeaders"])
    model = deserialise_model(json["modelInfo"]["layerInfos"])
    training_config = json["trainingInfo"]
    sparx_config = deserialise_sparx_config(json["sparxInfo"])

    return {"dataset": dataset, "model": model, "training_config": training_config, "sparx_config": sparx_config}


# convert into numpy array
def deserialise_dataset(xData, yData, xHeaders, yHeaders):
    """Deserialise the dataset."""
    x = pd.DataFrame(xData, columns=xHeaders)
    y = pd.DataFrame(yData, columns=yHeaders)
    return {"x": x, "y": y}


def deserialise_model(layerInfos):
    """Deserialise the model."""
    model = Sequential()

    # input layer
    model.add(Input(shape=(layerInfos[0]["nueronCount"],)))

    # hidden layers
    for layerInfo in layerInfos[1:]:
        model.add(Dense(layerInfo["nueronCount"], activation=layerInfo["activationFunction"]))

    return model


def deserialise_sparx_config(sparx_info):
    """Deserialise the sparx config."""
    clusterer_map = {"kmeans": KMeansClusterer, "agglomerative": AgglomerativeClusterer}
    merger_map = {"local": LocalMerger, "global": GlobalMerger}

    shrinkage = sparx_info["shrinkage"]
    clusterer = clusterer_map[sparx_info["clusterer"]]
    merger = merger_map[sparx_info["merger"]]
    datapoint = np.array(sparx_info["datapoint"])

    return {"shrinkage": shrinkage, "clusterer": clusterer, "merger": merger, "datapoint": datapoint}


def run_end_to_end(configs):
    """Run end to end."""
    dataset = configs["dataset"]
    model = configs["model"]
    training_config = configs["training_config"]
    sparx_config = configs["sparx_config"]

    model.summary()
    model.compile(optimizer=training_config["optimiser"], loss=training_config["lossFunction"])
    model.fit(
        dataset["x"],
        dataset["y"],
        epochs=training_config["epochs"],
        validation_split=training_config["validationSplit"],
    )

    xdata = dataset["x"]
    framework = Framework.KERAS
    clusterer = sparx_config["clusterer"]
    merger = sparx_config["merger"]
    visualiser = JSONVisualizer
    datapoint = sparx_config["datapoint"]
    shrink_factor = sparx_config["shrinkage"]
    return endtoend(xdata, model, framework, clusterer, merger, visualiser, datapoint, shrink_factor)
