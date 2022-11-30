class LayerInfo {
    /**
     *
     * @param {Number} nueronCount
     * @param {ActivationFunction} activationFunction
     */
    constructor(nueronCount, activationFunction) {
        this.nueronCount = nueronCount;
        this.activationFunction = activationFunction;
    }
}

export default LayerInfo;
