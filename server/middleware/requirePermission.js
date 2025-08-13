const db = require('../database');

const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: 'You must log in!' });
    }

    try {
      // Get permissions for the user's role
      const stmt = db.prepare(`
        SELECT p.action
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permissionId
        WHERE rp.roleId = ?
      `);
      const userPermissions = stmt.all(req.user.roleId).map(p => p.action);

      if (userPermissions.includes(requiredPermission)) {
        next(); // User has the required permission
      } else {
        res.status(403).send({ error: 'You do not have permission to perform this action.' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Error checking permissions.' });
    }
  };
};

module.exports = requirePermission;
