const protectedRoute = (req,res,next)=>{
    if(!req.session.user)
    {
        return res.redirect('/admin/login'); 
    }
    next();
}

const guestdRoute = (req,res,next)=>{
    if(req.session.user)
    {
        return res.redirect('/admin/dashboard'); 
    }
    next();
}


module.exports = {protectedRoute,guestdRoute}