const asyncerrorwrapper = require("express-async-handler");
const { searcHelpers, populateHelpers, querysortHelpers, paginationHelpers } = require("./querymiddlewarehelpers");
const questionquesrymiddleware = function (model, options) {

    return asyncerrorwrapper(async (req, res, next) => {

        let query = model.find();
        query = searcHelpers("title", query, req);

        if (options || options.population) {
            query = populateHelpers(query, options.population);
        }
        query = querysortHelpers(query, req);
        const total = await model.countDocuments();
        const paginationResult = await paginationHelpers(total, query, req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const queryResult = await query;

        res.queryResult = {
            success: true,
            count: queryResult.length,
            pagination: pagination,
            data: queryResult
        }
        next();
    });
};

module.exports = questionquesrymiddleware;