'use strict';

module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('Menu', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    base_price: DataTypes.DECIMAL(10, 2),
    category: DataTypes.STRING,
    image_url: DataTypes.STRING,
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'menus',
    timestamps: false
  });

  Menu.associate = (models) => {
    Menu.hasMany(models.MenuOption, {
      foreignKey: 'menu_id',
      as: 'options',
      onDelete: 'CASCADE',
    });

    Menu.hasMany(models.OrderItem, {
      foreignKey: 'menu_id',
      onDelete: 'RESTRICT',
    });
  };

  return Menu;
};
