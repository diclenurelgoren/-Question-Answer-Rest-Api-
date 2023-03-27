const sendtojwtclient = (user, res) => {
    const token = user.generateJWTfromuser();
    const { NODE_ENV, JWT_COOKIE } = process.env;

    return res
        .status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + JWT_COOKIE * 1000 * 60),
            secure: NODE_ENV === "deveploment" ? false : true
        })
        .json({
            success: true,
            access_token: token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                block: user.blocked
            }
        });
};

const IstokenIncluded = (req) => {
    return (req.headers.authorization && req.headers.authorization.startsWith('Bearer:'));
};

const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;
    const access_token = authorization.split(" ")[1];
    return access_token;
}
module.exports = { sendtojwtclient, IstokenIncluded, getAccessTokenFromHeader };