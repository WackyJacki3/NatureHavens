import User from "../models/user.js"

const renderRegister = (req, res) => {
    res.render("users/register")
}

const register = (async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User ({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err) {
            if(err) {
                return next(err);
            }
            req.flash("success", "Weclome to Yelp Camp!");
            res.redirect("/campgrounds");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
})

const renderLogin = (req, res) => {
    res.render("users/login");
}

const login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
}

const logout = (req, res, next) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/campgrounds");
    })
}

export {
    renderRegister,
    register,
    renderLogin,
    login,
    logout
}
