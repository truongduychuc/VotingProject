const {user: User, role: Role} = require('./models');
const Op = require('sequelize').Op;

async function test() {
  User.findAll({
    where: {
      is_active: true
    },
    include: {
      model: Role,
      where: {
        id: {
          [Op.ne]: 1
        }
      }
    }
  }).then(users => {
    users.forEach(u => {
      console.log(u);
    })
  })
}
test();
