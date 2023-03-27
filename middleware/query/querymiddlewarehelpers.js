const searcHelpers = (searchkey, query, req) => {
    if (req.query.search) {
        const searchObject = {};

        const regex = new RegExp(req.query.search, "i");

        searchObject[searchkey] = regex;
        return query.where(searchObject);
    }
    return query;
};
const populateHelpers = (query, population) => {

    return query.populate(population);
};
const querysortHelpers = (query, req) => {

    const sortkey = req.query.sortBy;
    if (sortkey === "most-answered") {
        return query.sort("-answerCount -createdAt"); //sort büyükten küçüğe
    }
    if (sortkey === "most-liked") {
        return query.sort("-likeCount -createdAt");
    }
    return query.sort("-createdAt")


};
const paginationHelpers = async (totalDocument, query, req) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 5;
    const total = totalDocument;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    if (startIndex < 0) {
        pagination.previous = {
            page: page - 1,
            limit: limit
        }
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }
    return {
        query: query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination: pagination,
        startIndex,
        limit
    };
};

module.exports = { searcHelpers, populateHelpers, querysortHelpers, paginationHelpers };