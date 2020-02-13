const providerService = require('../services/providerService');
const debug = require('debug')('app:user');
const { InvalidCredentials, Unauthorized } = require('../lib/exceptionPool');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {
  createUserFromProfile,
  verifyTraditionalUser,
  verifyResendEmail,
  getTraditionalUser,
  createTraditionalUser,
  forgotPasswordEmail,
  changeForgottenPassword
} = require('../services/userServices');

module.exports = {
  async login(req, res) {
    const { provider, ...payload } = req.body;

    // Get user
    const user = await getUserFromCredentials(provider, payload);

    // JWT creation
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d'
    });

    // Return session bearer
    return { bearer: token };
  },

  // async logOut(req, res) {
  //   return { done: true, message: 'Logout correctly' };
  // },

  async loadUser(req, res, next) {
    const [, bearer] = (req.headers.authorization || '').split(' ');

    if (bearer) {
      const userJWT = jwt.verify(bearer, process.env.JWT_SECRET);
      const user = await User.findById(userJWT._id);
      req.user = user;
    }
    next();
  },

  async requireUser(req, res, next) {
    if (!req.user) throw new Unauthorized();
    next();
  },

  async requireNoUser(req, res, next) {
    if (req.user) throw new Unauthorized('User should not be logged');
    next();
  },

  async getUser(req, res) {
    return req.user.toPublic();
  },

  async register(req, res) {
    const { email, name, password } = req.body;
    await createTraditionalUser({ email, name, password });
    return { done: true, message: `Message sent to ${email}` };
  },

  async verify(req, res) {
    const { token } = req.body;
    const cleanToken = Buffer.from(token, 'base64').toString();
    const [userId, verifyEmailKey] = cleanToken.split('|');
    await verifyTraditionalUser(userId, verifyEmailKey);
    return { done: true, message: 'User verified' };
  },

  async verifyResend(req, res) {
    const { email, password } = req.body;
    await verifyResendEmail(email, password);
    return { done: true, message: `Message sent to ${email}` };
  },

  async forgotPassword(req, res) {
    const { email } = req.body;
    await forgotPasswordEmail(email);
    return { done: true, message: `Message sent to ${email}` };
  },

  async changePassword(req, res) {
    const { token, password } = req.body;
    const cleanToken = Buffer.from(token, 'base64').toString();
    const [userId, forgotPasswordKey] = cleanToken.split('|');
    await changeForgottenPassword({ userId, forgotPasswordKey, password });
    return { done: true, message: `Password changed` };
  }
};

/**
 * Given provider data, returns an user from db,
 * if not found and coming from social it creates a new one
 * @param {String} provider google|facebook|traditional
 * @param {Object} payload Provider needed info to login
 */
async function getUserFromCredentials(provider, payload) {
  if (!['google', 'facebook', 'traditional'].includes(provider)) {
    throw new InvalidCredentials('Invalid provider');
  }
  if (!payload || typeof payload !== 'object') {
    throw new InvalidCredentials('Invalid payload');
  }

  // Traditional
  if (provider === 'traditional') {
    return getTraditionalUser(payload);
  }

  // Social
  let profile;
  try {
    // Get profile from provider
    if (provider === 'google') {
      profile = await providerService.getProfileFromGoogle(payload);
    }
    if (provider === 'facebook') {
      profile = await providerService.getProfileFromFacebook(payload);
    }
  } catch (err) {
    throw new InvalidCredentials(err.message);
  }
  debug('login', provider, profile);
  return createUserFromProfile(provider, profile);
}
