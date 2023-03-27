const asyncerrorwrapper = require("express-async-handler");
const { populateHelpers, paginationHelpers } = require("./querymiddlewarehelpers");
const answerquesrymiddleware = function (model, options) {

    return asyncerrorwrapper(async (req, res, next) => {
        const { id } = req.params;
        const arrayName = "answers";

        const total = (await model.findById(id))["answerCount"];

        const paginationResult = await paginationHelpers(total, undefined, req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        let queryOBject = {};

        queryOBject[arrayName] = { $slice: [startIndex, limit] };

        let query = model.find({ _id: id }, queryOBject);

        query = populateHelpers(query, options.population);

        const queryResult = await query;
        res.queryResult = {
            success: true,
            count: queryResult.length,
            pagination: paginationResult.pagination,
            data: queryResult
        }
        next();
    });
};
module.exports = answerquesrymiddleware;