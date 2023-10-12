const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    patronymic: {type: DataTypes.STRING},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    
},
{
    timestamps: false,
})

const Task = sequelize.define('task', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    heading: {type: DataTypes.STRING, allowNull: false},
    desc: {type: DataTypes.STRING, allowNull: false},
    dateComplete: {type: DataTypes.DATEONLY, allowNull: false},
    priority: {type: DataTypes.ENUM("Высокий", "Средний", "Низкий"), defaultValue: "Средний", allowNull: false},
    status: {type: DataTypes.ENUM(
        "К выполнению", 
        "Выполняется", 
        "Выполнена", 
        "Отменена"), 
        defaultValue: "К выполнению", 
        allowNull: false},
})

User.hasMany(User)

User.hasMany(Task, { as: 'Creator', foreignKey: 'creator_id' });
Task.belongsTo(User, {as: 'Creator', foreignKey: 'creator_id'});

User.hasMany(Task, { as: 'Executor', foreignKey: 'executor_id' });
Task.belongsTo(User, {as: 'Executor', foreignKey: 'executor_id'});

module.exports = { User, Task }