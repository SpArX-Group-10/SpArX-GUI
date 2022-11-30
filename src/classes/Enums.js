const ActivationFunction = {
    None: "none",
    Sigmoid: "sigmoid",
    Tanh: "tanh",
    ReLU: "relu",
    Softmax: "softmax",
};

const Optimiser = {
    SGD: "sgd",
    RMSProp: "rmsprop",
    Adam: "adam",
};

const LossFunction = {
    MeanSquaredError: "mean_squared_error",
    BinaryCrossentropy: "binary_crossentropy",
    CategoricalCrossentropy: "categorical_crossentropy",
};

const Clusterer = {
    KMeans: "kmeans",
    Agglomerative: "agglomerative",
};

const Merger = {
    Global: "global",
    Local: "local",
};

export { ActivationFunction, Optimiser, LossFunction, Clusterer, Merger };
