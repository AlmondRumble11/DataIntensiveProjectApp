const jwt = require('jsonwebtoken')

//Source: https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified

module.exports = {

    authenticateToken: function (req, res, next) {
        const authToken = req.get('authorization').slice(7);
        if (authToken == null) {
            return res.status(401).send({message: 'Unauthorized access.'});
        }
        jwt.verify(authToken, process.env.ACCESS_SECRET, (err, jwtPayload) => {
            if (err){
                return res.status(403).send({message: 'Forbidden access'});
            } else{
                req.user = {
                    id: jwtPayload.id,
                    email: jwtPayload.email
                }
                next();
            }
            
            
        }) 
    }

}

