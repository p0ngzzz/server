const authMiddleware = async (req, res, next) => {
    if(req.user?.id) return next();

    res.sendStatus(401) //unauthorized
}

module.exports = authMiddleware