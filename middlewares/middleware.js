const express = require('express');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    /*
  const { token } = req.headers;

  if (!token) {
    return res.status(400).json({ error: "Token is not found" });
  }

  jwt.verify(token, process.env.JWT_TOKEN_KEY, (error, data) => {
    if (error) {
      console.log({ message: 'Invalid token.' });
      return res.status(401).json({ message: 'Invalid token.' });
    }

    console.log({ user: data });
    req.user = data; // Attach the user data to the request object for further use
    next();
  });*/
};

module.exports = { verifyToken };