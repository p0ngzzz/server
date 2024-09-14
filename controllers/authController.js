const User = require("../models/User");
const jwt = require("jsonwebtoken"); // for create refreshToken
const bcrypt = require("bcrypt"); // for hash password

// register
const register = async (req, res) => {
  const { username, email, first_name, last_name, password, password_confirm } =
    req.body;
  if (!username || !email || !first_name || !last_name || !password) {
    return res.status(422).json({ message: "Invalid field Input" });
  }
  // check password equal to password confirm
  if (password !== password_confirm)
    return res.status(422).json({ message: "Password not match" });

  // check user is in database?
  const userExists = await User.exists({ email }).exec(); //return promise then we use with async await to handle it
  if (userExists) return res.sendStatus(409); //used to indicate a conflict with the current state of a resource

  try {
    // when want work with async await do try catch
    // hashPassword
    const hashPassword = await bcrypt.hash(password, 10); //hash 10 rounds
    
    await User.create({
      email, // equal to email: email use in case name of key = name of var
      username,
      password: hashPassword,
      first_name,
      last_name,
    });

    return res.status(201).json({ message: "success registered" }); // 201 is created status : create completely
  } catch (err) {
    return res.status(400).json({ message: "Could not register" });
  }
};

// login
const login = async (req, res) => {
  // in case login we check email, password (sometime need check all of username, password, email)
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "username, email, password are required" });

  // find User in db
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(401).json({ message: "User not found" });

  // check match password using bcrypt: we not check password = password_db cause we hashPassword before we store it
  const matchPass = await bcrypt.compare(password, foundUser.password);
  if (!matchPass)
    return res
      .status(401)
      .json({ " message": "Email or Password is incorrect" });

  // use terminal to run command require('bcrypt').randomBytes(64).toString('hex)
  // to generate String for ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET

  // config what we data we want to use hash by jwt
  const accessToken = jwt.sign(
    // this case hash username, ACCESS_TOKEN_SECRET
    {
    //   username: foundUser.username,
      id: foundUser.id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1800s", // 30minutes
    }
  );

  const refreshToken = jwt.sign(
    {
    //   username: foundUser.username,
        id: foundUser.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d", // normally refreshToken is longer than accessToken
    }
  );

  // set refreshToken of user
  foundUser.refresh_token = refreshToken;

  await foundUser.save();

  //  after set refreshToken of user we need set jwt refreshToken to store cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }); //set duration of refreshToken in cookie 1 day equal to we set expiresIn in refreshToken

  console.log('req user in login api: ', req.user);
  res.status(200).json({ access_token: accessToken });
};

// logout
const logout = async (req, res) => {
  // logout mean remove refreshToken
  const cookies = req.cookies;

  if (!cookies.refresh_token) return res.sendStatus(204);

  const refreshToken = cookies.refresh_token;

  // check user who match with refreshToken
  const foundUser = await User.findOne({ refresh_token: refreshToken }).exec();
  if (!foundUser) {
    console.log('in condition foundUser')
    res.clearCookie("refresh_token", { httpOnly: true})
    //httpOnly: true => mean make sure we can only access cookies from HTTP(s) and cannot be accessed through JavaScript running in the browser
    // sameSite: None => be able to use cookies both inclined between client and server
    // secure: true => use with sameSite: None make sure can access by HTTP(S)
    // sameSite: None, secure: true use in client site with the browser (frontend)

    return res.status(204)
  }
  // console.log('before end')
  foundUser.refresh_token = null
  await foundUser.save();

  res.clearCookie("refresh_token", { httpOnly: true});
  res.sendStatus(204); // no content
};

// refresh route or when accessToken expire
const refresh = async (req, res) => {
    const cookies = req.cookies
    if(!cookies) return res.sendStatus(401) // unauthorized

    const refreshToken = cookies.refresh_token
    const foundUser = await User.findOne({ refresh_token: refreshToken }).exec();

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => { //callback
            if(err || foundUser.id !== decoded.id) return res.sendStatus(403) //Forbidden 

            // if condition false do this jwt.sign again
            const accessToken = jwt.sign(
                {  id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1800s' }
            )

            res.json({ access_token: accessToken })
        }
    )
};

// get user data
const user = async (req, res) => {
    // before do this create middleware which set the authenticated user to a request as parameter
    // or create verifyJWT
    console.log("request user api: ", req.user)
    // console.log(req.user)
    const user = req.user

    return res.status(200).json(user)
};

module.exports = { register, login, logout, refresh, user };
