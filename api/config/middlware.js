module.exports = {
    isAdmin: async (req, res, next) => {
      if(!req.session.user) return res.redirect('/')
      const [user] = await db.query(`SELECT isAdmin FROM user WHERE email="${req.session.user.email}"`);
      console.log(user);
      (user.isAdmin === req.session.user.isAdmin && user.isAdmin === 0 ) ? res.redirect('/') : next();
    }
}

module.exports = {
  isBan: async (req, res, next) => {
    if(req.session.user) return res.redirect('/')
    const [user] = await db.query(`SELECT isBan FROM user WHERE email="${req.session.user.email}"`);
    console.log(user);
    (user.isBan === req.session.user.isBan && user.isBan === 0 ) ? res.redirect('/') : next();
  }
}
