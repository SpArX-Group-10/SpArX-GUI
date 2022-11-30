class SparxInfo {
    /**
     *
     * @param {number} shrinkage
     * @param {Clusterer} clusterer
     * @param {Mergerer} merger
     * @param {Number[]} datapoint
     */
    constructor(shrinkage, clusterer, merger, datapoint = null) {
        this.shrinkage = shrinkage;
        this.clusterer = clusterer;
        this.merger = merger;
        this.datapoint = datapoint;
    }

    static empty() {
        return new SparxInfo(0, null, null, null);
    }
}

export default SparxInfo;
