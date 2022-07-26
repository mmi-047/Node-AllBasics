const User = require('../models/User');
const Token = require('../models/token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail } = require('../utils');
const crypto = require('crypto')



const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;

  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken
  });

  const origin = 'http://localhost:3000'
  // const newOrigin = 'http://react-node-user-workflow-front-end.netlify.app'

  // console.log(req);
  // const tempOrigin = req.get('origin')
  // console.log(`origin:${tempOrigin}`);
  // const protocol = req.protocol
  // console.log(`protocol::${protocol}`);
  // const host = req.get('host')
  // console.log(`host:${host}`);

  // const forwardHost = req.get('x-forwerded-host')
  // const forwardedProtocol = req.get('x-forwarded-proto')
  // console.log(`forwarded host:${forwardedHost}`);
  // console.log(`forwarded Protocol:${forwardedProtocol}`);



  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin
  })
  // send verification token back only while testing in postman
  res.status(StatusCodes.CREATED).json({ msg: 'success! please check your email to verify account' })
};




const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }
  (user.isVerified = true), (user.verified = Date.now())
  user.verificationToken = '';

  await user.save()

  res.status(StatusCodes.OK).json({ msg: 'Email verified' })
}



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email')
  }

  const tokenUser = createTokenUser(user);



  // create refresh token

  let refreshToken = ''

  //  check for existing token

  const existingToken = await Token.findOne({ user: user._id })
  if (existingToken) {
    const { isValid } = existingToken

    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
  refreshToken = existingToken.refreshToken
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
  return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex')

  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = { refreshToken, ip, userAgent, user: user._id }

  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};


const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail
};
