// exports.setSession = async function (req, res, email) {
//     let userget = await db.query(`SELECT * FROM user WHERE email="${email}"`)
//     let user = userget[0];
    
//     req.session.user = {
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       account_create: user.create_time,
//       isAdmin: user.isAdmin
//     };
  
//     res.redirect('/')
//   }

exports.setSession = (req, res, email) => {
  // console.log('setSession', email)
//   let userget = await db.query(`SELECT * FROM user WHERE email="${email}"`)
//   let user = userget[0];
//   console.log("user",user);
  
  db.query(`SELECT * FROM user WHERE email="${email}"`, (err, data) => {
      if (err) {
          console.log('err', err)
          res.end()
      } else {
        //    console.log('setSess', data[0])
          req.session.user = {
              ...data[0]
              // name: data[0].name,
              // surname: user.surname,
              // username: data[0].username,
              // email: email$,
              // account_create: created_at,
              // isAdmin: user.isAdmin
          };
          
          delete req.session.user.password
          console.log("info data",data[0]);
          res.redirect('/')
      }
  })
}