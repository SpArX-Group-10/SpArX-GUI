class ModelInfo {
    /**
     *
     * @param {LayerInfo} inputLayerInfo
     * @param {LayerInfo[]} layerInfos
     * @param {LayerInfo} outputLayerInfo
     */
    constructor(inputLayerInfo, layerInfos, outputLayerInfo) {
        this.layerInfos = [inputLayerInfo, ...layerInfos, outputLayerInfo];
    }

    /**
     *
     * @returns {ModelInfo} - Empty modelinfo.
     */
    static empty() {
        return new ModelInfo(null, [], null);
    }
}

export default ModelInfo;
