const CustomEror = require("../../helpers/error/CustomError");
const customerrorHand = (err, req, res, next) => {
    let customerror = err;

    if (err.name == "SyntaxError") {
        customerror = new CustomEror("Unexpected Syntax", 400)
    }
    if (err.name == "ValidationError") {
        customerror = new CustomEror(err.message, 400)
    }
    if (err.name == "CastError") {
        customerror = new CustomEror("Please Provide a valid ID", 400)
    }

    res.status(customerror.statusn || 500).
        json({
            succsess: false,
            message: customerror.message
        });
};

module.exports = customerrorHand;