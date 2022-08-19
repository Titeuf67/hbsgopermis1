exports.setSession = async function (req, res, email) {
  let userget = await db.query(`SELECT * FROM user WHERE email="${email}"`)
  let user = userget[0];
  
  req.session.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    account_create: user.create_time,
    // isAdmin: user.isAdmin
  };

  res.redirect('/')
}