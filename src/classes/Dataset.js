class Dataset {
    /**
     *
     * @param {Number[][]} xData - The data of the features.
     * @param {Number[][]} yData - The data of the labels.
     * @param {string[]} xHeaders - The headers of the features.
     * @param {string[]} yHeaders - The headers of the labels.
     */
    constructor(xData, yData, xHeaders, yHeaders) {
        this.xData = xData;
        this.yData = yData;
        this.xHeaders = xHeaders;
        this.yHeaders = yHeaders;
    }

    /**
     *
     * @returns {Number[]} - The number of neurons in the input and the ouput layer.
     */
    getInOutShape() {
        return [this.xHeaders.length, this.yHeaders.length];
    }

    /**
     *
     * @returns {Number[]} - A datapoint from the dataset.
     */
    getRandomXDatapoint() {
        return this.xData[Math.floor(Math.random() * this.xData.length)];
    }

    /**
     * Attempts to convert a string array to a one-hot array,
     * if the header is not a string, it is returned as is.
     *
     * @param {string[]} headers
     * @param {Number[][]} data
     * @returns {[string[], Object[]]}
     */
    static headerDataToOneHot(headers, data) {
        let oneHotHeader = [];
        let oneHotData = Array.from(Array(data.length)).map(() => []);

        // do onehot for each header if needed
        for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
            if (typeof data[0][headerIndex] !== "string") {
                oneHotHeader.push(headers[headerIndex]);
                data.forEach((entry, entryIndex) => oneHotData[entryIndex].push(entry[entryIndex]));
            } else {
                // find all the unique values
                let uniqueValues = new Set();
                data.forEach((entry) => uniqueValues.add(entry[headerIndex]));
                let uniqueArray = Array.from(uniqueValues);

                // create a new header for each unique value
                oneHotHeader.push(...uniqueValues);

                // create a new data entry for each unique value
                data.forEach((entry, entryIndex) => {
                    let row = Array(uniqueValues.size).fill(0);
                    row[uniqueArray.indexOf(entry[headerIndex])] = 1;
                    oneHotData[entryIndex].push(...row);
                });
            }
        }
        return [oneHotHeader, oneHotData];
    }

    /**
     * Constructs a Dataset object from a CSV file.
     * @param {Object[]} dataset - The dataset to construct from.
     * @param {string[]} headers - The headers of the dataset.
     * @param {boolean[]} features - List of boolean values indicating whether the feature is selected.
     * @returns {Dataset}
     */
    static constructFilteredData(dataset, headers, features) {
        // Pre: label is the last column
        features.push(false);
        const xHeaders = headers.filter((_, i) => features[i]);
        let yHeaders = [headers[headers.length - 1]];

        let xData = [];
        let yData = [];

        for (let entry of dataset) {
            let xEntry = [];

            for (let i = 0; i < xHeaders.length; i++) {
                xEntry.push(entry[xHeaders[i]]);
            }

            xData.push(xEntry);
            yData.push([entry[yHeaders[0]]]);
        }

        [yHeaders, yData] = Dataset.headerDataToOneHot(yHeaders, yData);

        return new Dataset(xData, yData, xHeaders, yHeaders);
    }

    /**
     *
     * @returns {Dataset} - A empty dataset.
     */
    static empty() {
        return new Dataset([], [], [], []);
    }
}

export default Dataset;
