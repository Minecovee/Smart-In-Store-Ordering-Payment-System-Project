'use strict';

module.exports = (sequelize, DataTypes) => {
  const MenuOption = sequelize.define('MenuOption', {
    menu_id: DataTypes.INTEGER,
    option_group_name: DataTypes.STRING,
    option_type: DataTypes.ENUM('single_choice', 'multiple_choice'),
    option_name: DataTypes.STRING,
    price_adjustment: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'menu_options',
    timestamps: false
  });

  MenuOption.associate = (models) => {
    MenuOption.belongsTo(models.Menu, {
      foreignKey: 'menu_id',
      as: 'menu',
    });
  };

  return MenuOption;
};
