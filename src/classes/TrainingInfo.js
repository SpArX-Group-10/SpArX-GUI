class TrainingInfo {
    /**
     *
     * @param {Number} epochs
     * @param {Number} learningRate
     * @param {Number} validationSplit
     * @param {Optimiser} optimiser
     * @param {LossFunction} lossFunction
     */
    constructor(epochs, learningRate, validationSplit, optimiser, lossFunction) {
        this.epochs = epochs;
        this.learningRate = learningRate;
        this.validationSplit = validationSplit;
        this.optimiser = optimiser;
        this.lossFunction = lossFunction;
    }

    /**
     * @returns {TrainingInfo} - Empty training info.
     */
    static empty() {
        return new TrainingInfo(0, 0, 0, null, null);
    }
}

export default TrainingInfo;
