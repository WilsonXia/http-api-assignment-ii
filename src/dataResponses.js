const users = {};

const handleResponse = (request, response, code, data) => {
  // Assume JSON
  const stringData = JSON.stringify(data);
  const options = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(stringData, 'utf8'),
  };

  response.writeHead(code, options);
  if (request.method !== 'HEAD') {
    response.write(stringData);
  }
  response.end();
};

const getUsers = (request, response) => {
  const data = { users };
  handleResponse(request, response, 200, data);
};

const notReal = (request, response) => {
  const data = {
    message: `This page was not found`,
    id: 'notFound',
  };
  handleResponse(request, response, 404, data);
};

const addUser = (request, response) => {
  const data = {
    message: 'Name and Age are both required.',
  };
  // Destructuring
  const { name, age } = request.body;
  // Check if they exist
  if (!name || !age) {
    // If they dont, throw the error
    data.id = 'missingFields';
    handleResponse(request, response, 400, data);
  } else {
    // They both exist, so check if updating or adding
    let code = 204;
    if (!users[name]) {
      // Create the user and add them to the list
      users[name] = { name };
      data.message = 'Created Successfully';
      code = 201;
    }
    // Update the age
    users[name].age = age;
    if (code === 201) {
      handleResponse(request, response, code, data);
    } else {
      handleResponse(request, response, code, {});
    }
  }
};

module.exports = {
  getUsers,
  notReal,
  addUser,
};
