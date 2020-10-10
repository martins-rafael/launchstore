const faker = require('faker');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');

async function createUsers() {
    const users = [];
    const password = await hash('123456', 8);

    while (users.length < 3) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.random.number(99999999),
            cep: faker.random.number(99999999),
            address: faker.address.streetName()
        });
    }

    const usersPromise = users.map(user => User.create(user));
    const usersId = await Promise.all(usersPromise);
}

createUsers();