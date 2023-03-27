const asyncerrorwrapper = require("express-async-handler");
const { searcHelpers, paginationHelpers } = require("./querymiddlewarehelpers");
const userquesrymiddleware = function (model, options) {

    return asyncerrorwrapper(async (req, res, next) => {
        let query = model.find();

        query = searcHelpers("name", query, req);
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
module.exports = userquesrymiddleware;