const axios = require('axios');

const express = require('express');

const fetchFolders = async () => {
    try {
      let id = "63cec65400d1d045f423c191"
      const response = await axios.get('http://localhost:8080/enclosure/user/' + id);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
};

const apiUrl = "http://localhost:8080/token";

// create an Axios instance with the Authorization header
const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6InBlMTJuaSIsIm1haWwiOiJjaWFvMTExMzQxQHBlbmkuaXQiLCJpYXQiOjE2NzY0OTUyNjQsImV4cCI6MTY3NjQ5NTI3OX0.IqPdv2WLRgGB_QFqykaGHBBVNDhR_7Dq-2jFxcaGDw8`}
  }
);

// define the data you want to send in the request body
const requestData = { /* your data */ };

// make the POST request using the Axios instance
axiosInstance.post(apiUrl)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error.response.data);
  });



//fetchFolders();