const {
  team: Team,
  user: User,
  awardDetail: Award,
  finalResult: Winner,
  nominee: Nominee,
  role: Role,
  voter: Voter,
  votingBreakdown: Breakdown,
  awardType: AwardType
} = require('../../models');

Role.hasMany(User, {foreignKey: 'id_role', constraints: false});
User.belongsTo(Role, {foreignKey: 'id_role', constraints: false});
Team.hasMany(User, {foreignKey: 'id_team', constraints: false});
User.belongsTo(Team, {foreignKey: 'id_team', constraints: false});
Nominee.belongsTo(User, {foreignKey: 'id_nominee', as: 'nominee_name_1'});


Award.hasOne(Winner, {foreignKey: 'id_award', as: 'winner', constraints: false});
Winner.belongsTo(Award, {foreignKey: 'id_award', as: 'winner', constraints: false});

Winner.belongsTo(User, {foreignKey: 'id_winner', as: 'winner_name', constraints: false});
User.hasOne(Winner, {foreignKey: 'id_winner', as: 'winner_name', constraints: false});

Breakdown.belongsTo(User, {foreignKey: 'id_nominee', as: 'nominee_name', constraints: false});

Nominee.belongsTo(User, {foreignKey: 'id_nominee', as: 'nominee_name', constraints: false});

Award.hasOne(Voter, {foreignKey: 'id_award', constraints: false});
Voter.belongsTo(Award, {foreignKey: 'id_award', constraints: false});

AwardType.hasMany(Award, {foreignKey: 'id', constraints: false});
Award.belongsTo(AwardType, {foreignKey: 'type', constraints: false});
