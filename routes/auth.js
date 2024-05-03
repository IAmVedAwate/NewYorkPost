const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserModel = require('../model/userModel');
const PostModel = require('../model/postModel');
require('dotenv').config();

function authenticate(req, res, next) {

  const accessToken = req.headers['access-token'];
  if (!accessToken) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err)
    res.status(400).json({ msg: err });
  }
}

router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'You accessed the protected API' });
});

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    // Check if user already exists
    let user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username already exists' });
    }
    let emailtext = await UserModel.findOne({ email });
    if (emailtext) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const response = await UserModel.create({
      username: username,
      email: email,
      password: hash,
    });

    // Create and return JWT
    const payload = {
      id: response.id,
      email: response.email,
    };

    jwt.sign(
      payload,
      process.env.TOKEN,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.setHeader('access-token', token);
        res.json({
          token: token,
          success: true,
          msg: "Signup is Successfull!"
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



router.get('/posts', async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    PostModel.create({
      title,
      content,
    });

    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/password-reset', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const accessToken = req.headers['access-token'];
  try {
    const decoded = jwt.verify(accessToken, process.env.TOKEN);
    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect old password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await UserModel.updateOne({ email: decoded.email }, { $set: { password: hash } });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'example@gmail.com',
        pass: '12345'
      }
    });

    const mailOptions = {
      from: 'example@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: 'Your password has been reset.'
    };

    email_msg = `from: ${mailOptions.from},
      to: ${mailOptions.to},
      subject: ${mailOptions.subject},
      message: ${mailOptions.text}`;

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        email_msg = `from: ${mailOptions.from},
          to: ${mailOptions.to},
          subject: ${mailOptions.subject},
          message: ${mailOptions.text}`;
      } else {
        email_msg = ('Email sent: ' + info.response);
      }
    });

    res.json({ msg: "Password updated successfully", email_msg: email_msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.post('/validate', async (req, res) => {
  const token = req.body.auth;
  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    if (decoded) {
      console.log(decoded)
      res.status(200).json(
        {
          success: true
        }
      )
    }
    else {
      res.json({
        success: false
      })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ msg: err });
  }

});


module.exports = router;
